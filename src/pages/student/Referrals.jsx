import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const referralRewards = [
  { tier: "Invite 1 friend", points: 100, description: "For every friend who signs up using your link." },
  { tier: "Friend enrolls", points: 250, description: "Earn when a referred learner purchases a course." },
  { tier: "Course completed", points: 500, description: "Bonus reward for helping a learner complete a program." },
  { tier: "Premium referral bonus", points: 1000, description: "High-value referral milestone for premium package conversions." },
];

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

  const pointsBalance =
    (statsData?.totalReferrals || 0) * 100 +
    (statsData?.enrolled || 0) * 250 +
    (statsData?.completed || 0) * 500;

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
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-yellow-400">🎯 Referral Program</h1>
        <p className="mb-6 text-gray-400">
          Share your unique referral link and grow your rewards as your network learns with us.
        </p>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center">
            <p className="text-2xl font-bold text-white">{statsData?.totalReferrals || 0}</p>
            <p className="text-xs text-gray-400">Total Referrals</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{statsData?.enrolled || 0}</p>
            <p className="text-xs text-gray-400">Enrolled</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{statsData?.completed || 0}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
          <div className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-center">
            <p className="text-2xl font-bold text-amber-300">{pointsBalance}</p>
            <p className="text-xs text-amber-200">Referral Points</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <label className="mb-2 block text-sm font-semibold text-gray-300">Your Referral Link</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
            />
            <button
              onClick={copyLink}
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={shareWhatsApp}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              WhatsApp
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Reward plan</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {referralRewards.map((reward) => (
              <div key={reward.tier} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-white">{reward.tier}</p>
                  <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300">
                    +{reward.points} pts
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400">{reward.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <div className="border-b border-zinc-800 p-4">
            <h2 className="text-lg font-bold text-white">Your referrals</h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : referralsData?.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No referrals yet. Share your link to get started!</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {referralsData?.map((ref) => (
                <div key={ref._id} className="flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-medium text-white">{ref.refereeName || ref.refereeEmail}</p>
                    <p className="text-xs text-gray-400">{ref.courseTitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-300">{ref.points || 0} pts</span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        ref.status === "completed"
                          ? "bg-emerald-900 text-emerald-300"
                          : ref.status === "enrolled"
                            ? "bg-blue-900 text-blue-300"
                            : "bg-zinc-800 text-gray-400"
                      }`}
                    >
                      {ref.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
