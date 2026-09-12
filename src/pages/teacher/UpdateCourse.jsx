import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import handleUpload from "../../utils/ImageUploadApi";
import { uploadPdf } from "../../utils/PdfUploadApi";

const UpdateCourse = ({ isOpen, setIsOpen, course, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [customCategory, setCustomCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState(course?.resourceVideoUrl || course?.videoUrl || "");
  const [pdfFile, setPdfFile] = useState(null);
  const [htmlFile, setHtmlFile] = useState(null);
  const [htmlUrl, setHtmlUrl] = useState(course?.resourceHtmlUrl || "");
  const [contentType, setContentType] = useState("video");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const selectedCategory = watch("category");

  // Sync form state when course prop changes
  useEffect(() => {
    if (course) {
      setVideoUrl(course.resourceVideoUrl || course.videoUrl || "");
      setHtmlUrl(course.resourceHtmlUrl || "");
      setPdfFile(null);
      setHtmlFile(null);
      // Auto-detect content type from existing course
      if (course.hasHtml || course.resourceHtmlUrl) {
        setContentType("html");
      } else if (course.hasPdf || course.resourcePdfUrl) {
        setContentType("pdf");
      } else if (course.hasVideo || course.resourceVideoUrl) {
        setContentType("video");
      }
    }
  }, [course]);

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
        let resourceHtmlUrl = course.resourceHtmlUrl || "";

        // Handle PDF upload
        if (pdfFile) {
          if (pdfFile.size > 10 * 1024 * 1024) {
            toast.error("PDF file is too large. Please keep it under 10MB.");
            return;
          }
          const pdfUploadResult = await uploadPdfMutation.mutateAsync(pdfFile);
          resourcePdfUrl = pdfUploadResult.url;
        }

        // Handle HTML upload (Endpoint is /upload/html)
        if (htmlFile) {
          if (htmlFile.size > 10 * 1024 * 1024) {
            toast.error("HTML file is too large. Please keep it under 10MB.");
            return;
          }
          try {
            const formData = new FormData();
            formData.append("html", htmlFile);
            const response = await axiosSecure.post("/upload/html", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            resourceHtmlUrl = response?.data?.url || response?.data?.htmlUrl || "";
            if (!resourceHtmlUrl) {
              toast.error("HTML upload failed: empty response from server.");
              return;
            }
          } catch (htmlErr) {
            toast.error(
              "HTML upload failed: " +
                (htmlErr?.response?.data?.message || htmlErr?.message || htmlErr)
            );
            return;
          }
        }

        // Build payload based on content type
        const payload = {
          ...updateData,
          image: imageUrl,
          price: Number(updateData.price) || 5000,
        };

        if (contentType === "video") {
          payload.hasVideo = Boolean(videoUrl);
          payload.hasPdf = false;
          payload.hasHtml = false;
          payload.resourceVideoUrl = videoUrl;
          payload.resourcePdfUrl = "";
          payload.resourceHtmlUrl = "";
        } else if (contentType === "pdf") {
          payload.hasVideo = false;
          payload.hasPdf = Boolean(pdfFile || resourcePdfUrl);
          payload.hasHtml = false;
          payload.resourceVideoUrl = "";
          payload.resourcePdfUrl = resourcePdfUrl;
          payload.resourceHtmlUrl = "";
        } else if (contentType === "html") {
          payload.hasVideo = false;
          payload.hasPdf = false;
          payload.hasHtml = Boolean(htmlFile || resourceHtmlUrl);
          payload.resourceVideoUrl = "";
          payload.resourcePdfUrl = "";
          payload.resourceHtmlUrl = resourceHtmlUrl;
        }

        // Set contentType field for frontend filtering
        payload.contentType = contentType;

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
    setHtmlUrl(course?.resourceHtmlUrl || "");
    setPdfFile(null);
    setHtmlFile(null);
  };

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 w-full max-w-2xl rounded-2xl shadow-xl relative border border-zinc-800 overflow-hidden">
        {/* Premium close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200 group"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark text-lg group-hover:rotate-90 transition-transform"></i>
        </button>
      </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <i className="fa-solid fa-cog text-indigo-400"></i>
            Update Course: "{course?.title}"
          </h2>
          <p className="text-sm text-zinc-400 mb-6">Update your course content and settings</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-sm text-zinc-300">Title</label>
              <input
                {...register("title", { required: true })}
                className="w-full input input-bordered bg-zinc-800/50 border-zinc-700 text-white focus:border-indigo-500"
                defaultValue={course.title}
              />
              {errors.title && (
                <span className="text-red-400 text-sm">Title is required</span>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm text-zinc-300">Price (NGN)</label>
              <input
                type="number"
                step="1"
                {...register("price", { required: true })}
                className="w-full input input-bordered bg-zinc-800/50 border-zinc-700 text-white focus:border-indigo-500"
                defaultValue={course.price || 5000}
              />
              {errors.price && (
                <span className="text-red-400 text-sm">Price is required</span>
              )}
            </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-indigo-300 uppercase tracking-wide">
              Category
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full px-4 py-3 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all duration-200"
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
              <span className="text-red-400 text-xs mt-1 block">
                Category is required
              </span>
            )}

            {selectedCategory === "Others" && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full mt-2 px-4 py-3 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all duration-200"
              />
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-indigo-300 uppercase tracking-wide">
              Course Thumbnail
            </label>

            <div className="THUMB-BOX">
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="THUMB-INP"
              />
            </div>
            {course && course.image && (
              <div className="mt-3">
                <img
                  src={course.image}
                  alt="Current thumbnail"
                  className="THUMB-IMG"
                />
              </div>
            )}
          </div>

          <div>
            <label className="LBL">Content Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => setContentType("video")} className={contentType === "video" ? "VON" : "VOFF"}>
                <i className="fa-solid fa-video text-2xl"></i>
                <span className="text-sm font-semibold">Video</span>
              </button>
              <button type="button" onClick={() => setContentType("pdf")} className={contentType === "pdf" ? "PON" : "POFF"}>
                <i className="fa-solid fa-file-pdf text-2xl"></i>
                <span className="text-sm font-semibold">PDF</span>
              </button>
              <button type="button" onClick={() => setContentType("html")} className={contentType === "html" ? "HON" : "HOFF"}>
                <i className="fa-solid fa-code text-2xl"></i>
                <span className="text-sm font-semibold">HTML</span>
              </button>
            </div>
          </div>

          {contentType === "video" && (
            <div>
              <label className="LBL">YouTube Video URL</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="INP" />
            </div>
          )}

          {contentType === "pdf" && (
            <div>
              <label className="LBL">Upload PDF</label>
              <div className="BOX">
                <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="FINP" />
                {pdfFile && (<p className="text-xs text-gray-400 mt-2">{pdfFile.name}</p>)}
              </div>
              {course && course.resourcePdfUrl && (<p className="text-xs text-indigo-400 mt-2">Current: {course.resourcePdfUrl}</p>)}
            </div>
          )}

          {contentType === "html" && (
            <div>
              <label className="LBL">Upload HTML</label>
              <div className="BOX">
                <input type="file" accept=".html,.htm,text/html" onChange={(e) => setHtmlFile(e.target.files[0])} className="FINP" />
                {htmlFile && (<p className="text-xs text-gray-400 mt-2">{htmlFile.name}</p>)}
              </div>
              <div className="mt-3">
                <label className="LBL">HTML URL (fallback)</label>
                <input type="url" value={htmlUrl} onChange={(e) => setHtmlUrl(e.target.value)} placeholder="https://..." className="INP" />
              </div>
              {course && course.resourceHtmlUrl && !htmlFile && (<p className="text-xs text-indigo-400 mt-2">Current: {course.resourceHtmlUrl}</p>)}
            </div>
          )}

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
