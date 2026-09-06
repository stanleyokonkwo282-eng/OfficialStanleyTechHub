import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import handleUpload from "../../utils/ImageUploadApi";
import { uploadPdf } from "../../utils/PdfUploadApi";

const UpdateCourse = ({ isOpen, setIsOpen, course, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [customCategory, setCustomCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState(course?.resourceVideoUrl || course?.videoUrl || "");
  const [pdfFile, setPdfFile] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const selectedCategory = watch("category");

  const uploadImageMutation = useMutation({
    mutationFn: handleUpload,
  });

  const uploadPdfMutation = useMutation({
    mutationFn: uploadPdf,
  });

  const updateCourseMutation = useMutation({
    mutationFn: async (updatedCourse) => {
      const res = await axiosSecure.patch(
        `${import.meta.env.VITE_BASE_URL}/courses/${course._id}`,
        updatedCourse
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Course updated successfully!");
      refetch();
      reset();
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to update course");
    },
  });

  const onSubmit = async (updateData) => {
    try {
      let imageUrl = course.image;
      if (updateData.image && updateData.image.length > 0) {
        const imageFile = updateData.image[0];
        imageUrl = await uploadImageMutation.mutateAsync(imageFile);
      }

      let resourcePdfUrl = course.resourcePdfUrl || "";
      if (pdfFile) {
        if (pdfFile.size > 10 * 1024 * 1024) {
          toast.error("PDF file is too large. Please keep it under 10MB.");
          return;
        }
        const pdfUploadResult = await uploadPdfMutation.mutateAsync(pdfFile);
        resourcePdfUrl = pdfUploadResult.url;
      }

      const payload = {
        ...updateData,
        image: imageUrl,
        price: 5000,
        hasVideo: Boolean(videoUrl),
        hasPdf: Boolean(pdfFile || resourcePdfUrl),
        resourceVideoUrl: videoUrl,
        resourcePdfUrl: resourcePdfUrl,
      };
      if (payload.category === "Others") {
        payload.category = customCategory;
      }
      updateCourseMutation.mutate(payload);
    } catch (err) {
      toast.error("Failed to process updates");
      console.error(err);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    reset();
    setVideoUrl(course?.resourceVideoUrl || course?.videoUrl || "");
    setPdfFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-xl rounded p-6 shadow-lg relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-4 text-lg font-bold"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Update Course</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full input input-bordered"
              defaultValue={course.title}
            />
            {errors.title && (
              <span className="text-red-500 text-sm">Title is required</span>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Price (NGN)</label>
            <input
              type="number"
              step="1"
              {...register("price", { required: true })}
              className="w-full input input-bordered"
              defaultValue={course.price || 5000}
            />
            {errors.price && (
              <span className="text-red-500 text-sm">Price is required</span>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              {...register("description", { required: true })}
              className="w-full textarea textarea-bordered"
              defaultValue={course.description}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                Description is required
              </span>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              {...register("category", { required: true })}
              className="w-full select select-bordered"
              defaultValue={course.category || ""}
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
              <span className="text-red-500 text-sm">Category is required</span>
            )}

            {selectedCategory === "Others" && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full input input-bordered mt-2"
              />
            )}
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-800">Course Content</h3>
            <div>
              <label className="block mb-1 font-medium text-sm">Video URL</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full input input-bordered"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Upload PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="file-input file-input-bordered w-full"
              />
              {pdfFile && (
                <p className="text-xs text-gray-500 mt-1">{pdfFile.name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="file-input file-input-bordered w-full"
            />
            {errors.image && (
              <span className="text-red-500 text-sm">
                Course image is required
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={
              uploadImageMutation.isPending || updateCourseMutation.isPending
            }
          >
            {uploadImageMutation.isPending || updateCourseMutation.isPending
              ? "Updating..."
              : "Update Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
