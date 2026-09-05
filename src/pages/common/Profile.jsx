import { FaEnvelope, FaPhone, FaUser, FaUserShield, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import HeadTag from "../../components/common/HeadTag";
import LastMemory from "../../components/common/LastMemory";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function UserProfile() {
  const { user, userLogout } = useAuth();
  const axiosSecure = useAxiosSecure();

  if (!user) return <p className="text-white p-4">Loading...</p>;

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Delete your account?",
      text: "This action is permanent and cannot be undone. All your data, enrollments, and progress will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
      inputPlaceholder: "Type DELETE to confirm",
      input: "text",
      inputAttributes: {
        "aria-label": "Type DELETE to confirm account deletion",
      },
      preConfirm: (value) => {
        if (value.trim().toLowerCase() !== "delete") {
          Swal.showValidationMessage("Please type DELETE to confirm");
        }
      },
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete("/users/me");
        toast.success("Your account has been deleted.");
        await userLogout();
      } catch (error) {
        console.error("Delete account error:", error);
        toast.error(error?.response?.data?.message || "Failed to delete account. Please try again.");
      }
    }
  };

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

          <LastMemory />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard/profile/edit"
              className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-md hover:bg-yellow-500 transition duration-300"
            >
              Edit Profile
            </Link>

            <button
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition duration-300"
            >
              <FaTrash className="text-sm" />
              Delete Account
            </button>
          </div>

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