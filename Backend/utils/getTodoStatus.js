const getTodoStatus = (todo) => {
    const now = new Dtae();

    if (todo.completed) {
        return "Completed";
    }

    if (todo.dueDate && new Date(todo.dueDate) < now) {
    return "overdue";

    return "in progress";
  }
};

module.exports = getTodoStatus;