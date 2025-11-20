import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Input } from "../index";

type Inputs = {
  username: string;
  email: string;
  password: string;
  comfirmPassword: string;
};

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [signupError, setSignupError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp: SubmitHandler<Inputs> = async (data) => {
    setLoading(true); // start loading state
    setSignupError(null); // clean previous error

    try {
      // Make a post request to the login endpoint
      console.log(data);
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Raw response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        setSignupError(errorData.message || "Signup failed");
      } else {
        const result = await response.json();
        console.log("Signup Successful : ", result);
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error: ", error);
      setSignupError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {/* Signup Handling */}
        <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>

        {/* Form element */}
        <form onSubmit={handleSubmit(signUp)}>
          {/* Email input Field */}
          <div className="mb-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              className=" w-full max-w-3/4 ml-3"
              {...register("email", { required: "Email is required" })} // Register input for validation
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Username element */}
          <div className="mb-4">
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              className="w-full max-w-3/4 ml-3"
              {...register("username", {
                required: "Username is required",
                maxLength: {
                  value: 30,
                  message: "Username cannot exceed 30 characters",
                },
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Input Field */}
          <div className="mb-4">
            <Input
              label="Passwor"
              type="password"
              placeholder="Enter your password"
              className="w-full max-w-3/4 ml-3"
              {...register("password", {
                required: "password is required",
                pattern: {
                  value: /@/, // regex to check for @ symbol
                  message: "Password must include at least one '@' symbol",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Display login error message if any */}
          {signupError && (
            <p className="text-red-500 text-sm mb-4">{signupError}</p>
          )}

          {/* Signup Button */}
          <Button
            type="submit"
            disabled={loading} // Disable button while loading
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <div className="flex justify-center">
            <h3> Already a member Login Now &nbsp; </h3>
            <a
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
