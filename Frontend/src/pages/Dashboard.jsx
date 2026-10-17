import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold text-foreground">
        Welcome back, {user?.name || "there"}
      </h1>
      <p className="text-foreground-secondary">
        Here’s a quick look at your day and the progress you’re making.
      </p>
    </header>
  );
};

export default Dashboard;
