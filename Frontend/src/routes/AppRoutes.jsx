import { Routes, Route } from "react-router-dom";

// Protected Routes
import ProtectedRoutes from "./ProtectedRoutes";

// Public Routes
import PublicRoutes from "./PublicRoutes";

// Layouts
import AppLayout from "../Layouts/AppLayout";
import AuthLayout from "../Layouts/AuthLayout";

// Pages
import LandingPage from "../pages/LandingPage";
import Dashboard from "../pages/Dashboard";
import NotesPage from "../pages/NotesPage";
import TodosPage from "../pages/TodosPage";
import GoalsPage from "../pages/GoalsPage";
import HabbitsPage from "../pages/HabbitsPage";
import ArchivedNotesPage from "../pages/ArchivedNotesPage";
import NoteViewPage from "../pages/NoteViewPage";
import TodoViewPage from "../pages/TodoViewPage";
import TodoEditPage from "../pages/TodoEditPage";

// Forms
import AuthForm from "../components/Auth/AuthForm";
import NoteEditPage from "../pages/NoteEditPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<LandingPage />} />

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
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />

          {/* Notes routes */}
          <Route path="notes" element={<NotesPage />} />
          <Route path="notes/archive" element={<ArchivedNotesPage />}/>
          <Route path="notes/:id" element={<NoteViewPage />}/>
          <Route path="notes/:id/edit" element={<NoteEditPage />} />

          {/* Todos routes */}
          <Route path="todos" element={<TodosPage />} />
          <Route path="todos/edit/:id" element={<TodoEditPage />} />
          <Route path="todos/:id" element={<TodoViewPage />} /> 
          
          <Route path="goals" element={<GoalsPage />} />
          <Route path="habits" element={<HabbitsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;