import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import renderStars from "../../utils/renderStars";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedFormat, setSelectedFormat] = useState("video");

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/courses/${id}`);
      return response.data.course;
    },
  });

  useEffect(() => {
    if (course) {
      const formats = [];
      if (course.hasVideo) formats.push("video");
      if (course.hasPdf) formats.push("pdf");
      if (formats.length === 1 && formats[0] !== selectedFormat) {
        setSelectedFormat(formats[0]);
      }
    }
  }, [course, selectedFormat]);

  const { data: enrollmentData } = useQuery({
    queryKey: ["enrollment", id, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/enrollments/${id}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const isEnrolled = enrollmentData?.enrollments?.some(
    (e) => e.studentEmail === user?.email
  );

  const enrollMutation = useMutation({
    mutationFn: async (format) => {
      const res = await axiosSecure.post("/enroll", {
        courseId: id,
        format: format || selectedFormat,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        toast.success("Enrollment initiated!");
        queryClient.invalidateQueries(["enrollment", id, user?.email]);
        navigate(`/dashboard/learn/${id}`, { replace: true });
      }
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      if (message === "Already enrolled in this course") {
        navigate(`/dashboard/learn/${id}`, { replace: true });
      } else {
        toast.error(message || "Enrollment failed. Please try again.");
      }
    },
  });

  const handleEnrollClick = () => {
    if (!user) {
      navigate("/login", {
        state: { from: `/courses/${id}` },
      });
      return;
    }
    if (isEnrolled) {
      navigate(`/dashboard/learn/${id}`, { replace: true });
      return;
    }
    enrollMutation.mutate(selectedFormat);
  };

  const getButtonClass = () => {
    const baseClass = "w-full py-3 rounded-lg font-bold text-base transition-all duration-200 disabled:opacity-50";
    return isEnrolled
      ? `${baseClass} bg-green-500 hover:bg-green-600 text-white`
      : `${baseClass} bg-yellow-400 hover:bg-yellow-500 text-black`;
  };

  const getButtonLabel = () => {
    if (enrollMutation.isPending) return "Processing...";
    return isEnrolled ? "▶ Continue Learning" : `Enroll for ₦5,000`;
  };

  if (courseLoading) return <LoaderSpinner />;
  if (!course)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Course not found</p>
      </div>
    );

  const availableFormats = [];
  if (course.hasVideo) availableFormats.push("video");
  if (course.hasPdf) availableFormats.push("pdf");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="w-full h-80 rounded-xl overflow-hidden mb-10 border border-zinc-800">
          <img
            src={course.image || course.thumbnail || "/logo.png"}
            alt={course.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "/logo.png"; }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <span className="text-yellow-400 text-sm font-semibold uppercase tracking-wide">
                {course.category}
              </span>
              <h2 className="text-4xl font-bold text-white mt-2">
                {course.title}
              </h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-justify">
              {course.description}
            </p>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">
                What You Will Learn
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {[
                  "Professional skills used by industry experts",
                  "Step-by-step lessons with real examples",
                  "Progress tracking so you never lose your place",
                  "Resume exactly where you stopped last time",
                  "Certificate of completion verified worldwide",
                  "Lifetime access to all course materials",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {availableFormats.length > 1 && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">
                  Choose Your Learning Format
                </h3>
                <div className="flex gap-4">
                  {availableFormats.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 border ${
                        selectedFormat === fmt
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-zinc-900 text-gray-300 border-zinc-700 hover:border-yellow-400"
                      }`}
                    >
                      {fmt === "video" ? "🎥 Video Course" : "📄 PDF Course"}
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-3">
                  Select the format you prefer. Your progress and lessons will follow this track.
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 sticky top-24 space-y-5">
              <div>
                <p className="text-3xl font-bold text-green-400">₦5,000</p>
                <p className="text-gray-400 text-sm mt-1">
                  Full enrollment access — choose your format and start learning.
                </p>
              </div>

              <div className="border-t border-zinc-800" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Instructor</span>
                  <span className="text-white font-medium">
                    {course.instructor?.displayName || "Creators Hub Academy"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Students Enrolled</span>
                  <span className="text-white font-medium">
                    {course.enrollments?.length || 0} students
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    {course.rating}{" "}
                    <span className="text-yellow-400">
                      {renderStars(course.rating)}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format</span>
                  <span className="text-yellow-400 font-bold">
                    {availableFormats.length > 1 ? "Video & PDF" : availableFormats[0]?.toUpperCase() || "N/A"}
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-800" />

              <button
                onClick={handleEnrollClick}
                disabled={enrollMutation.isPending}
                className={getButtonClass()}
              >
                {getButtonLabel()}
              </button>

              {isEnrolled && (
                <p className="text-green-400 text-sm text-center font-medium">
                  ✓ You are enrolled in this course
                </p>
              )}

              <p className="text-gray-500 text-xs text-center">
                🔒 Secure payment via Paystack · Instant enrollment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
