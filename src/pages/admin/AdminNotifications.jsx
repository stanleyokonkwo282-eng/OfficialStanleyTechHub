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

  const getTypeLabel = (type, meta) => {
    switch (type) {
      case "user_joined":
        return "New User Joined";
      case "user_login":
        return "User Login";
      case "course_joined":
        return "New Course Enrollment";
      case "exam_completed":
        return "Exam Completed";
      case "certificate_payment":
        return "Certificate Payment";
      case "site_visit":
        return meta?.authenticated ? "User Site Visit" : "Site Visit";
      default:
        return type;
    }
  };

  const getTypeColor = (type, meta) => {
    switch (type) {
      case "user_joined":
        return "text-green-400";
      case "user_login":
        return "text-blue-400";
      case "course_joined":
        return "text-yellow-400";
      case "exam_completed":
        return "text-yellow-400";
      case "certificate_payment":
        return "text-purple-400";
      case "site_visit":
        return meta?.authenticated ? "text-cyan-400" : "text-gray-400";
      default:
        return "text-white";
    }
  };

  const getNotificationDetails = (notif) => {
    switch (notif.type) {
      case "user_joined":
        return `${notif.meta?.role === "teacher" ? "Teacher" : "Student"}: ${notif.studentName}`;
      case "user_login":
        return `${notif.studentName} logged in${notif.meta?.page ? ` from ${notif.meta.page}` : ""}`;
      case "course_joined":
        return `${notif.studentName} enrolled in ${notif.courseTitle}`;
      case "exam_completed":
        return `${notif.studentName} completed ${notif.courseTitle}`;
      case "certificate_payment":
        return `Payment received from ${notif.studentEmail}`;
      case "site_visit":
        if (notif.meta?.authenticated) {
          return `${notif.meta?.userName || notif.studentEmail} visited ${notif.meta?.page || "unknown page"}`;
        }
        return `Anonymous visit to ${notif.meta?.page || "unknown page"} from IP ${notif.meta?.ip || ""}`;
      default:
        return "";
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
                    <span className={`text-sm font-semibold ${getTypeColor(notif.type, notif.meta)}`}>
                      {getTypeLabel(notif.type, notif.meta)}
                    </span>
                    <h3 className="text-white font-medium mt-1">
                      {getNotificationDetails(notif)}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-400 text-sm">{notif.studentEmail}</p>
                      {notif.type === "user_login" && notif.meta?.phone && (
                        <p className="text-gray-400 text-sm">Phone: {notif.meta.phone}</p>
                      )}
                      {notif.type === "user_login" && notif.meta?.role && (
                        <p className="text-gray-400 text-sm">Role: {notif.meta.role}</p>
                      )}
                      {notif.type === "site_visit" && notif.meta?.authenticated && notif.meta?.userPhone && (
                        <p className="text-gray-400 text-sm">Phone: {notif.meta.userPhone}</p>
                      )}
                      {notif.type === "site_visit" && notif.meta?.authenticated && notif.meta?.userRole && (
                        <p className="text-gray-400 text-sm">Role: {notif.meta.userRole}</p>
                      )}
                      {notif.score != null && (
                        <p className="text-gray-400 text-sm">Score: {notif.score}%</p>
                      )}
                      {notif.meta?.page && (
                        <p className="text-gray-400 text-sm">Page: {notif.meta.page}</p>
                      )}
                    </div>
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
