import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { signinUser, signupUser } from "../../services/authServices";
import ThemeToggle from "../UI/ThemeToggle";

const AuthForm = ({ mode = "signup" }) => {
  const { setUser } = useAuth();
  const isSignup = mode === "signup";

  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Validation
      if (isSignup && !formData.name) {
        setError("Name is required");
        setLoading(false);
        return;
      }

      if (!formData.email || !formData.password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      // API Call
      const data = isSignup
        ? await signupUser(formData)
        : await signinUser(formData);

      // Update global auth state
      setUser(data.data);

      // Success toast
      toast.success(
        isSignup ? "Account created successfully" : "Login successful",
      );

      console.log("Response", data);

      // Navigate after auth
        navigate("/app", { replace: true });

    } catch (err) {
      // Error toast
      const message = err?.message || err || "Something went wrong";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-surface-secondary px-4">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-md p-8">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-foreground text-center mb-6">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          {/* Name (Signup Only) */}
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg placeholder:text-foreground-muted 
                           focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 
                           transition"
              />
              <p className="text-xs text-foreground-muted mt-1">
                Name must be between 5 and 30 characters
              </p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg placeholder:text-foreground-muted 
                         focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 
                         transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg placeholder:text-foreground-muted 
                         focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 
                         transition"
            />
            <p className="text-xs text-foreground-muted mt-1">
              Must be at least 6 characters and include uppercase, lowercase,
              and a number
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg 
                       font-medium hover:bg-blue-700 transition duration-200 hover:cursor-pointer"
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
          </button>

          {/* Switch Link */}
          <p className="text-sm text-center text-foreground-muted">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <span className="text-blue-600 ml-1 cursor-pointer hover:underline" onClick={() => navigate(`/${isSignup ? 'signin' : 'signup'}`)}>
              {isSignup ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
