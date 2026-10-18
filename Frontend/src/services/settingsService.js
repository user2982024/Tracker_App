import apiFetch from "./apiFetch.js";
const BASE_URL = "/api/settings";

const request = async (path = "", options = {}) => {
  const response = await apiFetch(`${BASE_URL}${path}`, {
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

const downloadExport = async (path, fallbackName, fallbackMessage) => {
  const response = await apiFetch(`${BASE_URL}${path}`, { credentials: "include" });
  if (!response.ok) {
    let message = fallbackMessage;
    try {
      const result = await response.json();
      message = result?.message || message;
    } catch {
      // Use the fallback message when the server response is not JSON.
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = response.headers.get("Content-Disposition")?.match(/filename="?([^";]+)"?/)?.[1]
    || fallbackName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const exportData = () => downloadExport(
  "/export",
  `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`,
  "Unable to prepare your backup",
);

export const exportPdfReport = () => downloadExport(
  "/export/pdf",
  `taskflow-report-${new Date().toISOString().slice(0, 10)}.pdf`,
  "Unable to prepare your PDF report",
);
