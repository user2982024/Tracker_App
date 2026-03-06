const getTodoStatus = (todo) => {
  const now = new Date();

  if (todo.completed) {
    return "Completed";
  }

  if (todo.dueDate && new Date(todo.dueDate) < now) {
    return "overdue";
  }
  return "in progress";
};

module.exports = getTodoStatus;
