import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useState, useRef } from "react";
import handleUpload from "../../utils/ImageUploadApi";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ManageCertificates() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [uploadingId, setUploadingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const res = await axiosSecure.get("/certificates/all");
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, paymentStatus }) => {
      const res = await axiosSecure.patch(`/certificates/${id}`, { paymentStatus });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Certificate ${variables.paymentStatus}!`);
      queryClient.invalidateQueries(["certificates"]);
    },
    onError: () => toast.error("Failed to update certificate"),
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ id, file }) => {
      const url = await handleUpload(file);
      const res = await axiosSecure.patch(`/certificates/${id}/upload-image`, { certificateImage: url });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Certificate image uploaded!");
      queryClient.invalidateQueries(["certificates"]);
      setUploadingId(null);
    },
    onError: () => {
      toast.error("Failed to upload certificate image");
      setUploadingId(null);
    },
  });

  const handleAction = (id, action) => {
    Swal.fire({
      title: `Are you sure to ${action} this certificate?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: action === "approved" ? "#facc15" : "#dc2626",
      cancelButtonColor: "#3f3f46",
    }).then((result) => {
      if (result.isConfirmed) {
        updateMutation.mutate({ id, paymentStatus: action });
      }
    });
  };

  const handleImageUpload = (certId, file) => {
    if (!file) return;
    setUploadingId(certId);
    uploadMutation.mutate({ id: certId, file });
  };

  if (isLoading) return <LoaderSpinner />;

  const certificates = data?.certificates || [];

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Certificate Requests</h2>
        <p className="text-gray-400 text-sm mt-1">
          Review payment proofs and approve or reject certificate requests
        </p>
        <div className="h-1 w-16 bg-yellow-400 mt-3 rounded-full"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: certificates.length, color: "text-white" },
          { label: "Pending", value: certificates.filter(c => c.paymentStatus === "pending").length, color: "text-yellow-400" },
          { label: "Approved", value: certificates.filter(c => c.paymentStatus === "approved").length, color: "text-green-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">📜</div>
          <p className="text-xl">No certificate requests yet</p>
          <p className="text-sm mt-2">Students will appear here after completing a course and paying ₦10,000</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert._id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cert.paymentStatus === "approved" ? "bg-green-900 text-green-400" :
                      cert.paymentStatus === "rejected" ? "bg-red-900 text-red-400" :
                      "bg-yellow-900 text-yellow-400"
                    }`}>
                      {cert.paymentStatus?.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-xs">{cert.certificateId}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg">{cert.studentName || cert.studentEmail}</h3>
                  <p className="text-gray-400 text-sm">{cert.studentEmail}</p>
                  <p className="text-yellow-400 text-sm font-medium">{cert.courseName}</p>
                  <p className="text-gray-500 text-xs">
                    Submitted: {new Date(cert.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>

                {/* Payment Proof */}
                <div className="w-full md:w-48">
                  <p className="text-gray-400 text-xs mb-2">Payment Proof:</p>
                  {cert.paymentProof ? (
                    <a href={cert.paymentProof} target="_blank" rel="noreferrer">
                      <img
                        src={cert.paymentProof}
                        alt="Payment proof"
                        className="w-full h-32 object-contain rounded-lg border border-zinc-700 hover:border-yellow-400 transition cursor-pointer bg-zinc-900"
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                      />
                      <p className="text-yellow-400 text-xs underline hidden">View proof image</p>
                    </a>
                  ) : (
                    <div className="w-full h-32 bg-zinc-900 rounded-lg border border-zinc-700 flex items-center justify-center">
                      <p className="text-gray-600 text-xs">No proof uploaded</p>
                    </div>
                  )}
                </div>

                {/* Certificate Image Upload */}
                <div className="w-full md:w-48">
                  <p className="text-gray-400 text-xs mb-2">Certificate Design:</p>
                  {cert.certificateImage ? (
                    <div className="relative">
                      <img
                        src={cert.certificateImage}
                        alt="Certificate design"
                        className="w-full h-32 object-contain rounded-lg border border-green-700 bg-zinc-900"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <p className="text-green-400 text-xs mt-1">✓ Uploaded</p>
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-zinc-900 rounded-lg border border-zinc-700 flex items-center justify-center">
                      <p className="text-gray-600 text-xs">No design uploaded</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id={`cert-img-${cert._id}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(cert._id, e.target.files[0])}
                  />
                  <button
                    onClick={() => document.getElementById(`cert-img-${cert._id}`).click()}
                    disabled={uploadingId === cert._id}
                    className="mt-2 w-full px-3 py-1.5 bg-yellow-400 text-black rounded-lg font-bold text-xs hover:bg-yellow-500 disabled:opacity-50"
                  >
                    {uploadingId === cert._id ? "Uploading..." : "Upload Design"}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-3">
                  <button
                    onClick={() => handleAction(cert._id, "approved")}
                    disabled={cert.paymentStatus === "approved" || updateMutation.isPending}
                    className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(cert._id, "rejected")}
                    disabled={cert.paymentStatus === "rejected" || updateMutation.isPending}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
