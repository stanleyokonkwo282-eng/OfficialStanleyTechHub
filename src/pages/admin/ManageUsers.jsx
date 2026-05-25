import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function AllUsers() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["users", { page, search }],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${search}&page=${page}`);
      return res.data;
    },
    onError: () => console.error("Failed to fetch users"),
    enabled: user?.accessToken !== null,
  });

  const makeAdmin = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/users/admin/${id}`);
    },
    onSuccess: () => {
      toast.success("User promoted to admin");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => toast.error("Failed to promote user"),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const text = e.target.search.value.trim();
    setSearch(text);
  };

  const handleMakeAdmin = (id) => {
    Swal.fire({
      icon: "question",
      title: "Are you sure?",
      text: "You want to make this user an admin!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: "#facc15",
      cancelButtonColor: "#3f3f46",
    }).then((result) => {
      if (result.isConfirmed) {
        makeAdmin.mutate(id);
      }
    });
  };

  const handleNextPage = () => {
    if (data?.hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    } else {
      toast.error("No more pages available");
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    } else {
      toast.error("You are already on the first page");
    }
  };

  if (isLoading) return <LoaderSpinner />;

  if (data?.users?.length === 0)
    return <p className="text-center my-10 text-white">No users found</p>;

  return (
    <div className="p-5 bg-black text-white min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold text-white">All Users</h2>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            name="search"
            type="text"
            placeholder="Search by name or email"
            className="input input-bordered w-64 bg-zinc-900 border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
          <button
            className="btn bg-yellow-400 text-black border-none hover:bg-yellow-500"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border border-zinc-800 bg-zinc-950 min-w-[1000px]">
          <thead>
            <tr className="bg-zinc-900 text-gray-300">
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Make Admin</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((user) => (
              <tr key={user._id} className="border-t border-zinc-800 hover:bg-zinc-900">
                <td>
                  <img
                    src={
                      user.photoURL ||
                      "https://randomuser.me/api/portraits/lego/1.jpg"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-yellow-400"
                  />
                </td>
                <td className="text-white">{user.name}</td>
                <td className="text-gray-300">{user.email}</td>
                <td>
                  <span
                    className={`text-sm badge ${
                      user.role === "admin"
                        ? "badge-success"
                        : user.role === "teacher"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm bg-yellow-400 text-black border-none hover:bg-yellow-500 disabled:opacity-50"
                    onClick={() => handleMakeAdmin(user._id)}
                    disabled={user.role === "admin"}
                  >
                    {user.role === "admin" ? "Admin" : "Make Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-center gap-4 items-center">
          <button
            disabled={page === 1}
            onClick={handlePrevPage}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-white rounded hover:bg-zinc-800 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="px-4 py-2 border border-zinc-700 rounded bg-zinc-900 text-white">
            Page: {page} of {data?.totalPages}
          </div>
          <button
            disabled={!data?.hasNextPage}
            onClick={handleNextPage}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-white rounded hover:bg-zinc-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}