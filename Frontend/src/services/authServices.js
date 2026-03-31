// Base URL
const BASE_URL = "http://localhost:5000/api/auth";

// Signup API
export const signupUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      // Handle validation errors
      if (result.errors && result.errors.length > 0) {
        throw result.errors[0].msg; // first validation message
      }

      throw result.message || "Request failed";
    }

    return result;
  } catch (error) {
    throw new Error(
      error.message || "An unexpected error occurred during signup",
    );
  }
};

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
      if (result?.errors?.length > 0) {
        throw new Error(result.errors[0].message);
      }

      throw new Error(result?.message || "Request failed");
    }

    return result;
  } catch (error) {
    throw new Error(
      error.message || "An unexpected error occured during signin",
    );
  }
};
