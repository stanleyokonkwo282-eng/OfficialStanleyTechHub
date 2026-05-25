import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function Certificate() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const certRef = useRef();

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/courses/${courseId}`);
      return res.data;
    },
  });

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["progress", courseId, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/progress/${courseId}/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handlePrint = () => {
    window.print();
  };

  if (courseLoading || progressLoading) return <LoaderSpinner />;

  if (progressData?.percentage < 100) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl">You have not completed this course yet.</p>
        <p className="text-gray-400">Complete all lessons to earn your certificate.</p>
        <p className="text-yellow-400 text-2xl font-bold">{progressData?.percentage || 0}% Complete</p>
        <button
          onClick={() => navigate(`/dashboard/learn/${courseId}`)}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500"
        >
          Continue Learning
        </button>
      </div>
    );
  }

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const courseName = courseData?.course?.title || "Digital Skills Course";
  const studentName = user?.displayName || user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Action Buttons */}
      <div className="flex gap-4 mb-8 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700"
        >
          ← Back
        </button>
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500"
        >
          Download Certificate
        </button>
      </div>

      {/* Certificate */}
      <div
        ref={certRef}
        className="w-full max-w-3xl bg-white text-black rounded-2xl shadow-2xl overflow-hidden print:shadow-none"
        style={{ minHeight: "500px" }}
      >
        {/* Top gradient bar */}
        <div className="h-4" style={{ background: "linear-gradient(90deg, #1a1a2e, #7c3aed, #f59e0b)" }} />

        {/* Certificate Content */}
        <div className="p-12 flex flex-col items-center text-center">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="Creators Hub Academy"
            className="w-24 h-24 object-contain mb-4"
          />

          <p className="text-purple-700 font-semibold text-sm tracking-widest uppercase mb-2">
            Creators Hub Academy
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Certificate of Completion
          </h1>

          <div className="w-24 h-1 mb-6" style={{ background: "linear-gradient(90deg, #7c3aed, #f59e0b)" }} />

          <p className="text-gray-500 text-lg mb-2">This is to certify that</p>

          <h2 className="text-4xl font-bold mb-2" style={{ color: "#7c3aed" }}>
            {studentName}
          </h2>

          <p className="text-gray-500 text-lg mb-2">has successfully completed the course</p>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {courseName}
          </h3>

          <p className="text-gray-400 text-sm mb-8">
            Issued on {completionDate}
          </p>

          {/* Divider */}
          <div className="w-full border-t border-gray-200 mb-8" />

          {/* Signature */}
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold text-gray-900">Stanley Okonkwo</p>
            <div className="w-40 border-t border-gray-400 my-2" />
            <p className="text-gray-500 text-sm">Founder, Creators Hub Academy</p>
          </div>

          {/* Tagline */}
          <p className="text-gray-400 text-xs mt-8 tracking-widest uppercase">
            Learn • Grow • Create — Build Your Future Together
          </p>
        </div>

        {/* Bottom gradient bar */}
        <div className="h-4" style={{ background: "linear-gradient(90deg, #f59e0b, #7c3aed, #1a1a2e)" }} />
      </div>
    </div>
  );
}