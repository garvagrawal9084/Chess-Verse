import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Input } from "../index"; // Importing the custom Input component
import { useNavigate } from "react-router-dom";

// Define the form input types
type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  // Initialize react-hook-form
  const {
    register, // Used to register input fields for validation
    handleSubmit, // Function to handle form submission
    formState: { errors }, // Contains validation errors
  } = useForm<Inputs>();

  // State to manage login errors and loading status
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const login: SubmitHandler<Inputs> = async (data) => {
    setLoading(true); // Start loading state
    setLoginError(null); // Clear previous errors

    try {
      // Make a POST request to the login endpoint
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Check if login was successful
      if (!response.ok) {
        const errorData = await response.json();
        setLoginError(errorData.message || "Login failed");
      } else {
        const result = await response.json();
        console.log("Login successful:", result);
        // Store the token in localStorage
        localStorage.setItem("token", result.token);

        // Store the token, update context, or redirect the user if needed
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError("An unexpected error occurred");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        {/* Login heading */}
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {/* Form element */}
        <form onSubmit={handleSubmit(login)}>
          {/* Email Input Field */}
          <div className="mb-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              className=" w-full max-w-3/4 ml-3"
              {...register("email", { required: "Email is required"  ,})} // Register input for validation
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input Field */}
          <div className="mb-4">
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              className=" w-full max-w-3/4 ml-3"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Display login error message if any */}
          {loginError && (
            <p className="text-red-500 text-sm mb-4">{loginError}</p>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading} // Disable button while loading
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <div className="flex justify-center">
            <h3> Not a member Signup Now &nbsp; </h3>
            <a
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer"
            >
              Signup
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
