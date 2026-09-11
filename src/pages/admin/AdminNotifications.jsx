import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import HeadTag from "../../components/common/HeadTag";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { NotificationContext } from "../../providers/NotificationContext";

export default function AdminNotifications() {
  const axiosSecure = useAxiosSecure();
  const { markAsRead, markAllAsRead } = useContext(NotificationContext);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notifications");
      return res.data;
    },
  });

  const notifications = data?.notifications || [];
  const unread = data?.unread ?? notifications.filter((n) => !n.read).length;

  const handleMarkOne = async (id) => {
    await markAsRead?.(id);
    refetch();
  };

  const handleMarkAll = async () => {
    await markAllAsRead?.();
    refetch();
  };

  const getTypeLabel = (type, meta) => {
    switch (type) {
      case "user_joined":
        return "New User Joined";
      case "user_login":
        return "User Login";
      case "user_logout":
        return "User Logout";
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
      case "user_logout":
        return "text-orange-400";
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
      case "user_logout":
        return `${notif.studentName} logged out`;
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
          <h1 className="text-3xl font-bold text-yellow-400">
            Notifications
            {unread > 0 && (
              <span className="ml-3 align-middle rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                {unread} new
              </span>
            )}
          </h1>
          <div className="flex gap-2">
            {unread > 0 && (
              <button
                onClick={handleMarkAll}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <FaCheckDouble /> Mark all as read
              </button>
            )}
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {isLoading ? (
          <LoaderSpinner />
        ) : notifications.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => {
              const isUnread = !notif.read;
              return (
                <div
                  key={notif._id}
                  className={`rounded-xl border p-5 transition-colors ${
                    isUnread
                      ? "bg-yellow-400/5 border-yellow-400/30 hover:border-yellow-400/50"
                      : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <span className={`text-sm font-semibold ${getTypeColor(notif.type, notif.meta)}`}>
                        {isUnread && (
                          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-400 align-middle" aria-hidden />
                        )}
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
                      {notif.type === "user_logout" && notif.meta?.phone && (
                        <p className="text-gray-400 text-sm">Phone: {notif.meta.phone}</p>
                      )}
                      {notif.type === "user_logout" && notif.meta?.role && (
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
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                    {isUnread ? (
                      <button
                        onClick={() => handleMarkOne(notif._id)}
                        className="rounded-md bg-yellow-400/90 px-3 py-1 text-[11px] font-semibold text-black hover:bg-yellow-500 transition-colors flex items-center gap-1"
                      >
                        <FaCheck /> Mark as read
                      </button>
                    ) : (
                      <span className="rounded-md bg-zinc-800 px-3 py-1 text-[11px] font-medium text-gray-400 flex items-center gap-1">
                        <FaCheck /> Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </>
  );
}
