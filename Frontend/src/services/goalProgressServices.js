const BASE_URL = "http://localhost:5000/api/goals";

// Add progress to a goal
export const addGoalProgress = async (goalId, progressData) => {
    const response = await fetch(
        `${BASE_URL}/${goalId}/progress`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(progressData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to add goal progress");
    }

    return data;
}

// Get progress history for a goal
export const getGoalProgress = async (goalId) => {
  const response = await fetch(
    `${BASE_URL}/${goalId}/progress`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch goal progress"
    );
  }

  return data;
};

// Delete a progress entry
export const deleteGoalProgress = async (progressId) => {
    const response = await fetch (
        `${BASE_URL}/progress/${progressId}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete goal progress");
    }

    return data;
}