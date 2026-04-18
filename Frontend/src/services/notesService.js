const BASE_URL = "http://localhost:5000/api/notes";

// Create note
export const createNote = async (formData) => {
  const response = await fetch(`${BASE_URL}`, {
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
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
  });

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
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update note");
  }

  return data;
};

// Delete a single note
export const deleteNote = async (noteId) => {
    const response = await fetch(`${BASE_URL}/${noteId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete note");
    }

    return data;
};

// Dlete all notes
export const deleteAllNotes = async () => {
    const response = await fetch(`${BASE_URL}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete notes");
    }

    return data;
};

// Archive a note
export const archiveNote = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/archive`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to archive note");
  }

  return data;
};

// Get all archived notes
export const getArchivedNotes = async(page = 1, limit = 9) => {
  const response = await fetch(`${BASE_URL}/archived?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch archived notes");
  }

  return data;
};

// Unarchive a note
export const unarchiveNote = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/unarchive`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to unarchive note");
  }

  return data;
};

// Pin a note
export const pinNote = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/pin`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to pin note");
  }

  return data;
};

// Unpin a note
export const unpinNote = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/unpin`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to unpin note");
  }

  return data;
};