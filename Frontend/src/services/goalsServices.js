const BASE_URL = "http://localhost:5000/api/goals";

// Create goal
export const createGoal = async (goalData) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goalData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create goal");
  }

  return data;
};

// Get all goals
export const getGoals = async (queryParams = "") => {
  const response = await fetch(`${BASE_URL}${queryParams}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch goals");
  }

  return data;
};
