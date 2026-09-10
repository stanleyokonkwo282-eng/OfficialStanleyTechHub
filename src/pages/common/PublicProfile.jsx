import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaEnvelope, FaUser, FaUserShield, FaShareAlt } from "react-icons/fa";
import HeadTag from "../../components/common/HeadTag";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function PublicProfile() {
  const { identifier } = useParams();
  const { user: me } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-profile", identifier],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/profile/${encodeURIComponent(identifier)}`);
      return res.data?.data;
    },
    enabled: !!identifier,
    retry: false,
  });

  if (isLoading) return <LoaderSpinner />;
  if (isError || !data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-white text-lg font-bold">Profile not found</p>
        <Link to="/dashboard/chat-forum" className="text-yellow-400 font-semibold">← Back to Chat Forum</Link>
      </div>
    );
  }

  const isMe = me?.email?.toLowerCase() === String(data.email || "").toLowerCase();
  const initials = (data.displayName || data.name || data.email || "?").slice(0, 2).toUpperCase();

  return (
    <>
      <HeadTag title={`${data.displayName || data.name || "Profile"} | Creators Hub Academy`} />
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <div className="flex flex-col items-center gap-4">
            {data.photoURL ? (
              <img src={data.photoURL} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-yellow-400 text-black flex items-center justify-center text-3xl font-black border-4 border-yellow-400">
                {initials}
              </div>
            )}
            <h2 className="text-2xl font-bold text-white">{data.displayName || data.name || "Member"}</h2>
            <p className="text-gray-400 text-sm capitalize">{data.role || "student"}{data.title ? ` • ${data.title}` : ""}</p>
            {data.bio && <p className="text-gray-300 text-sm text-center max-w-md">{data.bio}</p>}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded bg-zinc-900 border border-zinc-800">
              <FaUser className="text-yellow-400" />
              <p className="text-white text-sm"><span className="font-semibold">Name:</span> {data.displayName || data.name}</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded bg-zinc-900 border border-zinc-800">
              <FaUserShield className="text-yellow-400" />
              <p className="text-white text-sm capitalize"><span className="font-semibold">Role:</span> {data.role}</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded bg-zinc-900 border border-zinc-800">
              <FaEnvelope className="text-yellow-400" />
              <p className="text-white text-sm"><span className="font-semibold">Email:</span> {data.email}</p>
            </div>
            {data.referralCode && (
              <div className="flex items-center gap-3 px-4 py-3 rounded bg-zinc-900 border border-zinc-800">
                <FaShareAlt className="text-yellow-400" />
                <p className="text-white text-sm"><span className="font-semibold">Referral code:</span> {data.referralCode}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {isMe ? (
              <Link to="/dashboard/profile/edit" className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-md hover:bg-yellow-500 transition">
                Edit My Profile
              </Link>
            ) : (
              <Link to="/dashboard/chat-forum" className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-md hover:bg-yellow-500 transition">
                Chat With Them
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
