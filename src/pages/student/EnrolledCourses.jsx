import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function EnrolledCourses() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: enrolledCourses = [], isLoading } = useQuery({
    queryKey: ["enrolledCourses", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/courses/enrolled/${user?.email}`);
      return response.data.enrolledCourses || [];
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <LoaderDotted />;

  if (enrolledCourses.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-10">
        <div className="text-6xl">📚</div>
        <h2 className="text-2xl font-bold text-white">No Enrolled Courses Yet</h2>
        <p className="text-gray-400 text-center max-w-md">
          You have not enrolled in any course yet. Browse our catalog and enroll for ₦5,000.
        </p>
        <button
          onClick={() => navigate("/courses")}
          className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">My Courses</h2>
        <p className="text-gray-400 mt-1">Track your progress and continue learning</p>
        <div className="h-1 w-16 bg-yellow-400 mt-3 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            userEmail={user?.email}
            axiosSecure={axiosSecure}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course, userEmail, axiosSecure, navigate }) {
  const courseId = course.courseInfo?._id;
  const courseTitle = course.courseInfo?.title || "Course";
  const courseImage = course.courseInfo?.image || course.courseInfo?.thumbnail || "/logo.png";
  const instructor = course.instructor?.[0]?.displayName || "Creators Hub Academy";

  // Fetch progress for this course
  const { data: progressData } = useQuery({
    queryKey: ["progress", courseId, userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/progress/${courseId}/${userEmail}`);
      return res.data;
    },
    enabled: !!courseId && !!userEmail,
  });

  // Fetch certificate status
  const { data: certData } = useQuery({
    queryKey: ["certificate", courseId, userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/certificates/status/${courseId}/${userEmail}`);
      return res.data;
    },
    enabled: !!courseId && !!userEmail,
  });

  const percentage = progressData?.percentage || 0;
  const completedLessons = progressData?.completedLessons || 0;
  const totalLessons = progressData?.totalLessons || 0;
  const certificate = certData?.certificate;
  const isCompleted = percentage >= 100;

  const getCertBadge = () => {
    if (!isCompleted) return null;
    if (certificate?.paymentStatus === "approved") return { text: "✓ Certificate Issued", color: "bg-green-900 text-green-400 border-green-800" };
    if (certificate?.paymentStatus === "pending") return { text: "⏳ Certificate Pending", color: "bg-yellow-900 text-yellow-400 border-yellow-800" };
    return { text: "🎓 Get Certificate", color: "bg-purple-900 text-purple-400 border-purple-800" };
  };

  const certBadge = getCertBadge();

  const handleAction = () => {
    if (isCompleted) {
      navigate(`/dashboard/certificate/${courseId}`);
    } else {
      navigate(`/dashboard/learn/${courseId}`);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col hover:border-zinc-600 transition-all duration-200">
      {/* Course Image */}
      <div className="relative">
        <img
          src={courseImage}
          alt={courseTitle}
          loading="lazy"
          decoding="async"
          className="w-full h-44 object-cover"
          onError={(e) => { e.target.src = "/logo.png"; }}
        />
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ✓ Completed
          </div>
        )}
        {!isCompleted && percentage > 0 && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
            {percentage}%
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-lg leading-tight mb-1">{courseTitle}</h3>
        <p className="text-gray-400 text-sm mb-4">By {instructor}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{completedLessons} of {totalLessons} lessons</span>
            <span className={isCompleted ? "text-green-400 font-bold" : "text-yellow-400 font-bold"}>
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? "bg-green-400" : "bg-yellow-400"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Certificate Badge */}
        {certBadge && (
          <div className={`border rounded-lg px-3 py-2 text-xs font-semibold mb-4 ${certBadge.color}`}>
            {certBadge.text}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleAction}
          className={`mt-auto w-full py-3 rounded-lg font-bold transition-all duration-200 ${
            isCompleted
              ? "bg-green-500 hover:bg-green-600 text-white"
              : percentage > 0
              ? "bg-yellow-400 hover:bg-yellow-500 text-black"
              : "bg-yellow-400 hover:bg-yellow-500 text-black"
          }`}
        >
          {isCompleted
            ? certificate?.paymentStatus === "approved"
              ? "View Certificate"
              : "Get Certificate"
            : percentage > 0
            ? "Resume Learning"
            : "Start Learning"}
        </button>
      </div>
    </div>
  );
}
