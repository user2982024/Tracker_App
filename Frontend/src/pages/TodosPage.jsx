import TodosHeader from "../components/Todos/TodosHeader";
import TodosStats from "../components/Todos/TodosStats";
import TodosFilters from "../components/Todos/TodosFilters";
import TodosList from "../components/Todos/TodosList";
import TodosPagination from "../components/Todos/TodosPagination";

const TodosPage = () => {
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <TodosHeader onAddTodo={() => console.log("Open create todo modal")} />

      {/* Stats */}
      <TodosStats />

      {/* Filters */}
      <TodosFilters />

      {/* List */}
      <TodosList />

      {/* Pagination */}
      <TodosPagination />

    </div>
  );
};

export default TodosPage;
