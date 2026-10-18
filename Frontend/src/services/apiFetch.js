// Keep API transport failures consistent across every feature. A refused
// connection is different from an HTTP error returned by the backend.
const getRequestLabel = (input, init) => {
  const method = (init?.method || input?.method || "GET").toUpperCase();
  const rawUrl = typeof input === "string" ? input : input?.url || "";

  try {
    const url = new URL(rawUrl, globalThis.location?.origin || "http://localhost");
    return `${method} ${url.pathname}`;
  } catch {
    return method;
  }
};

const apiFetch = async (input, init) => {
  const requestLabel = getRequestLabel(input, init);

  try {
    const response = await fetch(input, init);
    const contentType = response.headers.get("content-type") || "";

    // Clear stale client auth state if a protected API request rejects an
    // expired or missing session. Login and signup 401s are form errors.
    let requestPath = "";
    try {
      const rawUrl = typeof input === "string" ? input : input?.url || "";
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

    // Vite's proxy can return an HTML 500 page when the API process is down.
    // Turn that into the same useful message as a refused browser connection.
    if (response.status >= 500 && !contentType.includes("application/json")) {
      throw new Error(
        `The API proxy could not complete ${requestLabel}. Check that the backend is running on port 5000 and that /api/health is available.`,
      );
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Could not connect while making ${requestLabel}. Check the frontend dev server and the backend at /api/health, then try again.`,
      );
    }

    throw error;
  }
};

export default apiFetch;
