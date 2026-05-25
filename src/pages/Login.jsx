import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "react-hook-form";
import { FaLock, FaUser } from "react-icons/fa";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { auth } from "../../firebase.config";
import GoogleLogo from "../assets/icons/google.svg";
import HeadTag from "../components/common/HeadTag";
import LoaderDotted from "../components/common/LoaderDotted";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const errorMap = {
  "auth/invalid-email": "Invalid email address.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
};

export default function Login() {
  const { user, setUser, isUserLoading, userLogin, loginWithGoogle } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const userCredential = await userLogin(data.email, data.password);
      return userCredential.user;
    },
    onSuccess: async (user) => {
      setUser(user);
      toast.success("Login successful!");
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      const message = errorMap[error.code] || "Login failed.";
      toast.error(message);
      console.log(error);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      const userCredential = await loginWithGoogle();
      setUser(userCredential.user);
      return userCredential.user;
    },
    onSuccess: async (user) => {
      await axiosSecure.post(`/users`, {
        email: user.email,
      });
      toast.success("Login successful!");
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      const message = errorMap[error.code] || "Login failed.";
      toast.error(message);
      console.log(error);
    },
  });

  // Forgot Password Handler
  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      const message = errorMap[error.code] || "Failed to send reset email.";
      toast.error(message);
    }
  };

  if (isUserLoading) return <LoaderDotted />;

  if (user) return <Navigate to="/" replace />;

  return (
    <>
      <HeadTag title="Creators Hub Academy | Login" />
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-zinc-950 border border-zinc-800 shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Welcome Back to{" "}
            <span className="text-yellow-400">Creators Hub Academy</span>
          </h2>

          <form onSubmit={handleSubmit(loginMutation.mutate)}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Email
              </label>
              <div className="flex items-center border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900">
                <FaUser className="text-yellow-400 mr-2" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter your email"
                  className="w-full outline-none bg-transparent text-white placeholder-gray-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Password
              </label>
              <div className="flex items-center border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900">
                <FaLock className="text-yellow-400 mr-2" />
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Enter your password"
                  className="w-full outline-none bg-transparent text-white placeholder-gray-500"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-yellow-400 hover:underline text-sm font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-medium py-2 rounded-md hover:bg-yellow-500 transition duration-300"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              state={{ from: location.state?.from || "/" }}
              className="text-yellow-400 hover:underline font-semibold"
            >
              Register here
            </Link>
          </p>

          <div className="divider text-gray-500 before:bg-zinc-700 after:bg-zinc-700">
            OR
          </div>

          {/* Google Login Button */}
          <button
            className="w-full border border-zinc-700 text-gray-300 py-2 rounded-md hover:bg-zinc-900 hover:border-zinc-600 transition duration-300 font-medium"
            disabled={googleLoginMutation.isPending}
            onClick={() => googleLoginMutation.mutate()}
          >
            <span className="flex items-center justify-center">
              <img
                src={GoogleLogo}
                alt="Google Logo"
                className="w-6 h-6 mr-2"
              />
              {googleLoginMutation.isPending
                ? "Logging with Google..."
                : "Login with Google"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
