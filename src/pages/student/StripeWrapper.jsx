import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { useEffect } from "react";
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

  const { data: courseDetails } = useQuery({
    queryKey: ["courseDetails", user?.email, id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/courses/${id}`
      );
      return response.data.course;
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (ref) => {
      const res = await axiosSecure.get(`/courses/verify-payment/${ref}`);
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
      verifyMutation.mutate(reference);
    }
  }, [reference, verifyMutation]);

  if (!courseDetails) return <LoaderDotted />;

  if (reference) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your enrollment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
          Checkout
        </h2>
        <hr className="mb-8" />
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 ">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Payment Account
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Name:</strong> {user?.displayName || "Guest User"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "Not provided"}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Selected Course
              </h3>
              <p className="text-gray-600 font-semibold leading-relaxed">
                {courseDetails?.title}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Order Summary
            </h2>
            <div className="border border-gray-400 rounded-lg p-6 bg-gray-50 text-gray-700 space-y-4">
              <div className="flex justify-between">
                <span>Amount</span>
                <span>₦5,000</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>₦5,000</span>
              </div>
              <button
                onClick={async () => {
                  try {
                    const res = await axiosSecure.post("/enroll", {
                      courseId: id,
                      format: courseDetails?.hasPdf ? "pdf" : "video",
                    });
                    if (res.data.authorizationUrl) {
                      window.location.href = res.data.authorizationUrl;
                    } else {
                      toast.error("Could not start payment.");
                    }
                  } catch (err) {
                    toast.error(err.response?.data?.message || "Payment initialization failed.");
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
              >
                Pay ₦5,000 with Card (Paystack)
              </button>
              <p className="text-center text-gray-500 text-xs mt-2">
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
