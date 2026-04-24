// import { useState, useEffect } from "react";

// import TodoHeader from "../components/Todos/TodoHeader";
// import TodoStats from "../components/Todos/TodoStats";
// import TodoFilters from "../components/Todos/TodoFilters";
// import TodoList from "../components/Todos/TodoList";
// import TodoPagination from "../components/Todos/TodoPagination";
// import TodoForm from "../components/Todos/TodoForm";

// import { getAllTodos } from "../services/todoServices";

// const TodosPage = () => {

//   const [showForm, setShowForm] = useState(false);
//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       {/* Pass handler to header */}
//       <TodoHeader onAddTodo={() => setShowForm(true)} />

//       {/* Conditional rendering */}
//       {showForm ? (
//         <TodoForm
//           onTodoCreated={() => {
//             fetchTodos(1, activeFilter);
//             setShowForm(false);
//           }}
//           onCancel={() => setShowForm(false)}
//         />
//       ) : (
//         <>
//           {/* Stats */}
//           {/* Pass original todos for stats */}
//           <TodoStats />

//           {/* Filters */}
//           {/* Pass filter control */}
//           <TodoFilters
//           />

//           {/* List */}
//           <TodoList
//           />

//           {/* Pagination */}
//           {pagination && (
//             <TodoPagination
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default TodosPage;
