const BASE_URL = "http://localhost:5000/api/notes";

// Create note
export const createNote = async (formData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    credentials: "include", // importnat for cookies (JWT)
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

// Get all notes
export const getNotes = async () => {
  const response = await fetch(BASE_URL, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Fialed to fetch notes");
  }

  return data;
};
