import { Routes, Route } from "react-router-dom";

// Route guards
import ProtectedRoutes from "./ProtectedRoutes";
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
import Habits from "../pages/Habits";
import ArchivedNotesPage from "../pages/ArchivedNotesPage";
import NoteViewPage from "../pages/NoteViewPage";
import NoteEditPage from "../pages/NoteEditPage";
import TodoViewPage from "../pages/TodoViewPage";
import TodoEditPage from "../pages/TodoEditPage";
import GoalEditPage from "../pages/GoalEditPage";
import GoalCreatePage from "../pages/GoalCreatePage";
import GoalViewPage from "../pages/GoalViewPage";
import GoalProgressHistoryPage from "../pages/GoalProgressHistoryPage";
import HabitHistory from "../components/Habits/HabitHistory";
import SettingsPage from "../pages/SettingsPage";

// Forms
import AuthForm from "../components/Auth/AuthForm";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
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

      {/* Protected application routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />

          {/* Notes */}
          <Route path="notes" element={<NotesPage />} />
          <Route path="notes/archive" element={<ArchivedNotesPage />} />
          <Route path="notes/:id" element={<NoteViewPage />} />
          <Route path="notes/:id/edit" element={<NoteEditPage />} />

          {/* To-Dos */}
          <Route path="todos" element={<TodosPage />} />
          <Route path="todos/edit/:id" element={<TodoEditPage />} />
          <Route path="todos/:id" element={<TodoViewPage />} />

          {/* Goals */}
          <Route path="goals" element={<GoalsPage />} />
          <Route path="goals/create" element={<GoalCreatePage />} />
          <Route path="goals/edit/:id" element={<GoalEditPage />} />
          <Route
            path="goals/:id/history"
            element={<GoalProgressHistoryPage />}
          />
          <Route path="goals/:id" element={<GoalViewPage />} />

          {/* Habits */}
          <Route path="habits" element={<Habits />} />
          <Route path="habits/:habitId/history" element={<HabitHistory />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
