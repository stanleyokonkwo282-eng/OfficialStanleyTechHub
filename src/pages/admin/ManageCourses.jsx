import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ContentNotFound from "../../components/common/ContentNotFound";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ManageCourses() {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["admin-courses", { page: currentPage }],
    queryFn: async () => {
      const res = await axiosSecure.get("/courses/all", {
        params: { page: currentPage, limit: 10 },
      });
      return res.data;
    },
    enabled: user?.accessToken !== null,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      await axiosSecure.patch(`/courses/change-status/${id}`, { status });
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries(["admin-courses"]);
    },
    onError: () => {
      toast.error("Failed to update status");
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
        updateStatus.mutate({ id, status });
      }
    });
  };

  const handleNextPage = () => {
    if (coursesData?.hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      toast.error("No more pages available");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else {
      toast.error("You are already on the first page");
    }
  };

  if (isLoading) return <LoaderSpinner />;

  if (coursesData?.courses?.length === 0)
    return <ContentNotFound title="No Courses Found" />;

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-white">All Courses</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border border-zinc-800 bg-zinc-950 min-w-[1000px]">
          <thead>
            <tr className="bg-zinc-900 text-gray-300">
              <th className="text-gray-300">Image</th>
              <th className="text-gray-300">Title</th>
              <th className="text-gray-300">Email</th>
              <th className="text-gray-300">Status</th>
              <th className="text-gray-300">Progress</th>
              <th className="text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coursesData?.courses?.map((course) => (
              <tr
                key={course._id}
                className="border-t border-zinc-800 hover:bg-zinc-900 text-gray-200"
              >
                <td>
                  <img
                    src={course.image}
                    alt={`${course.title} course thumbnail`}
                    className="w-16 h-12 rounded"
                  />
                </td>
                <td className="text-white">{course.title}</td>
                <td className="text-gray-400">{course.instructorEmail}</td>
                <td>
                  <span
                    className={`badge ${
                      course.status === "approved"
                        ? "badge-success"
                        : course.status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/dashboard/courses/${course._id}`}
                    className={`btn btn-sm bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 ${
                      course.status === "pending" ? "btn-disabled" : ""
                    }`}
                  >
                    Progress
                  </Link>
                </td>
                <td>
                  <button
                    className="btn btn-xs bg-yellow-400 text-black hover:bg-yellow-500 border-none mr-2"
                    disabled={course.status === "approved"}
                    onClick={() => handleStatusChange(course._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-xs bg-red-600 text-white hover:bg-red-700 border-none"
                    disabled={course.status === "rejected"}
                    onClick={() => handleStatusChange(course._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="join mt-10 flex justify-center">
          <button
            disabled={currentPage === 1}
            onClick={handlePrevPage}
            className="join-item btn bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
          >
            «
          </button>
          <button className="join-item btn bg-zinc-900 border-zinc-700 text-white">
            Page {currentPage} of {coursesData?.totalPages}
          </button>
          <button
            disabled={!coursesData?.hasNextPage}
            onClick={handleNextPage}
            className="join-item btn bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
