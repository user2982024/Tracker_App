const BASE_URL = "/api/settings";

const request = async (path = "", options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result?.message || result?.errors?.[0]?.message || "Unable to update settings",
    );
  }

  return result;
};

export const getSettings = () => request();

export const updateProfile = (data) =>
  request("/profile", { method: "PATCH", body: JSON.stringify(data) });

export const changePassword = (data) =>
  request("/password", { method: "PATCH", body: JSON.stringify(data) });

export const updatePreferences = (data) =>
  request("/preferences", { method: "PATCH", body: JSON.stringify(data) });
