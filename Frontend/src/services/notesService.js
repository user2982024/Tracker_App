const BASE_URL = "http://localhost:5000/api/notes";

// Create note
export const createNote = async (formData) => {
  const response = await fetch(`${BASE_URL}/create-note`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create note");
  }

  return data;
};

// Get all notes (with pagination)
export const getNotes = async (page = 1, limit = 9) => {
  const response = await fetch(
    `${BASE_URL}?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch notes");
  }

  return data;
};

// Update note
export const updateNote = async (id, formData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }, body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update note");
  }
};