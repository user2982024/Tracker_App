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
export const getAllTodos = async (page = 1, limit = 6, filter = "all") => {
    const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}&filter=${filter}`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Filed to fetch todos");
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
}