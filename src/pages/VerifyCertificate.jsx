import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import LoaderSpinner from "../components/common/LoaderSpinner";

export default function VerifyCertificate() {
  const { certificateId: paramId } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(paramId || "");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    const id = searchId.trim().toUpperCase();
    if (!id) { setError("Please enter a certificate ID"); return; }
    setLoading(true);
    setError("");
    setCertificate(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/certificates/verify/${id}`);
      setCertificate(res.data.certificate);
    } catch (err) {
      setError("Certificate not found. Please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const completionDate = certificate
    ? new Date(certificate.completionDate).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Creators Hub Academy" className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Certificate Verification</h1>
          <p className="text-gray-400 mt-2">Enter a certificate ID to verify its authenticity</p>
          <div className="h-1 w-16 bg-yellow-400 mt-4 rounded-full mx-auto"></div>
        </div>

        {/* Search */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">
            Certificate ID
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="e.g. CHA-2026-12345"
              className="flex-1 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 font-mono"
            />
            <button
              onClick={handleVerify}
              disabled={loading}
              className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50"
            >
              {loading ? "..." : "Verify"}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>

        {loading && <LoaderSpinner />}

        {/* Result */}
        {certificate && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Status banner */}
            <div className={`p-4 text-center ${certificate.isVerified ? "bg-green-900 border-b border-green-700" : "bg-red-900 border-b border-red-700"}`}>
              <p className={`font-bold text-lg ${certificate.isVerified ? "text-green-400" : "text-red-400"}`}>
                {certificate.isVerified ? "✓ VERIFIED CERTIFICATE" : "✗ NOT VERIFIED"}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Certificate ID</p>
                  <p className="text-yellow-400 font-mono font-bold">{certificate.certificateId}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <p className={`font-bold ${certificate.isVerified ? "text-green-400" : "text-red-400"}`}>
                    {certificate.isVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Student Name</p>
                  <p className="text-white font-semibold">{certificate.studentName}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Issue Date</p>
                  <p className="text-white font-semibold">{completionDate}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 mb-1">Course Completed</p>
                  <p className="text-white font-semibold">{certificate.courseName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 mb-1">Issued By</p>
                  <p className="text-white font-semibold">Creators Hub Academy</p>
                  <p className="text-gray-400 text-xs">Stanley Okonkwo — Founder</p>
                </div>
              </div>

              {certificate.isVerified && (
                <div className="bg-green-950 border border-green-800 rounded-xl p-4 text-center mt-4">
                  <p className="text-green-400 text-sm font-semibold">
                    This certificate is genuine and was issued by Creators Hub Academy
                  </p>
                  <p className="text-green-300 text-xs mt-1">
                    Learn • Grow • Create — Skills Today, Success Tomorrow
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
            Back to Creators Hub Academy
          </button>
        </div>
      </div>
    </div>
  );
}
