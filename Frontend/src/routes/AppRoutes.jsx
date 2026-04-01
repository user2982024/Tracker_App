import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../Layouts/AppLayout";
import AuthLayout from "../Layouts/AuthLayout";

// Pages
import LandingPage from "../pages/LandingPage";
import AuthForm from "../components/Auth/AuthForm";

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
    </Routes>
  );
};

export default AppRoutes;
