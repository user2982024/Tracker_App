import { Routes, Route } from "react-router-dom";

// Protected Routes
import ProtectedRoutes from "./ProtectedRoutes";

// Layouts
import AppLayout from "../Layouts/AppLayout";
import AuthLayout from "../Layouts/AuthLayout";

// Pages
import LandingPage from "../pages/LandingPage";
import AuthForm from "../components/Auth/AuthForm";
import Dashboard from "../pages/Dashboard";
import NotesPage from "../pages/NotesPage";
import TodosPage from "../pages/TodosPage";
import GoalsPage from "../pages/GoalsPage";
import HabbitsPage from "../pages/HabbitsPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <AuthForm mode="signup" />
          </AuthLayout>
        }
      />
      <Route
        path="/signin"
        element={
          <AuthLayout>
            <AuthForm mode="signin" />
          </AuthLayout>
        }
      />

      <Route element={<ProtectedRoutes />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="todos" element={<TodosPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="habits" element={<HabbitsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
