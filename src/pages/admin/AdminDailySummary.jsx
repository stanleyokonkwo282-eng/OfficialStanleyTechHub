import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import HeadTag from "../../components/common/HeadTag";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function AdminDailySummary() {
  const axiosSecure = useAxiosSecure();

  const sendSummaryMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.get("/cron/daily-login-summary");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Daily login summary sent to admin email!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send summary");
    },
  });

  const handleSendSummary = () => {
    Swal.fire({
      title: "Send Daily Login Summary?",
      text: "This will send a summary of all logins from the last 24 hours to the admin email.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, send now",
      cancelButtonText: "Cancel",
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: "#facc15",
      cancelButtonColor: "#3f3f46",
    }).then((result) => {
      if (result.isConfirmed) {
        sendSummaryMutation.mutate();
      }
    });
  };

  return (
    <>
      <HeadTag title="Daily Login Summary | Creators Hub Academy" />
      <div className="p-6 bg-black text-white min-h-screen">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">Daily Login Summary</h2>
          <p className="text-gray-400 mb-8">
            Send a summary of all user logins from the last 24 hours to the admin email. 
            You can also set up an automatic daily cron job to send this summary automatically.
          </p>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Manual Trigger</h3>
            <p className="text-gray-400 text-sm mb-6">
              Click the button below to immediately send a daily login summary email to the admin.
            </p>
            <button
              onClick={handleSendSummary}
              disabled={sendSummaryMutation.isPending}
              className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
            >
              {sendSummaryMutation.isPending ? "Sending..." : "Send Daily Summary"}
            </button>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Automatic Setup</h3>
            <p className="text-gray-400 text-sm mb-4">
              To receive this summary automatically every day, set up a cron job that calls:
            </p>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-4">
              <code className="text-yellow-400 text-sm break-all">
                {`${import.meta.env.VITE_BASE_URL}/cron/daily-login-summary?secret=YOUR_CRON_SECRET`}
              </code>
            </div>
            <p className="text-gray-400 text-sm">
              Use a service like <strong>cron-job.org</strong> or Render's cron feature to call this URL once per day.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
