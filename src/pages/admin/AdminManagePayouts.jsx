import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import HeadTag from "../../components/common/HeadTag";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function AdminManagePayouts() {
  const axiosSecure = useAxiosSecure();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payouts/all");
      return res.data;
    },
  });

  const processMutation = useMutation({
    mutationFn: async ({ id, action, notes }) => {
      const res = await axiosSecure.post(`/payouts/${id}/process`, { action, notes });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payout updated");
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to process payout");
    },
  });

  const handleProcess = (payout) => {
    Swal.fire({
      title: "Process Payout",
      html: `
        <div class="text-left">
          <p class="mb-2">Teacher: <strong>${payout.teacherEmail}</strong></p>
          <p class="mb-2">Amount: <strong>₦${payout.amount?.toLocaleString()}</strong></p>
          <p class="mb-2">Bank: <strong>${payout.bankName}</strong></p>
          <p class="mb-4">Account: <strong>****${payout.accountNumber?.slice(-4)}</strong></p>
          <select id="payout-action" class="select select-bordered w-full bg-zinc-900 border-zinc-700 text-white">
            <option value="approve">Approve & Transfer</option>
            <option value="reject">Reject</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Submit",
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: "#facc15",
      cancelButtonColor: "#3f3f46",
      preConfirm: () => {
        const action = document.getElementById("payout-action")?.value;
        if (!action) {
          Swal.showValidationMessage("Please select an action");
        }
        return action;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        processMutation.mutate({ id: payout._id, action: result.value });
      }
    });
  };

  if (isLoading) return <LoaderSpinner />;

  const payouts = data?.payouts || [];

  return (
    <>
      <HeadTag title="Manage Payouts | Creators Hub Academy" />
      <div className="p-6 bg-black text-white min-h-screen">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Teacher Payouts</h2>

        {payouts.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">No payout requests yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full border border-zinc-800 bg-zinc-950">
              <thead>
                <tr className="bg-zinc-900 text-gray-300">
                  <th className="text-gray-300">Teacher</th>
                  <th className="text-gray-300">Amount</th>
                  <th className="text-gray-300">Bank</th>
                  <th className="text-gray-300">Account</th>
                  <th className="text-gray-300">Status</th>
                  <th className="text-gray-300">Date</th>
                  <th className="text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout._id} className="border-t border-zinc-800 hover:bg-zinc-900 text-gray-200">
                    <td className="text-white">{payout.teacherEmail}</td>
                    <td className="text-white">₦{payout.amount?.toLocaleString()}</td>
                    <td className="text-gray-400">{payout.bankName}</td>
                    <td className="text-gray-400">****{payout.accountNumber?.slice(-4)}</td>
                    <td>
                      <span className={`badge ${
                        payout.status === "completed" ? "badge-success" :
                        payout.status === "pending" ? "badge-warning" :
                        payout.status === "processing" ? "badge-info" :
                        payout.status === "rejected" ? "badge-error" :
                        "badge-ghost"
                      }`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="text-gray-400">{new Date(payout.createdAt).toLocaleDateString()}</td>
                    <td>
                      {payout.status === "pending" && (
                        <button
                          onClick={() => handleProcess(payout)}
                          className="btn btn-xs bg-yellow-400 text-black hover:bg-yellow-500 border-none"
                        >
                          Process
                        </button>
                      )}
                      {payout.status === "processing" && (
                        <span className="text-gray-400 text-xs">Processing...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
