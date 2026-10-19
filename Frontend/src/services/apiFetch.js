// Keep API transport failures consistent across every feature. A refused
// connection is different from an HTTP error returned by the backend.
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const NETWORK_RETRY_DELAYS_MS = [300, 900];

const resolveApiUrl = (input) => {
  if (typeof input === "string" && input.startsWith("/api/")) {
    return `${API_BASE_URL}${input}`;
  }
  return input;
};

const apiFetch = async (input, init) => {
  const requestUrl = resolveApiUrl(input);
  const { retryOnNetworkError, ...fetchOptions } = init || {};
  const method = (fetchOptions.method || "GET").toUpperCase();
  const canRetry = retryOnNetworkError ?? ["GET", "HEAD"].includes(method);

  let response;
  for (let attempt = 0; ; attempt += 1) {
    try {
      response = await fetch(requestUrl, fetchOptions);
      if (
        ![502, 503, 504].includes(response.status) ||
        !canRetry ||
        attempt >= NETWORK_RETRY_DELAYS_MS.length
      ) {
        break;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, NETWORK_RETRY_DELAYS_MS[attempt]),
      );
    } catch (error) {
      if (
        !(error instanceof TypeError) ||
        !canRetry ||
        attempt >= NETWORK_RETRY_DELAYS_MS.length
      ) {
        if (error instanceof TypeError) {
          throw new Error(
            "We couldn’t reach the service. Check your connection and try again.",
          );
        }
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, NETWORK_RETRY_DELAYS_MS[attempt]),
      );
    }
  }

  const contentType = response.headers.get("content-type") || "";

  // Clear stale client auth state if a protected API request rejects an
  // expired or missing session. Login and signup 401s are form errors.
  let requestPath = "";
  try {
    const rawUrl =
      typeof requestUrl === "string" ? requestUrl : requestUrl?.url || "";
    requestPath = new URL(
      rawUrl,
      globalThis.location?.origin || "http://localhost",
    ).pathname;
  } catch {
    // The request label still provides useful context for the caller.
  }
  const isCredentialSubmission =
    requestPath === "/api/auth/signin" ||
    requestPath === "/api/auth/signup";
  if (
    response.status === 401 &&
    !isCredentialSubmission &&
    typeof window !== "undefined"
  ) {
    window.dispatchEvent(new Event("taskflow:session-expired"));
  }

  // Proxies and hosting platforms may return an HTML error page if the API
  // process cannot be reached. Keep this distinct from JSON API errors.
  if (response.status >= 500 && !contentType.includes("application/json")) {
    throw new Error(
      "Something went wrong while contacting the service. Please try again in a moment.",
    );
  }

  return response;
};

export default apiFetch;
