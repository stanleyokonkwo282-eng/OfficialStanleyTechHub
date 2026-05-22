import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function AssignmentModal({
  setIsAssignmentModalOpen,
  assignmentId,
  courseId,
  queryClient,
}) {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();

  // feedback submit mutation
  const submitAssignmentMutation = useMutation({
    mutationFn: (data) => {
      return axiosSecure.post(`/submissions`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assignments", courseId]);
      resetTheModal();
      toast.success("Assignment submitted successfully.");
    },
    onError: (error) => {
      resetTheModal();
      toast.error("Failed to submit feedback.");
      console.error(error);
    },
  });

  const onSubmit = (data) => {
    const assignment = {
      ...data,
      assignmentId,
      courseId,
      studentEmail: user.email,
      submittedAt: new Date(),
    };
    submitAssignmentMutation.mutate(assignment);
  };

  const resetTheModal = () => {
    reset();
    setIsAssignmentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-[#00000090] z-50 flex justify-center items-center transition-all">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-lg relative animate-fadeIn">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-400 transition"
          onClick={() => setIsAssignmentModalOpen(false)}
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">
          Submit Assignment
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">
              Your Submission
            </label>
            <textarea
              {...register("submission", { required: true })}
              rows={4}
              className="w-full border border-zinc-700 rounded-md p-2 bg-zinc-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Write your submission..."
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={submitAssignmentMutation.isPending}
              className={`${
                submitAssignmentMutation.isPending
                  ? "bg-yellow-400/60 cursor-not-allowed text-black"
                  : "bg-yellow-400 hover:bg-yellow-500 text-black"
              } px-4 py-2 rounded font-medium transition`}
            >
              {submitAssignmentMutation.isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}