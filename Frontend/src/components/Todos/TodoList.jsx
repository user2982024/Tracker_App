import TodoCard from "./TodoCard";

const TodosList = () => {
  return (
    <div className="bg-white border rounded-xl divide-y">

      {/* Static Todo Items (for now) */}
      <TodoCard />
      <TodoCard />
      <TodoCard />
      <TodoCard />
      <TodoCard />

    </div>
  );
};

export default TodosList;