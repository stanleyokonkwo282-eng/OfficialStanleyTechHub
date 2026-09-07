import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "react-hook-form";
import { FaLock, FaUser } from "react-icons/fa";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { auth } from "../../firebase.config";
import GoogleLogo from "../assets/icons/google.svg";
import HeadTag from "../components/common/HeadTag";
import LoaderDotted from "../components/common/LoaderSpinner";
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
      sessionStorage.setItem("chub_justLoggedIn", "true");
      toast.success("Welcome back, Stanley! 👋 Your dashboard is ready.", {
        autoClose: 5000,
      });
      if (location.state?.from) {
        navigate(location.state.from, { state: location.state });
      } else {
        navigate("/", { state: location.state });
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
      sessionStorage.setItem("chub_justLoggedIn", "true");
      toast.success("Welcome back, Stanley! 👋 Your dashboard is ready.", {
        autoClose: 5000,
      });
      if (location.state?.from) {
        navigate(location.state.from, { state: location.state });
      } else {
        navigate("/", { state: location.state });
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
      <div className="relative min-h-screen overflow-hidden bg-[#030b17] px-4 py-10 text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-amber-400/20 blur-[110px]" aria-hidden />
          <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-sky-500/15 blur-[120px]" aria-hidden />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" aria-hidden />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "52px 52px" }} aria-hidden />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#091827]/80 shadow-[0_30px_90px_rgba(2,6,23,0.8)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#071320] via-[#091827] to-[#0b1320] p-10 lg:flex lg:flex-col lg:justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_28%)]" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200">
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  Student Portal
                </span>
                <h1 className="mt-8 max-w-md text-4xl font-black leading-tight tracking-[-0.06em] text-white">
                  Step into your next skill chapter.
                </h1>
              </div>

              <div className="relative z-10 space-y-6">
                <p className="max-w-md text-base leading-relaxed text-slate-300">
                  Learn practical creative and digital skills that grow your career, your income, and your confidence.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <p className="text-2xl font-black text-amber-300">25+</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Courses</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <p className="text-2xl font-black text-amber-300">3k+</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Students</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-[#091827]/80 p-6 sm:p-8 lg:p-10"
            >
              <div className="mb-8 text-center lg:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-300">Welcome back</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Login to <span className="text-amber-300">Creators Hub</span>
                </h2>
              </div>

              <form onSubmit={handleSubmit(loginMutation.mutate)} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Email
                  </label>
                  <div className="flex items-center rounded-xl border border-white/10 bg-[#0d1d2b] px-3 py-3 transition focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-400/20">
                    <FaUser className="mr-3 text-amber-300" />
                    <input
                      type="email"
                      {...register("email", { required: "Email is required" })}
                      placeholder="Enter your email"
                      className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Password
                  </label>
                  <div className="flex items-center rounded-xl border border-white/10 bg-[#0d1d2b] px-3 py-3 transition focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-400/20">
                    <FaLock className="mr-3 text-amber-300" />
                    <input
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-amber-300 transition hover:text-amber-200"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-4 py-3 font-black text-slate-950 shadow-[0_18px_35px_rgba(250,204,21,0.28)] transition-transform hover:-translate-y-0.5"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Log In"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  state={{ from: location.state?.from || "/" }}
                  className="font-semibold text-amber-300 hover:text-amber-200"
                >
                  Register here
                </Link>
              </p>

              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                <span className="h-px flex-1 bg-white/10" />
                <span>Or</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button
                className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-[#0d1d2b] px-4 py-3 font-semibold text-slate-100 transition hover:border-amber-400/50 hover:bg-[#112235]"
                disabled={googleLoginMutation.isPending}
                onClick={() => googleLoginMutation.mutate()}
              >
                <img src={GoogleLogo} alt="Google Logo" className="mr-3 h-5 w-5" />
                {googleLoginMutation.isPending ? "Logging with Google..." : "Login with Google"}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
