import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import UpdateCourse from "./UpdateCourse";

export default function TeachersCourses() {
  const [page, setPage] = useState(1);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-courses", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/courses/teacher/${user.email}?page=${page}&limit=9`
      );
      return res.data;
    },
    enabled: user.accessToken !== null,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/courses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Course deleted");
      queryClient.invalidateQueries(["my-courses", user.email]);
    },
    onError: (err) => {
      toast.error("Failed to delete course");
      console.error(err);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsUpdateModalOpen(true);
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

  if (isLoading) return <LoaderDotted />;
  return (
    <>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">Teacher Studio</p>
          <h2 className="text-3xl font-extrabold text-white">My Courses</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage your published courses, update content and track approvals</p>
          <div className="h-1 w-16 bg-amber-400 mt-3 rounded-full"></div>
        </div>

        {data.courses?.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Courses Yet</h2>
            <p className="text-gray-400 mb-6">You haven't added any courses yet.</p>
            <Link to="/dashboard/courses/add" className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500">Add Your First Course</Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.courses?.map((course) => (
                <div
                  key={course._id}
                  className="group bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-400/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-amber-500/10 hover:-translate-y-1"
                >
                  <img
                    src={course.image || course.thumbnail || "/logo.png"}
                    alt={course.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "/logo.png"; }}
                  />
                  <div className="mt-3">
                    <h3 className="text-lg font-bold">{course.title}</h3>

                     <p className="mt-2">
                       <span className="text-sm font-semibold">Price:</span> ₦
                       {course.price || 5000}
                     </p>

                    <p className="mt-2">
                      <span className="font-semibold">Status:</span>{" "}
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
                    </p>

                    <div className="flex flex-wrap gap-2 mt-6">
                      <button
                        className="flex-1 min-w-[80px] px-3 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white transition-all duration-200 shadow-md"
                        onClick={() => handleEdit(course)}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="flex-1 min-w-[80px] px-3 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white transition-all duration-200 shadow-md"
                      >
                        Delete
                      </button>

                      {course.status === "approved" ? (
                        <Link
                          to={`${course._id}`}
                          className="flex-1 min-w-[80px] text-center px-3 py-2 text-xs font-bold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all duration-200"
                        >
                          See Details
                        </Link>
                      ) : (
                        <button className="flex-1 min-w-[80px] px-3 py-2 text-xs font-bold rounded-lg bg-zinc-800/50 text-zinc-600 cursor-not-allowed border border-zinc-800">
                          See Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 flex justify-center items-center gap-3">
              <button
                disabled={page === 1}
                onClick={handlePrevPage}
                className="btn btn-primary"
              >
                Previous
              </button>
              <div className="px-4 py-1 border border-gray-300 rounded">
                Page: {page} of {data.totalPages}
              </div>
              <button
                disabled={!data.hasNextPage}
                onClick={handleNextPage}
                className="btn btn-primary"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <UpdateCourse
        course={selectedCourse}
        isOpen={isUpdateModalOpen}
        setIsOpen={setIsUpdateModalOpen}
        refetch={refetch}
      />
    </>
  );
}
