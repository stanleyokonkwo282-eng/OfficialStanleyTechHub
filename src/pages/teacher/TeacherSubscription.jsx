import { useQuery } from "@tanstack/react-query";
import HeadTag from "../../components/common/HeadTag";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function TeacherSubscription() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["my-subscription"],
    queryFn: async () => {
      const res = await axiosSecure.get("/subscriptions/my-subscription");
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <LoaderSpinner />;

  const subscription = data?.subscription || null;
  const userSub = data?.user?.subscription || {};

  const getPlanDetails = (plan) => {
    switch (plan) {
      case "monthly":
        return { label: "Monthly", price: "₦12,500", period: "per month" };
      case "quarterly":
        return { label: "Quarterly", price: "₦33,750", period: "every 3 months", originalPrice: "₦37,500" };
      case "yearly":
        return { label: "Yearly", price: "₦135,000", period: "per year", originalPrice: "₦150,000" };
      default:
        return { label: "Free", price: "₦0", period: "" };
    }
  };

  const planDetails = getPlanDetails(subscription?.plan || userSub?.plan);

  return (
    <>
      <HeadTag title="My Subscription | Creators Hub Academy" />
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">My Subscription</h2>

          {subscription?.status === "active" ? (
            <div className="bg-zinc-950 border border-green-700 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400 font-bold text-lg">Active Subscription</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm">Plan</p>
                  <p className="text-white text-xl font-bold">{planDetails.label}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Price</p>
                  <p className="text-white text-xl font-bold">{planDetails.price}</p>
                  {planDetails.originalPrice && (
                    <p className="text-gray-500 text-sm line-through">{planDetails.originalPrice}</p>
                  )}
                  <p className="text-gray-400 text-xs">{planDetails.period}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Started</p>
                  <p className="text-white">
                    {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Expires</p>
                  <p className="text-white">
                    {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800">
                <p className="text-gray-400 text-sm mb-4">
                  Your subscription gives you full access to the teacher platform including course creation, student management, and earnings.
                </p>
                <a
                  href="/dashboard/courses"
                  className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
                >
                  Go to Teacher Dashboard
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Active Subscription</h3>
              <p className="text-gray-400 mb-6">
                You need an active subscription to access the teacher platform and start selling courses.
              </p>
              <a
                href="/become-teacher"
                className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
              >
                Choose a Plan
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
