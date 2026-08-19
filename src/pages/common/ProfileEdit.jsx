import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCamera, FaUser, FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import HeadTag from "../../components/common/HeadTag";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ProfileEdit() {
  const { user, setUser, isUserLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user?.photoURL || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || user?.name || "",
      phone: user?.phone || "",
      photoURL: user?.photoURL || "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axiosSecure.patch(`/users/${user?.email}`, {
        name: data.name,
        phone: data.phone,
        photoURL: data.photoURL,
        displayName: data.name,
      });

      if (res.data?.data) {
        setUser((prev) => ({ ...prev, ...res.data.data }));
        toast.success("Profile updated successfully!");
      } else {
        setUser((prev) => ({ ...prev, ...data }));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) return <LoaderSpinner />;
  if (!user) return <p className="text-white p-4">Loading...</p>;

  return (
    <>
      <HeadTag title="Creators Hub Academy | Edit Profile" />
      <div className="min-h-screen py-4 px-2 md:p-10 bg-black">
        <div className="w-full md:max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Edit Profile</h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 md:p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={previewUrl || "/logo.png"}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
                  />
                  <label
                    htmlFor="photoURL"
                    className="absolute bottom-0 right-0 bg-yellow-400 text-black p-2 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors"
                  >
                    <FaCamera />
                  </label>
                </div>
                <p className="text-gray-400 text-sm">Click the camera icon to change photo URL</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="flex items-center border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900">
                  <FaUser className="text-yellow-400 mr-2" />
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter your full name"
                    className="w-full outline-none bg-transparent text-white placeholder-gray-500"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="flex items-center border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900">
                  <FaPhone className="text-yellow-400 mr-2" />
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="Enter your phone number"
                    className="w-full outline-none bg-transparent text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  id="photoURL"
                  {...register("photoURL", {
                    onChange: (e) => setPreviewUrl(e.target.value),
                  })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-900 text-white placeholder-gray-500 outline-none focus:border-yellow-400"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-400 text-black font-medium py-2 rounded-md hover:bg-yellow-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
