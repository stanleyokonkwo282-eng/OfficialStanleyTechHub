import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const StripeWrapper = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const axiosSecure = useAxiosSecure();
  const reference = searchParams.get("reference");
  const [initiating, setInitiating] = useState(false);

  const { data: courseDetails } = useQuery({
    queryKey: ["courseDetails", user?.email, id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/courses/${id}`
      );
      return response.data.course;
    },
  });

  const paystackCourseUrl =
    import.meta.env.VITE_PAYSTACK_COURSE_URL || "https://paystack.shop/pay/CreatorsHubAcademy";

  const verifyMutation = useMutation({
    mutationFn: async ({ reference, courseId, format }) => {
      const res = await axiosSecure.get(`/courses/verify-payment/${reference}`, {
        params: { courseId, format },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Payment verified! You are now enrolled.");
        window.location.href = `/dashboard/learn/${id}`;
      } else {
        toast.error(data.message || "Payment verification failed.");
        window.location.href = `/courses/${id}`;
      }
    },
    onError: () => {
      toast.error("Could not verify payment. Contact support if you were charged.");
      window.location.href = `/courses/${id}`;
    },
  });

  useEffect(() => {
    if (reference) {
      const courseId = sessionStorage.getItem("enrollmentCourseId");
      const format = sessionStorage.getItem("enrollmentFormat") || "video";
      if (courseId) {
        sessionStorage.removeItem("enrollmentCourseId");
        sessionStorage.removeItem("enrollmentFormat");
      }
      verifyMutation.mutate({ reference, courseId: courseId || id, format });
    }
  }, [reference, verifyMutation, id]);

  if (!courseDetails) return <LoaderDotted />;

  if (reference) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-[130px]" aria-hidden />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-500/10 blur-[130px]" aria-hidden />
        </div>
        <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-black/60 p-10 text-center">
          <div className="mx-auto mb-5 h-12 w-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Verifying Payment...</h2>
          <p className="text-zinc-400">Please wait while we confirm your enrollment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-[130px]" aria-hidden />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-500/10 blur-[130px]" aria-hidden />
      </div>
      <div className="relative max-w-5xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-black/60 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/25 text-amber-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h2m4 0h2m-9-9h10a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Checkout</h2>
            <p className="text-zinc-400 text-sm">Secure enrollment — pay safely with Paystack</p>
          </div>
        </div>
        <hr className="border-zinc-800 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Payment Account</h3>
            <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">Name</span>
                <span className="text-white font-semibold text-right">{user?.displayName || "Guest User"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">Email</span>
                <span className="text-white font-semibold text-right break-all">{user?.email || "Not provided"}</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-white mb-2">Selected Course</h3>
              <p className="text-zinc-300 font-semibold leading-relaxed">
                {courseDetails?.title}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Amount</span>
                <span className="text-white font-bold">{Number(courseDetails?.price) > 0 ? `₦${Number(courseDetails.price).toLocaleString()}` : "Free"}</span>
              </div>
              <div className="border-t border-zinc-800 pt-4 flex justify-between items-center">
                <span className="text-zinc-300 font-semibold">Total</span>
                <span className="text-amber-400 text-xl font-black">{Number(courseDetails?.price) > 0 ? `₦${Number(courseDetails.price).toLocaleString()}` : "Free"}</span>
              </div>
              <button
                onClick={async () => {
                  const format = courseDetails?.hasPdf ? "pdf" : "video";
                  sessionStorage.setItem("enrollmentFormat", format);
                  sessionStorage.setItem("enrollmentCourseId", id);
                  setInitiating(true);
                  try {
                    // Per-course Paystack checkout (free courses enroll instantly)
                    const res = await axiosSecure.post("/enroll", { courseId: id, format });
                    const data = res.data;
                    if (data.success && data.free) {
                      toast.success("🎉 Enrolled! This course is free.");
                      window.location.href = `/dashboard/learn/${id}`;
                      return;
                    }
                    if (data.success && data.authorizationUrl) {
                      window.location.href = data.authorizationUrl;
                      return;
                    }
                    toast.error(data.message || "Could not start checkout — using secure payment page…");
                    window.location.href = paystackCourseUrl;
                  } catch (err) {
                    toast.error(err.response?.data?.message || "Could not start checkout — using secure payment page…");
                    window.location.href = paystackCourseUrl;
                  } finally {
                    setInitiating(false);
                  }
                }}
                disabled={initiating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 font-black transition shadow-lg shadow-amber-500/20 active:scale-[0.99]"
              >
                {initiating ? "Connecting to Paystack…" : "Pay with Card (Paystack)"}
              </button>
              <p className="text-center text-zinc-500 text-xs mt-2">
                You will be redirected to Paystack to complete payment securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeWrapper;
