import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import StarRatings from "react-star-ratings";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function GiveFeedbackModal({
  setIsModalOpen,
  courseId,
  existingFeedbacks,
  queryClient,
}) {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [rating, setRating] = useState(existingFeedbacks[0]?.rating || 3);
  const modalRef = useRef(null);
  const axiosSecure = useAxiosSecure();

  // console.log(existingFeedbacks);

  // feedback submit mutation
  const addFeedbackMutation = useMutation({
    mutationFn: (data) => {
      return axiosSecure.post(`/feedbacks`, data);
    },
    onSuccess: () => {
      resetTheModal();
      toast.success("Feedback submitted successfully.");
      queryClient.invalidateQueries(["feedbacks", courseId]);
    },
    onError: (error) => {
      resetTheModal();
      toast.error("Failed to submit feedback.");
      console.error(error);
    },
  });

  // update feedback mutation
  const updateFeedbackMutation = useMutation({
    mutationFn: (data) => {
      return axiosSecure.patch(`/feedbacks/${existingFeedbacks[0]?._id}`, data);
      // console.log(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feedbacks", courseId]);
      resetTheModal();
      toast.success("Feedback updated successfully.");
    },
    onError: (error) => {
      resetTheModal();
      toast.error("Failed to update feedback.");
      console.error(error);
    },
  });

  const onSubmit = (data) => {
    const feedback = { ...data, rating, courseId, studentEmail: user.email };
    addFeedbackMutation.mutate(feedback);
  };

  const onUpdate = (data) => {
    const feedback = { ...data, rating };
    console.log(data, feedback);
    updateFeedbackMutation.mutate(feedback);
  };

  const resetTheModal = () => {
    reset();
    setRating(3);
    setIsModalOpen(false);
  };

  //   if (isLoading) return <div>Loading...</div>;

  const addFeedbackButton = (
    <button
      type="submit"
      disabled={addFeedbackMutation.isPending}
      className={`${
        addFeedbackMutation.isLoading
          ? "bg-amber-400/60 cursor-not-allowed"
          : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500"
      } text-zinc-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-amber-500/20`}
    >
      {addFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
    </button>
  );

  const updateFeedbackButton = (
    <button
      type="submit"
      disabled={addFeedbackMutation.isPending}
      className={`${
        addFeedbackMutation.isLoading
          ? "bg-amber-400/60 cursor-not-allowed"
          : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500"
      } text-zinc-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-amber-500/20`}
    >
      {addFeedbackMutation.isPending ? "Submitting..." : "Update Feedback"}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl shadow-black/60 p-6 animate-fadeIn overflow-hidden"
      >
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 absolute top-0 left-0" />
        <button
          className="absolute top-3 right-3 h-8 w-8 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition"
          onClick={() => setIsModalOpen(false)}
          aria-label="Close feedback modal"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold text-white mb-4">Give Feedback</h2>

        <form
          onSubmit={handleSubmit(
            existingFeedbacks.length > 0 ? onUpdate : onSubmit
          )}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1.5 text-sm font-medium text-zinc-300">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              defaultValue={existingFeedbacks[0]?.description || ""}
              rows={4}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 p-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition"
              placeholder="Write your feedback..."
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-zinc-300">
              Rating
            </label>
            <StarRatings
              rating={rating}
              starRatedColor="#fbbf24"
              starHoverColor="#f59e0b"
              changeRating={(newRating) => setRating(newRating)}
              numberOfStars={5}
              name="rating"
              starDimension="32px"
              starSpacing="5px"
            />
          </div>

          <div className="text-right">
            {existingFeedbacks && existingFeedbacks.length > 0
              ? updateFeedbackButton
              : addFeedbackButton}
          </div>
        </form>
      </div>
    </div>
  );
}
