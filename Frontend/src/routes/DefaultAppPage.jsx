import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextValue";

const destinations = {
  dashboard: "/app/dashboard",
  todos: "/app/todos",
  habits: "/app/habits",
};

const DefaultAppPage = () => {
  const { user } = useAuth();
  return <Navigate replace to={destinations[user?.preferences?.defaultPage] || destinations.dashboard} />;
};

export default DefaultAppPage;
