import { FaEnvelope, FaPhone, FaUser, FaUserShield } from "react-icons/fa";
import { Link } from "react-router";
import HeadTag from "../../components/common/HeadTag";
import useAuth from "../../hooks/useAuth";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) return <p className="text-white p-4">Loading...</p>;

  return (
    <>
      <HeadTag title="Creators Hub Academy | Profile" />
      <div className="h-full py-4 px-2 md:p-10 bg-black min-h-screen">
        <div className="flex flex-col items-center gap-4 w-full md:max-w-2xl mx-auto">
          <img
            src={user.photoURL || user.image || "/logo.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400"
          />
          <h2 className="text-2xl font-bold text-white">User Profile</h2>

          <Link
            to="/dashboard/profile/edit"
            className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-md hover:bg-yellow-500 transition duration-300"
          >
            Edit Profile
          </Link>

          <div className="w-full mt-2 space-y-3">
            <div className="flex items-center gap-3 mx-10 my-5 px-4 py-4 rounded bg-zinc-950 border border-zinc-800 shadow-lg">
              <FaUser className="text-yellow-400" />
              <p className="text-white">
                <span className="font-semibold">Name:</span>{" "}
                {user.displayName || user.name}
              </p>
            </div>
            <div className="flex items-center gap-3 mx-10 my-5 px-4 py-4 rounded bg-zinc-950 border border-zinc-800 shadow-lg">
              <FaUserShield className="text-yellow-400" />
              <p className="text-white capitalize">
                <span className="font-semibold">Role:</span>{" "}
                {user.role || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-3 mx-10 my-5 px-4 py-4 rounded bg-zinc-950 border border-zinc-800 shadow-lg">
              <FaEnvelope className="text-yellow-400" />
              <p className="text-white">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
            </div>
            <div className="flex items-center gap-3 mx-10 my-5 px-4 py-4 rounded bg-zinc-950 border border-zinc-800 shadow-lg">
              <FaPhone className="text-yellow-400" />
              <p className="text-white">
                <span className="font-semibold">Phone:</span>{" "}
                {user.phone || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}