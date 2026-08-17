import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import handleUpload from "../../utils/ImageUploadApi";

export default function AddCourse() {
  const { user } = useAuth();
  const [customCategory, setCustomCategory] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const selectedCategory = watch("category");

  const uploadImageMutation = useMutation({
    mutationFn: handleUpload,
  });

  const saveCourseMutation = useMutation({
    mutationFn: async (course) => {
      const res = await axiosSecure.post(`/courses/add`, course);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Course added successfully!");
      reset();
      navigate("/dashboard/courses");
    },
    onError: (error) => {
      toast.error("Failed to add course");
      console.log(error);
    },
  });

  const onSubmit = async (data) => {
    const imageFile = data.image[0];
    const imageUrl = await uploadImageMutation.mutateAsync(imageFile);
    data.image = imageUrl;
    data.rating = Math.floor(Math.random() * 5) + 1;
    delete data.name;
    if (data.category === "Others") {
      data.category = customCategory;
    }
    saveCourseMutation.mutate(data);
  };

  const isLoading =
    uploadImageMutation.isPending || saveCourseMutation.isPending;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Add New Course</h2>
        <p className="text-gray-400 mt-1">
          Fill in the details below to publish a new course
        </p>
        <div className="h-1 w-16 bg-yellow-400 mt-3 rounded-full"></div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Course Title
            </label>
            <input
              {...register("title", { required: true })}
              placeholder="e.g. Web Development Bootcamp"
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
            />
            {errors.title && (
              <span className="text-red-400 text-sm mt-1 block">
                Title is required
              </span>
            )}
          </div>

          {/* Instructor Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Instructor Name
            </label>
            <input
              defaultValue={user?.displayName || ""}
              readOnly
              {...register("name", { required: true })}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg px-4 py-3 cursor-not-allowed"
            />
          </div>

          {/* Instructor Email */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Instructor Email
            </label>
            <input
              {...register("instructorEmail", { required: true })}
              defaultValue={user?.email || ""}
              readOnly
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg px-4 py-3 cursor-not-allowed"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold">
                $
              </span>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: true })}
                placeholder="0.00"
                className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
              />
            </div>
            {errors.price && (
              <span className="text-red-400 text-sm mt-1 block">
                Price is required
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows={4}
              placeholder="What will students learn in this course?"
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors resize-none"
            />
            {errors.description && (
              <span className="text-red-400 text-sm mt-1 block">
                Description is required
              </span>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Category
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Web Development">Web Development</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="App Development">Mobile App Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Others">Others</option>
            </select>
            {errors.category && (
              <span className="text-red-400 text-sm mt-1 block">
                Category is required
              </span>
            )}

            {selectedCategory === "Others" && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 mt-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
              />
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Promotional Video URL (YouTube)
            </label>
            <input
              type="url"
              {...register("videoUrl")}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
            />
            <p className="text-zinc-500 text-xs mt-2">
              Paste a YouTube video link (e.g. https://youtube.com/watch?v=... or https://youtu.be/...)
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Course Thumbnail
            </label>
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 hover:border-yellow-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                {...register("image", { required: true })}
                className="w-full text-gray-400 text-sm
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-yellow-400 file:text-black
                  hover:file:bg-yellow-500
                  file:cursor-pointer cursor-pointer"
              />
              <p className="text-zinc-500 text-xs mt-2">
                PNG, JPG, WEBP accepted
              </p>
            </div>
            {errors.image && (
              <span className="text-red-400 text-sm mt-1 block">
                Course image is required
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-base"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {uploadImageMutation.isPending
                  ? "Uploading Image..."
                  : "Saving Course..."}
              </>
            ) : (
              "Add Course"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
