import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCamera, FaEye, FaEyeSlash, FaImage, FaLock, FaMailBulk, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import HeadTag from "../components/common/HeadTag";
import LoaderSpinner from "../components/common/LoaderSpinner";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import handleUpload from "../utils/ImageUploadApi";

const getFriendlySignupError = (error) => {
  const code = error?.code || "";
  const map = {
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/email-already-in-use":
      "This email is already registered. Try logging in instead — or reset your password.",
    "auth/weak-password": "Password is too weak — use at least 6 characters with a mix of letters & numbers.",
    "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
    "auth/operation-not-allowed": "Registration is temporarily disabled. Please contact support.",
  };
  if (map[code]) return map[code];
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message && !error?.code) return error.message;
  return "Signup failed. Please try again.";
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const getPasswordStrength = (pwd = "") => {
  let score = 0;
  if (pwd.length >= 6) score += 1;
  if (pwd.length >= 10) score += 1;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
  return Math.min(score, 5);
};

const STRENGTH_LABEL = ["Too weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
const STRENGTH_COLOR = ["bg-red-500", "bg-red-400", "bg-amber-400", "bg-yellow-300", "bg-lime-400", "bg-green-500"];

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const axiosSecure = useAxiosSecure();
  const referralCode = searchParams.get("ref");

  const { userSignup, setUser, updateUserProfile, reloadAuthUser, isUserLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { name: "", email: "", password: "", photoURL: "", phone: "", bio: "", acceptTerms: false },
  });

  const watchedPassword = watch("password", "");
  const watchedPhotoURL = watch("photoURL", "");
  const strength = getPasswordStrength(watchedPassword || "");

  const handlePhotoFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
      toast.error("Please choose a JPEG, PNG, WEBP or GIF image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be under 5MB.");
      return;
    }
    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPhotoPreview(localUrl);
    try {
      setUploadingPhoto(true);
      const uploadedUrl = await handleUpload(file);
      setValue("photoURL", uploadedUrl, { shouldValidate: true });
      setPhotoPreview(uploadedUrl);
      toast.success("Photo uploaded! It will be saved with your account.");
    } catch (err) {
      console.error("Signup photo upload failed:", err);
      toast.error(err?.message || "Photo upload failed. You can paste an image URL instead.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const name = String(data.name || "").trim();
      const email = String(data.email || "").trim().toLowerCase();
      const password = String(data.password || "");
      const photoURL = String(data.photoURL || photoPreview || "").trim();
      if (!name) throw new Error("Please enter your full name.");
      if (!email) throw { code: "auth/missing-email" };
      if (password.length < 6) throw { code: "auth/weak-password" };
      const userCredential = await userSignup(email, password); // Create user on firebase
      // Photo is optional — never let a bad URL block account creation.
      try {
        await updateUserProfile(userCredential.user, name, photoURL || null); // Update user profile on firebase
      } catch (profileErr) {
        console.error("Firebase profile update failed (non-blocking):", profileErr);
      }
      try {
        await userCredential.user.reload(); // Reload user to get updated profile
      } catch {
        /* non-blocking */
      }
      return { fbUser: userCredential.user, extra: { name, email, photoURL } };
    },
    onSuccess: async ({ fbUser, extra }) => {
      sessionStorage.setItem("chub_justLoggedIn", "true");
      // Save user in database on MongoDB.
      // The backend createNewUser reads `referralCode` (the /signup?ref=CODE
      // param) and applies the +50 referee / +100 referrer point bonuses, then
      // auto-generates a fresh referral code for the new student.
      // Premium LMS fields (phone, bio) are stored at signup so the profile,
      // teacher application, and admin user table are pre-filled.
      try {
        await axiosSecure.post(`/users`, {
          email: extra.email,
          photoURL: extra.photoURL || fbUser.photoURL || null,
          name: extra.name || fbUser.displayName,
          phone: watch("phone") || undefined,
          bio: watch("bio") || undefined,
          referralCode: referralCode || undefined,
        });
      } catch (dbErr) {
        // Account already exists in Firebase — a duplicate Mongo save must not
        // block the user from continuing.
        console.error("Mongo user save failed (non-blocking):", dbErr?.response?.data || dbErr?.message);
      }

      // Refresh context with the real Firebase + Mongo profile.
      if (reloadAuthUser) {
        await reloadAuthUser().catch(() => {});
      } else {
        setUser({ ...fbUser, displayName: extra.name, photoURL: extra.photoURL || fbUser.photoURL, role: "student" });
      }
      reset();
      setPhotoPreview("");
      toast.success("Signup successful! Welcome to Creators Hub Academy 🎉");
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      console.error("[Signup failed]", error?.code, error?.message, error);
      toast.error(getFriendlySignupError(error), { autoClose: 6000 });
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

            {/* Password + strength */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Password
              </label>
              <div className="flex items-center border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900">
                <FaLock className="text-yellow-400 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                  })}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="w-full outline-none bg-transparent text-white placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="ml-2 text-gray-400 hover:text-yellow-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {watchedPassword && (
                <div className="mt-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all ${STRENGTH_COLOR[strength]}`}
                      style={{ width: `${((strength + 1) / 6) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Strength: <span className="font-semibold text-gray-300">{STRENGTH_LABEL[strength]}</span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Profile photo — upload (JPEG/PNG/WEBP/GIF) OR paste URL */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Profile Photo <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-yellow-400 bg-zinc-800">
                  {(photoPreview || watchedPhotoURL) ? (
                    <img
                      src={photoPreview || watchedPhotoURL}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-500">
                      <FaCamera className="text-xl" />
                    </div>
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-bold text-yellow-300">
                      UPLOADING…
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto || signupMutation.isPending}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-semibold text-white transition hover:border-yellow-400 disabled:opacity-50"
                  >
                    {uploadingPhoto ? "Uploading…" : "Upload image (JPEG, PNG, WEBP, GIF)"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handlePhotoFile}
                  />
                  <div className="flex items-center border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900">
                    <FaImage className="text-yellow-400 mr-2 shrink-0" />
                    <input
                      type="url"
                      {...register("photoURL", {
                        onChange: (e) => setPhotoPreview(e.target.value),
                      })}
                      placeholder="...or paste photo URL"
                      className="w-full outline-none bg-transparent text-white placeholder-gray-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Max 5MB. You can also add it later from Edit Profile.</p>
            </div>

            {/* Premium: phone + referral note */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Phone <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+234 ..."
                autoComplete="tel"
                className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900 text-white placeholder-gray-500 outline-none focus:border-yellow-400"
              />
            </div>
            {referralCode && (
              <p className="mb-4 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300">
                Referred by <span className="font-bold">{referralCode}</span> — bonus points on signup!
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-medium py-2 rounded-md hover:bg-yellow-500 transition duration-300 disabled:opacity-50"
              disabled={signupMutation.isPending || uploadingPhoto}
            >
              {uploadingPhoto ? "Uploading photo..." : signupMutation.isPending ? "Creating account..." : "Sign Up"}
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
