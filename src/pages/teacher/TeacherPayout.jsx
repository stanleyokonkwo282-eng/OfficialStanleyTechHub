import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import HeadTag from "../../components/common/HeadTag";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function TeacherPayout() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payoutAmount, setPayoutAmount] = useState("");

  const { data: earningsData, isLoading: earningsLoading, refetch: refetchEarnings } = useQuery({
    queryKey: ["teacher-earnings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/earnings/my-earnings");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: payoutInfoData, refetch: refetchPayoutInfo } = useQuery({
    queryKey: ["payout-info"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/payout-info");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const updatePayoutMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.patch(`/users/payout-info`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Bank details updated successfully!");
      refetchPayoutInfo();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update bank details");
    },
  });

  const requestPayoutMutation = useMutation({
    mutationFn: async (amount) => {
      const res = await axiosSecure.post("/payouts/request", { amount });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payout request submitted! Admin will process it soon.");
      setPayoutAmount("");
      refetchEarnings();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to request payout");
    },
  });

  const handleUpdatePayoutInfo = (e) => {
    e.preventDefault();
    const form = e.target;
    updatePayoutMutation.mutate({
      accountName: form.accountName.value,
      accountNumber: form.accountNumber.value,
      bankName: form.bankName.value,
      bankCode: form.bankCode.value,
      payoutMethod: form.payoutMethod.value,
    });
  };

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    Swal.fire({
      title: "Request Payout?",
      text: `You are requesting ₦${amount.toLocaleString()}. This will be processed by admin.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, request payout",
      cancelButtonText: "Cancel",
      background: "#18181b",
      color: "#fff",
      confirmButtonColor: "#facc15",
      cancelButtonColor: "#3f3f46",
    }).then((result) => {
      if (result.isConfirmed) {
        requestPayoutMutation.mutate(amount);
      }
    });
  };

  if (earningsLoading) return <LoaderSpinner />;

  const earnings = earningsData?.earnings || { totalEarnings: 0, availableBalance: 0, pendingPayout: 0 };
  const payoutInfo = payoutInfoData?.payoutInfo || {};
  const transactions = earningsData?.transactions || [];

  return (
    <>
      <HeadTag title="Teacher Payout & Earnings | Creators Hub Academy" />
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Payout & Earnings</h2>

          {/* Earnings Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold text-white">₦{earnings.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-950 border border-green-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-3xl font-bold text-green-400">₦{earnings.availableBalance.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-950 border border-yellow-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Pending Payout</p>
              <p className="text-3xl font-bold text-yellow-400">₦{earnings.pendingPayout.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bank Details Form */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Bank Account Details</h3>
              <form onSubmit={handleUpdatePayoutInfo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Account Name</label>
                  <input
                    type="text"
                    name="accountName"
                    defaultValue={payoutInfo.accountName || ""}
                    className="input input-bordered w-full bg-zinc-900 border-zinc-700 text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    defaultValue={payoutInfo.accountNumber || ""}
                    className="input input-bordered w-full bg-zinc-900 border-zinc-700 text-white"
                    placeholder="0123456789"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    defaultValue={payoutInfo.bankName || ""}
                    className="input input-bordered w-full bg-zinc-900 border-zinc-700 text-white"
                    placeholder="e.g. Opay"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bank Code (optional)</label>
                  <input
                    type="text"
                    name="bankCode"
                    defaultValue={payoutInfo.bankCode || ""}
                    className="input input-bordered w-full bg-zinc-900 border-zinc-700 text-white"
                    placeholder="e.g. 000021"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Payout Method</label>
                  <select
                    name="payoutMethod"
                    defaultValue={payoutInfo.payoutMethod || "bank_transfer"}
                    className="select select-bordered w-full bg-zinc-900 border-zinc-700 text-white"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="paystack_transfer">Paystack Transfer</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={updatePayoutMutation.isPending}
                  className="w-full bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
                >
                  {updatePayoutMutation.isPending ? "Saving..." : "Save Bank Details"}
                </button>
              </form>
            </div>

            {/* Request Payout */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Request Payout</h3>
              <p className="text-gray-400 text-sm mb-4">
                Available balance: <span className="text-green-400 font-bold">₦{earnings.availableBalance.toLocaleString()}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="input input-bordered w-full bg-zinc-900 border-zinc-700 text-white"
                    placeholder="Enter amount"
                    min="1"
                    max={earnings.availableBalance}
                  />
                </div>
                <button
                  onClick={handleRequestPayout}
                  disabled={requestPayoutMutation.isPending || !payoutInfo.accountNumber}
                  className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {requestPayoutMutation.isPending ? "Processing..." : "Request Payout"}
                </button>
                {!payoutInfo.accountNumber && (
                  <p className="text-yellow-400 text-xs">Please add your bank details first.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No transactions yet. Students will appear here after purchasing your courses.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-gray-400">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Student</th>
                      <th className="text-left py-2">Course</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-right py-2">Your Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 10).map((tx) => (
                      <tr key={tx._id} className="border-b border-zinc-800/50">
                        <td className="py-3 text-gray-300">{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 text-gray-300">{tx.studentEmail || "—"}</td>
                        <td className="py-3 text-gray-300">{tx.courseTitle || "—"}</td>
                        <td className="py-3 text-right text-white">₦{tx.amount?.toLocaleString()}</td>
                        <td className="py-3 text-right text-green-400">₦{tx.teacherEarning?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
