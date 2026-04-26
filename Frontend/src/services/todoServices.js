const BASE_URL = "http://localhost:5000/api/todos";

// Create todo
export const createTodo = async (todoData) => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create todo");
    }

    return data;
};

// Get all todos 
export const getAllTodos = async ({ page = 1, limit = 6, filter = "all", search = "" }) => {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
    params.append("filter", filter);

    // Only add search if it exists
    if (search && search.trim() !== "") {
        params.append("search", search.trim());
    }

    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch todos");
    }

    return data;
};

// Toggle todo completion
export const toggleTodoCompletion = async (todoId) => {
    const response = await fetch(`${BASE_URL}/${todoId}/toggle`, {
        method: "PATCH",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to toggle todo completion");
    }

    return data;
};

// Update todo
export const updateTodo = async (id, formData) => {
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
        throw new Error(data.message || "Failed to update todo");
    }

    return data;
};

// Delete a single todo
export const deleteTodo = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete todo");
    }

    return data;
};