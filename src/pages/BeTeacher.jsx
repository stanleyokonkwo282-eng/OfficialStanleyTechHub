import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import HeadTag from "../components/common/HeadTag";
import LoaderDotted from "../components/common/LoaderDotted";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import NoticeBoard from "./common/NoticeBoard";

const BeTeacher = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const becomeTeacherMutation = useMutation({
    mutationFn: async (data) => {
      const result = await axiosSecure.post(
        `${import.meta.env.VITE_BASE_URL}/be-teacher/${user.email}`,
        data
      );
      return result.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Your request has been sent",
        text: "Please wait for approval. Thank you!",
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "OK",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#facc15",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    },
    onError: (error) => {
      console.log(error);
      Swal.fire({
        title: "Something went wrong",
        text: "Please try again later.",
        icon: "error",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#facc15",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!user) return <LoaderDotted />;
  return (
    <>
      <HeadTag title="Become a Teacher | Creators Hub Academy" />
      <div className="min-h-screen bg-black py-10">
        <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 shadow-lg p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-8 text-center text-white">
            Become a Teacher
          </h2>
          <form
            onSubmit={handleSubmit(becomeTeacherMutation.mutate)}
            className="space-y-4"
          >
            {/* Image (preview only) */}
            <div className="flex flex-col items-center">
              <img
                src={user?.photoURL}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-yellow-400 object-cover"
              />
              <label className="mt-1 font-medium text-gray-300">
                Profile Picture
              </label>
            </div>

            {/* Already Teacher */}
            {user?.status === "approved" && user?.role === "teacher" && (
              <NoticeBoard title="You are already a teacher" />
            )}

            {/* Teacher Request Pending */}
            {user?.status === "pending" && user?.role === "teacher" && (
              <NoticeBoard title="Your request is pending" />
            )}

            {/* Teacher Request Rejected */}
            {user?.status === "rejected" && user?.role === "teacher" && (
              <NoticeBoard title="Your request has been rejected" />
            )}

            {/* Name (read-only) */}
            <div>
              <label className="block font-medium text-gray-300">Name</label>
              <input
                type="text"
                value={user?.displayName || ""}
                readOnly
                className="input input-bordered w-full bg-zinc-900 border-zinc-700 text-white"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="input input-bordered w-full bg-zinc-900 border-zinc-700 text-white"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block font-medium text-gray-300">
                Experience Level
              </label>
              <select
                {...register("experience", { required: true })}
                className="select select-bordered w-full bg-zinc-900 border-zinc-700 text-white"
              >
                <option value="" disabled>
                  Select your experience
                </option>
                <option value="beginner">Beginner</option>
                <option value="mid-level">Mid-Level</option>
                <option value="experienced">Experienced</option>
              </select>
              {errors.experience && (
                <p className="text-red-400 text-sm">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block font-medium text-gray-300">Title</label>
              <input
                type="text"
                name="title"
                readOnly={
                  user?.status === "approved" ||
                  user?.status === "pending" ||
                  user?.status === "rejected"
                }
                defaultValue={user?.title || ""}
                placeholder="e.g. MERN Stack Instructor"
                {...register("title", { required: true })}
                className="input input-bordered w-full bg-zinc-900 border-zinc-700 text-white placeholder-gray-500"
              />
              {errors.title && (
                <p className="text-red-400 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium text-gray-300">
                Category
              </label>
              <select
                defaultValue={user?.category || ""}
                {...register("category", { required: true })}
                className="select select-bordered w-full bg-zinc-900 border-zinc-700 text-white"
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Web Development">Web Development</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="App Development">Mobile App Development</option>
                <option value="Data Science">Data Science</option>
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                disabled={
                  becomeTeacherMutation.isPending ||
                  user?.status === "approved" ||
                  user?.status === "pending" ||
                  user?.status === "rejected"
                }
                type="submit"
                className="btn btn-primary mt-4 px-6 bg-yellow-400 text-black border-none hover:bg-yellow-500"
              >
                {becomeTeacherMutation.isPending
                  ? "Submitting..."
                  : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BeTeacher;