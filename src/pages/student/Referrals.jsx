import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function MyReferrals() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/signup?ref=${encodeURIComponent(user?.email || "")}`;

  const { data: statsData } = useQuery({
    queryKey: ["referral-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/referrals/me/stats");
      return res.data.data;
    },
  });

  const { data: referralsData, isLoading } = useQuery({
    queryKey: ["my-referrals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/referrals/me");
      return res.data.data;
    },
  });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Join Creators Hub Academy and start learning digital skills! Use my link: ${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">🎯 Referral Program</h1>
        <p className="text-gray-400 mb-6">Share your unique link and earn rewards when friends enroll.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{statsData?.totalReferrals || 0}</p>
            <p className="text-xs text-gray-400">Total Referrals</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{statsData?.enrolled || 0}</p>
            <p className="text-xs text-gray-400">Enrolled</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{statsData?.completed || 0}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-300 mb-2">Your Referral Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2"
            />
            <button onClick={copyLink} className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-500">
              {copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={shareWhatsApp} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-700">
              WhatsApp
            </button>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-lg font-bold text-white">Your Referrals</h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : referralsData?.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No referrals yet. Share your link to get started!</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {referralsData?.map((ref) => (
                <div key={ref._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-white font-medium">{ref.refereeName || ref.refereeEmail}</p>
                    <p className="text-xs text-gray-400">{ref.courseTitle}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    ref.status === "completed" ? "bg-emerald-900 text-emerald-300" :
                    ref.status === "enrolled" ? "bg-blue-900 text-blue-300" :
                    "bg-zinc-800 text-gray-400"
                  }`}>
                    {ref.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
