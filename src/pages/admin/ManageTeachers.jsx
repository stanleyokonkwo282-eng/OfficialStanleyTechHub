import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ContentNotFound from "../../components/common/ContentNotFound";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PendingTeachers = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["teachersData", page],
    queryFn: () => fetchTeachers(page),
    enabled: user.accessToken !== null,
  });

  const fetchTeachers = async (page = 1, limit = 10) => {
    const { data } = await axiosSecure.get(
      `/teachers?page=${page}&limit=${limit}`
    );
    return data;
  };

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosSecure.patch(`/change-teacher-status/${id}`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teachersData"]);
      toast.success("Status updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update status.");
    },
  });

  const handleStatusChange = (id, status) => {
    Swal.fire({
      title: `Are you sure to ${status}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: "#facc15",
      cancelButtonColor: "#3f3f46",
    }).then((result) => {
      if (result.isConfirmed) {
        statusMutation.mutate({ id, status });
      }
    });
  };

  const handleNextPage = () => {
    if (data.hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) return <LoaderSpinner />;

  if (data?.teachers?.length === 0)
    return <ContentNotFound title="No Teachers Found" />;

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Pending Teacher Requests
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-zinc-800 bg-zinc-950 min-w-[1000px]">
          <thead className="bg-zinc-900">
            <tr className="text-left text-gray-300">
              <th className="py-2 text-center">Image</th>
              <th className="py-2">Name</th>
              <th className="py-2">Experience</th>
              <th className="py-2">Title</th>
              <th className="py-2">Category</th>
              <th className="py-2">Status</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.teachers?.map((teacher) => (
              <tr
                key={teacher._id}
                className="border-b border-zinc-800 hover:bg-zinc-900 text-gray-200"
              >
                <td className="py-2">
                  <img
                    src={teacher.photoURL}
                    alt="profile"
                    className="w-12 h-12 rounded-full mx-auto border-2 border-yellow-400"
                  />
                </td>
                <td className="text-white">{teacher.name}</td>
                <td className="text-gray-300">{teacher.experience}</td>
                <td className="text-gray-300">{teacher.title}</td>
                <td className="text-gray-300">{teacher.category}</td>
                <td
                  className={`capitalize font-semibold ${
                    teacher.status === "approved"
                      ? "text-green-400"
                      : teacher.status === "rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {teacher.status}
                </td>
                <td className="space-x-2">
                  <button
                    disabled={
                      teacher.status === "approved" ||
                      teacher.status === "rejected"
                    }
                    className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 disabled:opacity-50 font-medium transition"
                    onClick={() => handleStatusChange(teacher._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    disabled={
                      teacher.status === "approved" ||
                      teacher.status === "rejected"
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 font-medium transition"
                    onClick={() => handleStatusChange(teacher._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center gap-4 items-center">
          <button
            disabled={page === 1}
            onClick={handlePrevPage}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-white rounded hover:bg-zinc-800 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="px-4 py-2 border border-zinc-700 rounded bg-zinc-900 text-white">
            Page: {page}
          </div>
          <button
            disabled={!data.hasNextPage}
            onClick={handleNextPage}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-white rounded hover:bg-zinc-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingTeachers;