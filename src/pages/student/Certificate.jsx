import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function Certificate() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const certRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const paystackReference = searchParams.get("reference");

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/courses/${courseId}`);
      return res.data;
    },
  });

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["progress", courseId, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/progress/${courseId}/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: certData, isLoading: certLoading } = useQuery({
    queryKey: ["certificate", courseId, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/certificates/status/${courseId}/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const paystackInitMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/certificates/paystack/initialize", {
        studentEmail: user?.email,
        studentName: user?.displayName || user?.email?.split("@")[0],
        courseId,
        courseName: courseData?.course?.title,
        callbackUrl: `${window.location.origin}/dashboard/certificate/${courseId}`,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else if (data?.alreadyApproved) {
        toast.success("Certificate already approved!");
        queryClient.invalidateQueries(["certificate", courseId, user?.email]);
      } else {
        toast.error(data?.message || "Could not start payment.");
      }
    },
    onError: () => {
      toast.error("Could not start payment. Please try again.");
    },
  });

  const paystackVerifyMutation = useMutation({
    mutationFn: async (reference) => {
      const res = await axiosSecure.get(`/certificates/paystack/verify/${reference}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Payment verified! Your certificate is ready.");
        queryClient.invalidateQueries(["certificate", courseId, user?.email]);
      } else {
        toast.error(data.message || "Payment verification failed. Contact support if you were charged.");
      }
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("reference");
      setSearchParams(nextParams, { replace: true });
    },
    onError: () => {
      toast.error("Could not verify payment. Contact support if you were charged.");
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("reference");
      setSearchParams(nextParams, { replace: true });
    },
  });

  useEffect(() => {
    if (paystackReference && !paystackVerifyMutation.isPending && !paystackVerifyMutation.isSuccess) {
      paystackVerifyMutation.mutate(paystackReference);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paystackReference]);

  if (courseLoading || progressLoading || certLoading || paystackVerifyMutation.isPending) {
    return <LoaderSpinner />;
  }

  const courseName = courseData?.course?.title || "Digital Skills Course";
  const certificate = certData?.certificate;

  // Not completed yet
  if (!progressData?.percentage || progressData?.percentage < 100) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl">📚</div>
        <p className="text-white text-2xl font-bold">Course Not Completed Yet</p>
        <p className="text-gray-400 text-center">Complete all lessons to earn your certificate.</p>
        <div className="w-64 bg-zinc-800 rounded-full h-4 mt-2">
          <div className="bg-yellow-400 h-4 rounded-full transition-all" style={{ width: `${progressData?.percentage || 0}%` }} />
        </div>
        <p className="text-yellow-400 text-2xl font-bold">{progressData?.percentage || 0}% Complete</p>
        <button onClick={() => navigate(`/dashboard/learn/${courseId}`)} className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500">
          Continue Learning
        </button>
      </div>
    );
  }

  // Certificate approved — show the uploaded certificate image or placeholder
  if (certificate?.paymentStatus === "approved" && certificate?.isVerified) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
          @media print {
            body { background: white !important; }
            .print\\:hidden { display: none !important; }
            .cert-frame { box-shadow: none !important; border: 2px solid #e8d9b5 !important; }
          }
        `}</style>

        <div className="flex gap-4 mb-8 print:hidden">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700">
            Back
          </button>
          {certificate?.certificateImage && (
            <button onClick={() => window.print()} className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500">
              Download Certificate
            </button>
          )}
        </div>

        {certificate?.certificateImage ? (
          <div
            ref={certRef}
            className="cert-frame w-full max-w-3xl rounded-2xl shadow-2xl print:shadow-none overflow-hidden"
            style={{ background: "#fdfaf2", border: "3px solid #e8d9b5", padding: "12px" }}
          >
            <div className="relative rounded-xl overflow-hidden bg-white">
              <img
                src={certificate.certificateImage}
                alt="Your Certificate"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="hidden items-center justify-center p-12 text-center"
                style={{ display: "none" }}
              >
                <p className="text-gray-500 text-lg">Unable to load certificate image. Please contact support.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-lg w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Certificate Pending
            </h2>
            <p className="text-gray-400 mb-6">
              Your payment has been verified and your certificate is being designed. You will receive it here shortly.
            </p>
            <div className="bg-zinc-900 rounded-xl p-4 mb-6">
              <p className="text-gray-400 text-sm">Certificate ID</p>
              <p className="text-yellow-400 font-bold font-mono">{certificate.certificateId}</p>
            </div>
            <p className="text-gray-500 text-sm">
              If you have any questions, contact us on{" "}
              <a href="https://wa.me/2348134438808" className="text-green-400 underline">WhatsApp</a> or{" "}
              <a href="mailto:support@creatorshubacademy.com" className="text-yellow-400 underline">Email</a>.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Certificate payment — Paystack only
  if (!progressData?.percentage || progressData?.percentage < 100) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl">📚</div>
        <p className="text-white text-2xl font-bold">Course Not Completed Yet</p>
        <p className="text-gray-400 text-center">Complete all lessons to earn your certificate.</p>
        <div className="w-64 bg-zinc-800 rounded-full h-4 mt-2">
          <div className="bg-yellow-400 h-4 rounded-full transition-all" style={{ width: `${progressData?.percentage || 0}%` }} />
        </div>
        <p className="text-yellow-400 text-2xl font-bold">{progressData?.percentage || 0}% Complete</p>
        <button onClick={() => navigate(`/dashboard/learn/${courseId}`)} className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500">
          Continue Learning
        </button>
      </div>
    );
  }

  // Course complete — show payment options
  return (
    <div className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="bg-green-950 border border-green-800 rounded-2xl p-6 text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-green-400">Congratulations!</h2>
          <p className="text-green-300 mt-2">You completed <strong>{courseName}</strong></p>
          <p className="text-gray-400 text-sm mt-1">Pay ₦10,000 to receive your verified certificate</p>
        </div>

        <div className="bg-yellow-400 text-black rounded-xl p-4 text-center mb-6">
          <p className="text-sm font-semibold">Amount to Pay</p>
          <p className="text-4xl font-bold">₦10,000</p>
          <p className="text-xs mt-1">Certificate issued with unique verification ID</p>
        </div>

        <button
          onClick={() => paystackInitMutation.mutate()}
          disabled={paystackInitMutation.isPending}
          className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 disabled:opacity-50 mb-3"
        >
          {paystackInitMutation.isPending ? "Starting payment..." : "💳 Pay ₦10,000 with Card (Instant)"}
        </button>
        <p className="text-gray-500 text-xs text-center mb-8">
          Secure payment via Paystack. Your certificate unlocks immediately after payment.
        </p>

        <div className="mt-6 text-center">
          <a href="https://wa.me/2348134438808" target="_blank" rel="noreferrer" className="text-green-400 text-sm hover:underline">
            Need help? Contact us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
