
const BASE_URL = "/api/habits";

// Create habit
export const createHabit = async (habitData) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(habitData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create habit");
  }

  return data;
};

// Get all habits with optional query parameters
// Example: getHabits("?page=1&limit=10&category=health")
export const getHabits = async (queryParams = "") => {
  const response = await fetch(`${BASE_URL}${queryParams}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch habits");
  }

  return data;
};

// Get a single habit
export const getHabit = async (habitId) => {
  const response = await fetch(`${BASE_URL}/${habitId}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch habit");
  }

  return data.data;
};

// Update habit
export const updateHabit = async (habitId, habitData) => {
  const response = await fetch(`${BASE_URL}/${habitId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(habitData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update habit");
  }

  return data;
};

// Archive or restore habit
export const archiveHabit = async (habitId, isArchived = true) => {
  const response = await fetch(`${BASE_URL}/${habitId}/archive`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isArchived }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        (isArchived
          ? "Failed to archive habit"
          : "Failed to restore habit"),
    );
  }

  return data;
};

// Delete a single habit
export const deleteHabit = async (habitId) => {
  const response = await fetch(`${BASE_URL}/${habitId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete habit");
  }

  return data;
};

// Mark a habit as completed
export const completeHabit = async (
  habitId,
  { date, value, note } = {},
) => {
  const completionData = { date };

  if (value !== undefined && value !== null && value !== "") {
    completionData.value = Number(value);
  }

  if (note !== undefined) {
    completionData.note = note;
  }

  const response = await fetch(
    `${BASE_URL}/${habitId}/completions`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completionData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to mark habit as completed",
    );
  }

  return data;
};

// Undo a habit completion
export const undoHabitCompletion = async (completionId) => {
  const response = await fetch(
    `${BASE_URL}/completions/${completionId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to undo habit completion");
  }

  return data;
};

// Get completion history for a habit
// Example: getHabitHistory(habitId, "?page=1&limit=30")
export const getHabitHistory = async (
  habitId,
  queryParams = "",
) => {
  const response = await fetch(
    `${BASE_URL}/${habitId}/history${queryParams}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch habit history");
  }

  return data;
};

// Get current streak for a habit
export const getHabitStreak = async (habitId) => {
  const response = await fetch(`${BASE_URL}/${habitId}/streak`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch habit streak");
  }

  return data;
};
