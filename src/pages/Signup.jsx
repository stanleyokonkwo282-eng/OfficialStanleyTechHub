import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaImage, FaLock, FaMailBulk, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import HeadTag from "../components/common/HeadTag";
import LoaderSpinner from "../components/common/LoaderSpinner";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const errorMap = {
  "auth/invalid-email": "Invalid email address.",
  "auth/email-already-in-use": "Email already in use.",
  "auth/weak-password": "Password should be at least 6 characters long.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
};

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const axiosSecure = useAxiosSecure();
  const referrerEmail = searchParams.get("ref");

  const { userSignup, setUser, updateUserProfile, isUserLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const userCredential = await userSignup(data.email, data.password); // Create user on firebase
      await updateUserProfile(userCredential.user, data.name, data.photoURL); // Update user profile on firebase
      await userCredential.user.reload(); // Reload user to get updated profile
      return userCredential.user;
    },
    onSuccess: async (user) => {
      // Save user in database on MongoDB
      // server will set default role student
      await axiosSecure.post(`/users`, {
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });

      // Track referral if present
      if (referrerEmail && referrerEmail !== user.email) {
        try {
          await axiosSecure.post("/referrals", {
            referrerEmail,
            refereeEmail: user.email,
            refereeName: user.displayName || user.email,
            courseId: null,
            metadata: { source: "signup" },
          });
        } catch {
          // non-blocking
        }
      }

      setUser({ ...user, role: "student" });
      reset();
      toast.success("Signup successful!");
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      console.log(error);
      const message = errorMap[error.code] || "Signup failed.";
      toast.error(message);
    },
  });
  const handleSubmitForm = (data) => {
    if (signupMutation.isPending) return;
    signupMutation.mutate(data);
  };

  if (isUserLoading) return <LoaderSpinner />;

  return (
    <>
      <HeadTag title="Creators Hub Academy | Signup" />
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-zinc-950 border border-zinc-800 shadow-lg rounded-lg p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Create an account
          </h2>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Name
              </label>
              <div className="flex items-center border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900">
                <FaUser className="text-yellow-400 mr-2" />
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your name"
                  className="w-full outline-none bg-transparent text-white placeholder-gray-500"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Email
              </label>
              <div className="flex items-center border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900">
                <FaMailBulk className="text-yellow-400 mr-2" />
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

            {/* Photo URL */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Photo URL
              </label>
              <div className="flex items-center border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900">
                <FaImage className="text-yellow-400 mr-2" />
                <input
                  type="url"
                  {...register("photoURL", {
                    required: "Photo URL is required",
                  })}
                  placeholder="Enter your photo URL"
                  className="w-full outline-none bg-transparent text-white placeholder-gray-500"
                />
              </div>
              {errors.photoURL && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.photoURL.message}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-medium py-2 rounded-md hover:bg-yellow-500 transition duration-300"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-400 hover:underline font-semibold"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}