import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/UI/Spinner";

import TodoForm from "../components/Todos/TodoForm";
import { getTodo } from "../services/todoServices";

import { toast } from "react-hot-toast";

const TodoEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch todo by ID
  const fetchTodo = async () => {
    try {
      setLoading(true);
      const data = await getTodo(id);
      setTodo(data);
    } catch (error) {
      toast.error(error.message);
      navigate("/app/todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [id]);

  if (loading) {
    return <Spinner fullPage size={40} />;
  }

  if (!todo) return null;

  return (
    <div className="p-6">
      <TodoForm
        todoToEdit={todo}
        onTodoCreated={() => {
          navigate(`/app/todos/${id}`); // back to focus mode
        }}
        onCancel={() => {
          navigate(-1); // go back
        }}
      />
    </div>
  );
};

export default TodoEditPage;
