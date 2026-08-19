import { useQuery } from "@tanstack/react-query";
import HeadTag from "../../components/common/HeadTag";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function AdminNotifications() {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notifications");
      return res.data;
    },
  });

  const notifications = data?.notifications || [];

  const getTypeLabel = (type) => {
    switch (type) {
      case "user_joined":
        return "New User Joined";
      case "course_joined":
        return "New Course Enrollment";
      case "exam_completed":
        return "Exam Completed";
      case "certificate_payment":
        return "Certificate Payment";
      case "site_visit":
        return "Site Visit";
      default:
        return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "user_joined":
        return "text-green-400";
      case "course_joined":
        return "text-blue-400";
      case "exam_completed":
        return "text-yellow-400";
      case "certificate_payment":
        return "text-purple-400";
      case "site_visit":
        return "text-gray-400";
      default:
        return "text-white";
    }
  };

  return (
    <>
      <HeadTag title="Creators Hub Academy | Notifications" />
      <div className="p-6 bg-black text-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">Notifications</h1>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <LoaderSpinner />
        ) : notifications.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-sm font-semibold ${getTypeColor(notif.type)}`}>
                      {getTypeLabel(notif.type)}
                    </span>
                    <h3 className="text-white font-medium mt-1">
                      {notif.type === "user_joined" && `${notif.meta?.role === "teacher" ? "Teacher" : "Student"}: ${notif.studentName}`}
                      {notif.type === "course_joined" && `${notif.studentName} enrolled in ${notif.courseTitle}`}
                      {notif.type === "exam_completed" && `${notif.studentName} completed ${notif.courseTitle}`}
                      {notif.type === "certificate_payment" && `Payment received`}
                      {notif.type === "site_visit" && `Visit to ${notif.meta?.page || "unknown page"}`}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{notif.studentEmail}</p>
                    {notif.score != null && (
                      <p className="text-gray-400 text-sm">Score: {notif.score}%</p>
                    )}
                    {notif.meta?.page && (
                      <p className="text-gray-400 text-sm">Page: {notif.meta.page}</p>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
