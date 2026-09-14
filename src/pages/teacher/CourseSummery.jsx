import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CourseSummery = () => {
  const { courseId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // ------------------- Fetching course info ------------------- //

  const { data: courseInfo = {} } = useQuery({
    queryKey: ["courseInfo", courseId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/courses/${courseId}`
      );
      // console.log("Course info fetched:", data.course);
      return data.course;
    },
  });

  // ------------------ FETCH CLASS STATS ------------------ //
  const { data: courseStats, isLoading } = useQuery({
    queryKey: ["courseStats", courseId],
    queryFn: async () => {
      const submissions = await axiosSecure.get(`/submissions/${courseId}`);
      const enrollments = await axiosSecure.get(`/enrollments/${courseId}`);
      const assignments = await axiosSecure.get(`/assignments/${courseId}`);

      const result = {
        submissions: submissions.data.submissions,
        enrollments: enrollments.data.enrollments,
        assignments: assignments.data.assignments,
      };

      return result;
    },
    onError: (error) => {
      console.error("Error fetching course stats:", error);
    },
    enabled: user.accessToken !== null,
  });

  // ------------------ CREATE ASSIGNMENT ------------------ //
  const addAssignmentMutation = useMutation({
    mutationFn: async (newAssignment) => {
      const res = await axiosSecure.post(`/assignments`, newAssignment);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["courseStats", courseId]);
      toast.success("Assignment added successfully.");
      setModalOpen(false);
      reset();
    },
    onError: (error) => {
      toast.error("Failed to add assignment.");
      setModalOpen(false);
      reset();
      console.error(error);
    },
  });

  // ------------------ SUBMIT FORM ------------------ //
  const onSubmit = (data) => {
    data.courseId = courseId;
    data.createdAt = new Date();
    addAssignmentMutation.mutate(data);
    reset();
    setModalOpen(false);
  };

  if (isLoading) return <LoaderDotted />;

  return (
    <div className="p-6 flex-1 mx-auto max-w-7xl text-white">
      <h2 className="text-2xl font-black text-white mb-6">
        Class Progress <span className="text-zinc-400 text-lg font-semibold">({courseInfo.title})</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card
          title="Total Enrollments"
          count={courseStats?.enrollments?.length || 0}
        />
        <Card
          title="Total Assignments"
          count={courseStats?.assignments?.length || 0}
        />
        <Card
          title="Total Submissions"
          count={courseStats?.submissions?.length || 0}
        />
      </div>

      {user.role === "teacher" && (
        <div className="text-right">
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold transition shadow-lg shadow-amber-500/20"
          >
            Create Assignment
          </button>
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="relative w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/60 animate-fadeIn overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 absolute top-0 left-0" />
            <h3 className="text-lg font-bold text-white mb-4">Add Assignment</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label htmlFor="title" className="block mb-1 text-sm font-medium text-zinc-300">
                  Assignment Title:
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Write title here..."
                  {...register("title", { required: true })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label htmlFor="deadline" className="block mb-1 text-sm font-medium text-zinc-300">
                  Deadline:
                </label>
                <input
                  min={new Date().toISOString().split("T")[0]}
                  id="deadline"
                  type="date"
                  {...register("deadline", { required: true })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white [color-scheme:dark] focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label htmlFor="description" className="block mb-1 text-sm font-medium text-zinc-300">
                  Description:
                </label>
                <textarea
                  placeholder="Assignment Description"
                  {...register("description", { required: true })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                {!addAssignmentMutation.isPending && (
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold transition shadow-lg shadow-amber-500/20 disabled:opacity-60"
                  disabled={addAssignmentMutation.isPending}
                >
                  {addAssignmentMutation.isPending
                    ? "Submitting..."
                    : "Add Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSummery;

// Reusable card component
const Card = ({ title, count }) => (
  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg hover:border-amber-500/30 transition">
    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">{title}</h4>
    <p className="text-3xl font-black text-amber-400 mt-2">{count}</p>
  </div>
);
