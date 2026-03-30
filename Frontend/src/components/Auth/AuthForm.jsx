import React, { useState } from "react";

const AuthForm = ({ mode = "signup" }) => {
  const isSignup = mode === "signup";

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
  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (isSignup && !formData.name) {
        setError("Name is required");
        return;
      }

      if (!formData.email || !formData.password) {
        setError("Email and password are required");
        return;
      }

      console.log("Form submitted:", formData);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
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
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           transition"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg 
                       font-medium hover:bg-blue-700 transition duration-200"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>

          {/* Switch Link */}
          <p className="text-sm text-center text-gray-500">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <span className="text-blue-600 ml-1 cursor-pointer hover:underline">
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
