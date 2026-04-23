import TodoCard from "./TodoCard";

const TodosList = ({ todos, loading }) => {
  // Loading state
  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
        Loading todos...
      </div>
    );
  }

  // Empty state
  if (!todos || todos.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
        No todos found. Create your first todo
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl divide-y">
      {todos.map((todo) => (
        <TodoCard key={todo._id} todo={todo} />
      ))}
    </div>
  );
};

export default TodosList;
