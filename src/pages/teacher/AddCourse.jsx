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
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
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
      setVideoUrl("");
      setPdfFile(null);
      navigate("/dashboard/courses");
    },
    onError: (error) => {
      toast.error("Failed to add course");
      console.log(error);
    },
  });

  const onSubmit = async (data) => {
    try {
      const imageFile = data.image[0];
      const imageUrl = await uploadImageMutation.mutateAsync(imageFile);
      data.image = imageUrl;

      let resourcePdfUrl = "";
      if (pdfFile && pdfFile.size > 10 * 1024 * 1024) {
        toast.error("PDF file is too large. Please keep it under 10MB for 3G users.");
        return;
      }
      if (pdfFile) {
        resourcePdfUrl = await uploadImageMutation.mutateAsync(pdfFile);
      }

      const coursePayload = {
        ...data,
        price: 5000,
        hasVideo: Boolean(videoUrl),
        hasPdf: Boolean(pdfFile),
        resourceVideoUrl: videoUrl,
        resourcePdfUrl: resourcePdfUrl,
        rating: Math.floor(Math.random() * 5) + 1,
      };
      delete coursePayload.name;
      if (coursePayload.category === "Others") {
        coursePayload.category = customCategory;
      }
      saveCourseMutation.mutate(coursePayload);
    } catch (err) {
      toast.error("Failed to process course uploads");
      console.error(err);
    }
  };

  const isLoading =
    uploadImageMutation.isPending || saveCourseMutation.isPending;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Add New Course</h2>
        <p className="text-gray-400 mt-1">
          Fill in the details below to publish a new course
        </p>
        <div className="h-1 w-16 bg-yellow-400 mt-3 rounded-full"></div>
      </div>

      <div className="max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Price (NGN)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold">
                ₦
              </span>
              <input
                type="number"
                step="1"
                {...register("price", { required: true, value: 5000 })}
                placeholder="5000"
                className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
              />
            </div>
            {errors.price && (
              <span className="text-red-400 text-sm mt-1 block">
                Price is required
              </span>
            )}
          </div>

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

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-white font-bold text-lg">Course Content</h3>
            <p className="text-gray-400 text-sm">
              Upload video and/or PDF content for this course. Students will choose their preferred format at enrollment.
            </p>

            <div>
              <label className="block mb-2 text-sm font-semibold text-yellow-400 uppercase tracking-wide">
                Upload Video
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
              />
              <p className="text-zinc-500 text-xs mt-2">
                Paste a YouTube or embeddable video URL. Required if you want a video track.
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-yellow-400 uppercase tracking-wide">
                Upload PDF
              </label>
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 hover:border-yellow-400 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="w-full text-gray-400 text-sm
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-yellow-400 file:text-black
                    hover:file:bg-yellow-500
                    file:cursor-pointer cursor-pointer"
                />
                <p className="text-zinc-500 text-xs mt-2">
                  {pdfFile ? pdfFile.name : "Select a PDF file. Max 10MB for fast loading."}
                </p>
              </div>
            </div>
          </div>

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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-base"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {uploadImageMutation.isPending
                  ? "Uploading..."
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
