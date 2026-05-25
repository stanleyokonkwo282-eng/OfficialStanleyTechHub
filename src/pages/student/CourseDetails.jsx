import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import renderStars from "../../utils/renderStarts";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/courses/${id}`
      );
      return response.data.course;
    },
  });

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
    mutationFn: async () => {
      const res = await axiosSecure.post("/enrollments", {
        courseId: id,
        studentEmail: user?.email,
        studentName: user?.displayName || user?.email,
        price: 0,
        paymentMethod: "coupon",
        couponCode: "CREATOR",
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("🎉 You are now enrolled! Start learning for free!");
      queryClient.invalidateQueries(["enrollment", id, user?.email]);
      setShowCouponModal(false);
      setTimeout(() => navigate(`/dashboard/learn/${id}`), 1500);
    },
    onError: () => {
      toast.error("Enrollment failed. Please try again.");
    },
  });

  const handleEnrollClick = () => {
    if (!user) { navigate("/login"); return; }
    if (isEnrolled) { navigate(`/dashboard/learn/${id}`); return; }
    setShowCouponModal(true);
  };

  const handleCouponSubmit = () => {
    const code = couponInput.trim().toUpperCase();
    if (code !== "CREATOR") {
      setCouponError("Invalid coupon code. Please try again.");
      return;
    }
    setCouponError("");
    enrollMutation.mutate();
  };

  if (courseLoading) return <LoaderSpinner />;
  if (!course) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white text-xl">Course not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto py-10 px-4">

        <div className="w-full h-80 rounded-xl overflow-hidden mb-10 border border-zinc-800">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <span className="text-yellow-400 text-sm font-semibold uppercase tracking-wide">{course.category}</span>
              <h2 className="text-4xl font-bold text-white mt-2">{course.title}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-justify">{course.description}</p>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">What You Will Learn</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {[
                  "Professional skills used by industry experts",
                  "Step-by-step video lessons with real examples",
                  "Progress tracking so you never lose your place",
                  "Resume exactly where you stopped last time",
                  "Certificate of completion verified worldwide",
                  "Lifetime access to all course materials",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-950 border border-green-800 rounded-xl p-4">
              <p className="text-green-400 font-semibold text-sm">🎁 This course is FREE with coupon code</p>
              <p className="text-green-300 text-sm mt-1">
                Enter code <strong>CREATOR</strong> when enrolling to get full access at no cost.
                Only pay ₦10,000 when you want your verified certificate.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 sticky top-24 space-y-5">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold text-green-400">FREE</p>
                  <p className="text-gray-500 line-through text-xl">${course.price}</p>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Use coupon <span className="text-yellow-400 font-bold">CREATOR</span> to enroll free
                </p>
              </div>

              <div className="border-t border-zinc-800" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Instructor</span>
                  <span className="text-white font-medium">{course.instructor?.displayName || "Creators Hub Academy"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Students Enrolled</span>
                  <span className="text-white font-medium">{course.enrollments?.length || 0} students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    {course.rating} <span className="text-yellow-400">{renderStars(course.rating)}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Certificate Fee</span>
                  <span className="text-yellow-400 font-bold">₦10,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Certificate Valid</span>
                  <span className="text-green-400 font-medium">✓ Worldwide</span>
                </div>
              </div>

              <div className="border-t border-zinc-800" />

              <button
                onClick={handleEnrollClick}
                className={`w-full py-3 rounded-lg font-bold text-base transition-all duration-200 ${
                  isEnrolled ? "bg-green-500 hover:bg-green-600 text-white" : "bg-yellow-400 hover:bg-yellow-500 text-black"
                }`}
              >
                {isEnrolled ? "▶ Continue Learning" : "Enroll for FREE"}
              </button>

              {isEnrolled && (
                <p className="text-green-400 text-sm text-center font-medium">✓ You are enrolled in this course</p>
              )}

              <p className="text-gray-500 text-xs text-center">
                🔒 Free access · Lifetime learning · ₦10,000 for verified certificate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-2xl font-bold mb-2">Enter Coupon Code</h3>
            <p className="text-gray-400 text-sm mb-6">
              Enter your coupon code to get free access to this course.
              Contact us on WhatsApp or social media to get the code.
            </p>

            <input
              type="text"
              value={couponInput}
              onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
              placeholder="Enter coupon code e.g. CREATOR"
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 mb-3 uppercase"
            />

            {couponError && <p className="text-red-400 text-sm mb-3">{couponError}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowCouponModal(false); setCouponInput(""); setCouponError(""); }}
                className="flex-1 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCouponSubmit}
                disabled={enrollMutation.isPending}
                className="flex-1 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 font-bold disabled:opacity-50"
              >
                {enrollMutation.isPending ? "Enrolling..." : "Apply & Enroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
