import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/UI/Spinner";
import FormModal from "../components/UI/FormModal";

import TodoForm from "../components/Todos/TodoForm";
import { getTodo } from "../services/todoServices";

import { toast } from "react-hot-toast";

const TodoEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTodo = async () => {
      try {
        setLoading(true);
        const data = await getTodo(id);
        if (isMounted) {
          setTodo(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error.message);
          navigate("/app/todos");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTodo();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  if (loading) {
    return <Spinner fullPage size={40} />;
  }

  if (!todo) return null;

  return (
    <FormModal
      isOpen
      title="Edit Todo"
      subtitle="Update the details of this task"
      onClose={() => navigate(-1)}
    >
      <TodoForm
        todoToEdit={todo}
        onTodoCreated={() => {
          navigate(`/app/todos/${id}`); // back to focus mode
        }}
        onCancel={() => {
          navigate(-1); // go back
        }}
      />
    </FormModal>
  );
};

export default TodoEditPage;
