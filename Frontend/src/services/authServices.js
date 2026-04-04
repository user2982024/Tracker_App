// Base URL
const BASE_URL = "http://localhost:5000/api/auth";

// Helper to extract error safely (VERY IMPORTANT)
const extractErrorMessage = (result) => {
  if (result?.errors?.length > 0) {
    const err = result.errors[0];
    return err.message || err.msg || "Validation error";
  }

  return result?.message || result?.error || "Request failed";
};

// Signup API
export const signupUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(extractErrorMessage(result));
    }

    return result;
  } catch (error) {
    throw new Error(
      error.message || "An unexpected error occurred during signup"
    );
  }
};

// Signin API
export const signinUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(extractErrorMessage(result));
    }

    return result;
  } catch (error) {
    throw new Error(
      error.message || "An unexpected error occurred during signin"
    );
  }
};

// Get current authenticated user API
export const getAuthenticatedUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Not authenticated");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch user");
  }
};

// Signout API 
export const signoutUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/signout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Logout failed");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Logout failed");
  }
};