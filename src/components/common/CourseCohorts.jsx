import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function CourseCohorts({ courseId }) {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [joiningId, setJoiningId] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["cohorts", courseId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/cohorts/course/${courseId}`);
      return res.data.data || [];
    },
    enabled: !!courseId,
  });

  const joinCohort = async (cohortId) => {
    setJoiningId(cohortId);
    try {
      const res = await axiosSecure.post(`/cohorts/${cohortId}/join`);
      if (res.data.success) {
        toast.success("Joined cohort! Check WhatsApp to connect with peers.");
        refetch();
      }
    } catch {
      toast.error("Failed to join cohort");
    } finally {
      setJoiningId(null);
    }
  };

  const openWhatsApp = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  if (!courseId) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-2">🎓 Learning Cohorts</h3>
        <p className="text-gray-400 text-sm mb-4">Join a WhatsApp cohort to connect with fellow students, ask questions, and get peer support.</p>

        {isLoading && <p className="text-gray-500 text-center py-4">Loading cohorts...</p>}

        {!isLoading && data?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No active cohorts for this course yet.</p>
            <p className="text-gray-600 text-xs mt-1">Check back later or contact your instructor.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data?.map((cohort) => (
            <div key={cohort._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h4 className="text-white font-semibold">{cohort.name}</h4>
                {cohort.description && <p className="text-gray-400 text-xs mt-1">{cohort.description}</p>}
                <p className="text-gray-500 text-xs mt-2">
                  {cohort.memberCount || 0} / {cohort.maxMembers || 500} members
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => joinCohort(cohort._id)}
                  disabled={joiningId === cohort._id}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-500 disabled:opacity-50 transition"
                >
                  {joiningId === cohort._id ? "Joining..." : "Join Cohort"}
                </button>
                <button
                  onClick={() => openWhatsApp(cohort.whatsappGroupLink)}
                  className="px-4 py-2 bg-zinc-800 text-white rounded-lg font-semibold text-sm hover:bg-zinc-700 transition"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
