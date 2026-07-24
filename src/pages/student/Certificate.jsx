import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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
  const [proofUrl, setProofUrl] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
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

  const requestCertMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/certificates/request", {
        studentEmail: user?.email,
        studentName: user?.displayName || user?.email?.split("@")[0],
        courseId,
        courseName: courseData?.course?.title,
        paymentProof: proofUrl,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment proof submitted! Admin will verify within 24 hours.");
      queryClient.invalidateQueries(["certificate", courseId, user?.email]);
      setShowPaymentForm(false);
    },
    onError: () => {
      toast.error("Failed to submit. Please try again.");
    },
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
  const studentName = user?.displayName || user?.email?.split("@")[0] || "Student";
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

  // Certificate approved — show the actual certificate
  if (certificate?.paymentStatus === "approved" && certificate?.isVerified) {
    const completionDate = new Date(certificate.completionDate).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@600;700;800&family=Cormorant+Garamond:wght@500;600&display=swap');
          .cert-print-colors { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        `}</style>

        <div className="flex gap-4 mb-8 print:hidden">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700">
            Back
          </button>
          <button onClick={() => window.print()} className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500">
            Download Certificate
          </button>
        </div>

        {/* Outer gradient border frame */}
        <div
          ref={certRef}
          className="cert-print-colors w-full max-w-3xl rounded-2xl shadow-2xl print:shadow-none relative"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #7c3aed 45%, #1a1a2e)",
            padding: "10px",
          }}
        >
          {/* Inner ivory card */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              background: "#fdfaf2",
              backgroundImage:
                "radial-gradient(circle, rgba(124,58,237,0.06) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              border: "2px solid #e8d9b5",
            }}
          >
            {/* Corner flourishes */}
            <svg className="absolute top-3 left-3 w-16 h-16 opacity-70" viewBox="0 0 90 90" fill="none">
              <path d="M5 85 C5 40, 40 5, 85 5" stroke="#c99a3f" strokeWidth="2" fill="none" />
              <circle cx="15" cy="75" r="3" fill="#f59e0b" />
              <circle cx="32" cy="52" r="2" fill="#7c3aed" />
              <circle cx="55" cy="30" r="2.5" fill="#f59e0b" />
            </svg>
            <svg className="absolute top-3 right-3 w-16 h-16 opacity-70" viewBox="0 0 90 90" fill="none" style={{ transform: "scaleX(-1)" }}>
              <path d="M5 85 C5 40, 40 5, 85 5" stroke="#c99a3f" strokeWidth="2" fill="none" />
              <circle cx="15" cy="75" r="3" fill="#f59e0b" />
              <circle cx="32" cy="52" r="2" fill="#7c3aed" />
              <circle cx="55" cy="30" r="2.5" fill="#f59e0b" />
            </svg>
            <svg className="absolute bottom-3 left-3 w-16 h-16 opacity-70" viewBox="0 0 90 90" fill="none" style={{ transform: "scaleY(-1)" }}>
              <path d="M5 85 C5 40, 40 5, 85 5" stroke="#c99a3f" strokeWidth="2" fill="none" />
              <circle cx="15" cy="75" r="3" fill="#f59e0b" />
              <circle cx="32" cy="52" r="2" fill="#7c3aed" />
              <circle cx="55" cy="30" r="2.5" fill="#f59e0b" />
            </svg>
            <svg className="absolute bottom-3 right-3 w-16 h-16 opacity-70" viewBox="0 0 90 90" fill="none" style={{ transform: "scale(-1,-1)" }}>
              <path d="M5 85 C5 40, 40 5, 85 5" stroke="#c99a3f" strokeWidth="2" fill="none" />
              <circle cx="15" cy="75" r="3" fill="#f59e0b" />
              <circle cx="32" cy="52" r="2" fill="#7c3aed" />
              <circle cx="55" cy="30" r="2.5" fill="#f59e0b" />
            </svg>

            <div className="px-10 py-12 sm:px-14 sm:py-14 flex flex-col items-center text-center relative z-10">
              <img src="/logo.png" alt="Creators Hub Academy" className="w-20 h-20 object-contain mb-3" />
              <p
                className="text-sm tracking-[0.3em] uppercase mb-1"
                style={{ color: "#7c3aed", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
              >
                Creators Hub Academy
              </p>

              <h1
                className="text-3xl sm:text-4xl mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#1a1a2e" }}
              >
                Certificate of Completion
              </h1>

              <div
                className="mb-8 px-8 py-2"
                style={{
                  background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
                  clipPath: "polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)",
                }}
              >
                <p className="text-white text-xs sm:text-sm font-bold tracking-widest uppercase">
                  This certificate is proudly presented to
                </p>
              </div>

              <h2
                className="text-3xl sm:text-5xl mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #7c3aed, #c026d3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {studentName}
              </h2>

              <p className="text-gray-600 text-base sm:text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                for successfully completing the course
              </p>
              <h3 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: "#1a1a2e" }}>
                {courseName}
              </h3>

              <div className="flex flex-wrap justify-center gap-x-10 gap-y-1 mb-8 text-sm text-gray-500">
                <p>Issued on <strong style={{ color: "#1a1a2e" }}>{completionDate}</strong></p>
                <p>Certificate ID: <strong style={{ color: "#1a1a2e" }}>{certificate.certificateId}</strong></p>
              </div>

              <div className="w-full border-t mb-8" style={{ borderColor: "#e8d9b5" }} />

              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-8">
                {/* Seal */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-24 h-24 rounded-full flex flex-col items-center justify-center border-4"
                    style={{
                      borderColor: "#f59e0b",
                      background: "linear-gradient(135deg, #7c3aed, #1a1a2e)",
                    }}
                  >
                    <span className="text-yellow-400 text-2xl">✦</span>
                    <span className="text-white text-[9px] font-bold tracking-widest mt-1">VERIFIED</span>
                  </div>
                  <p className="text-gray-500 text-[10px] tracking-widest uppercase mt-2">Official Seal</p>
                </div>

                {/* Signature */}
                <div className="flex flex-col items-center">
                  <p
                    style={{
                      fontFamily: "'Great Vibes', cursive",
                      fontSize: "2.75rem",
                      color: "#1a1a2e",
                      lineHeight: 1,
                    }}
                  >
                    Stanley Okonkwo
                  </p>
                  <div className="w-48 border-t mt-2 mb-2" style={{ borderColor: "#1a1a2e" }} />
                  <p className="text-gray-600 text-sm font-semibold">Stanley Okonkwo</p>
                  <p className="text-gray-500 text-xs">Founder, Creators Hub Academy</p>
                </div>
              </div>

              <p className="text-gray-400 text-[10px] tracking-[0.25em] uppercase mt-10">
                Learn · Grow · Create · Build Your Future Together
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Certificate pending review (manual bank transfer, awaiting admin)
  if (certificate?.paymentStatus === "pending") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-6xl">⏳</div>
        <h2 className="text-white text-2xl font-bold">Payment Under Review</h2>
        <p className="text-gray-400 text-center max-w-md">
          Your payment proof has been submitted. Admin will verify your payment within 24 hours.
          Once approved, your certificate will be available here.
        </p>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-md space-y-3">
          <div>
            <p className="text-gray-400 text-sm">Certificate ID (reserved):</p>
            <p className="text-yellow-400 font-bold text-lg">{certificate.certificateId}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Status:</p>
            <p className="text-yellow-400 font-semibold">Pending Verification</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Payment Proof Submitted:</p>
            {certificate.paymentProof && (
              <img src={certificate.paymentProof} alt="Payment proof" className="w-full max-h-32 object-contain rounded mt-1 border border-zinc-700" onError={(e) => e.target.style.display = "none"} />
            )}
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700">
          Back
        </button>
      </div>
    );
  }

  // Certificate rejected
  if (certificate?.paymentStatus === "rejected") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-6xl">❌</div>
        <h2 className="text-white text-2xl font-bold">Payment Rejected</h2>
        <p className="text-gray-400 text-center max-w-md">
          Your payment proof was rejected. Please make sure you transferred exactly ₦10,000
          and upload a clear screenshot. Contact us on WhatsApp if you need help.
        </p>
        <a href="https://wa.me/2348134438808" target="_blank" rel="noreferrer"
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600">
          Contact on WhatsApp
        </a>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700">
          Back
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
          <p className="text-xs mt-1">Certificate verified worldwide · Unique ID issued</p>
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

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-zinc-800" />
          <p className="text-gray-500 text-xs uppercase">Or pay manually by bank transfer</p>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-6">
          <h3 className="text-white text-xl font-bold mb-4">How to Get Your Certificate</h3>
          <div className="space-y-4 text-sm">
            {[
              "Transfer ₦10,000 to any account below",
              "Take a screenshot of your payment confirmation",
              "Upload the screenshot link below and submit",
              "Admin verifies within 24 hours and issues your certificate",
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="bg-yellow-400 text-black w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">{i + 1}</span>
                <p className="text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <p className="text-yellow-400 font-bold text-sm mb-3">OPAY BANK</p>
            <p className="text-white font-bold text-2xl tracking-widest mb-1">8134438808</p>
            <p className="text-gray-400 text-sm">Nonso Stanley Okonkwo</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <p className="text-yellow-400 font-bold text-sm mb-3">POLARIS BANK</p>
            <p className="text-white font-bold text-2xl tracking-widest mb-1">3046748449</p>
            <p className="text-gray-400 text-sm">Nonso Stanley Okonkwo</p>
          </div>
        </div>

        {!showPaymentForm ? (
          <button onClick={() => setShowPaymentForm(true)} className="w-full py-4 bg-zinc-800 border border-zinc-700 text-white rounded-xl font-bold text-lg hover:bg-zinc-700">
            I Have Paid by Bank Transfer — Submit Proof
          </button>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <h4 className="text-white font-bold mb-4">Submit Payment Proof</h4>
            <p className="text-gray-400 text-sm mb-3">
              Upload your payment screenshot to{" "}
              <a href="https://postimages.org" target="_blank" rel="noreferrer" className="text-yellow-400 underline">postimages.org</a>
              {" "}then paste the image link below.
            </p>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://i.postimg.cc/your-image-link.jpg"
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 mb-4"
            />
            {proofUrl && (
              <div className="mb-4 rounded-lg overflow-hidden border border-zinc-700">
                <img src={proofUrl} alt="Payment proof preview" className="w-full max-h-48 object-contain bg-zinc-900" onError={(e) => e.target.style.display = "none"} />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowPaymentForm(false)} className="flex-1 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 font-semibold">
                Cancel
              </button>
              <button
                onClick={() => requestCertMutation.mutate()}
                disabled={!proofUrl || requestCertMutation.isPending}
                className="flex-1 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50"
              >
                {requestCertMutation.isPending ? "Submitting..." : "Submit Proof"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="https://wa.me/2348134438808" target="_blank" rel="noreferrer" className="text-green-400 text-sm hover:underline">
            Need help? Contact us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}