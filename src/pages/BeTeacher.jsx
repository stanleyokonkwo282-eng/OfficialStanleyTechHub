import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import HeadTag from "../components/common/HeadTag";
import LoaderDotted from "../components/common/LoaderDotted";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import NoticeBoard from "./common/NoticeBoard";
import { useState, useEffect } from "react";

const PLANS = {
  monthly: { label: "Monthly", price: 12500, originalPrice: 12500, discount: 0, period: "1 month", popular: false },
  quarterly: { label: "Quarterly", price: 33750, originalPrice: 37500, discount: 3750, period: "3 months", popular: true },
  yearly: { label: "Yearly", price: 135000, originalPrice: 150000, discount: 15000, period: "12 months", popular: false },
};

const BeTeacher = () => {
  const { user, setUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      experience: user?.experience || "",
      title: user?.title || "",
      category: user?.category || "",
      bio: user?.bio || "",
    },
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.email) return;
      try {
        const res = await axiosSecure.get("/subscriptions/my-subscription");
        setSubscription(res.data?.subscription || null);
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      }
    };
    fetchSubscription();
  }, [user?.email, axiosSecure]);

  const saveProfileMutation = useMutation({
    mutationFn: async (data) => {
      const result = await axiosSecure.post(
        `${import.meta.env.VITE_BASE_URL}/be-teacher/${user.email}`,
        data
      );
      return result.data;
    },
    onSuccess: (data) => {
      if (data?.data) {
        setUser((prev) => ({ ...prev, ...data.data }));
      }
      Swal.fire({
        title: "Profile saved!",
        text: "Now choose a subscription plan to activate your teacher account.",
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "Choose Plan",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#facc15",
      });
    },
    onError: (error) => {
      console.log(error);
      Swal.fire({
        title: "Something went wrong",
        text: "Please try again later.",
        icon: "error",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#facc15",
      });
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (plan) => {
      const res = await axiosSecure.post("/subscriptions/initialize", {
        email: user.email,
        plan,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        Swal.fire({
          title: "Payment initialization failed",
          text: "Please try again.",
          icon: "error",
          background: "#18181b",
          color: "#fff",
          confirmButtonColor: "#facc15",
        });
      }
    },
    onError: (error) => {
      console.error("Subscription error:", error);
      const backendMessage = error?.response?.data?.message;
      const fullError = error?.message || "Unknown error";
      
      Swal.fire({
        title: "Payment failed",
        text: backendMessage || fullError || "Please try again later.",
        icon: "error",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#facc15",
      });
    },
  });

  const onSaveProfile = (data) => {
    saveProfileMutation.mutate(data);
  };

  const onSubscribe = (plan) => {
    setSelectedPlan(plan);
    subscribeMutation.mutate(plan);
  };

  if (!user) return <LoaderDotted />;

  const isApprovedTeacher = user?.status === "approved" && user?.role === "teacher";
  const isPendingTeacher = user?.status === "pending" && user?.role === "teacher";
  const hasActiveSubscription = subscription?.status === "active";
  const showPlans = !hasActiveSubscription && !isApprovedTeacher;

  return (
    <>
      <HeadTag title="Become a Teacher | Creators Hub Academy" />
      <div className="min-h-screen bg-black py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Become a <span className="text-yellow-400">Teacher</span>
          </h2>

          {/* Already approved teacher */}
          {isApprovedTeacher && (
            <div className="bg-zinc-950 border border-green-700 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-white mb-2">You are already a teacher!</h3>
              <p className="text-gray-400 mb-6">Go to your dashboard to manage courses and track earnings.</p>
              <a
                href="/dashboard/courses"
                className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
              >
                Go to Teacher Dashboard
              </a>
            </div>
          )}

          {/* Pending teacher with subscription */}
          {isPendingTeacher && hasActiveSubscription && (
            <NoticeBoard title="Your teacher account is pending admin approval" type="warning" />
          )}

          {/* Rejected teacher */}
          {user?.status === "rejected" && user?.role === "teacher" && (
            <NoticeBoard title="Your teacher request has been rejected. Please contact support." type="error" />
          )}

          {/* Teacher Profile Form + Plans */}
          {showPlans && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Form */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">1. Teacher Profile</h3>
                <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
                  <div className="flex flex-col items-center mb-4">
                    <img
                      src={user?.photoURL}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-2 border-yellow-400 object-cover"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Experience Level</label>
                    <select
                      {...register("experience", { required: "Experience is required" })}
                      className="select select-bordered w-full bg-zinc-900 border-zinc-700 text-white"
                    >
                      <option value="">Select experience</option>
                      <option value="beginner">Beginner</option>
                      <option value="mid-level">Mid-Level</option>
                      <option value="experienced">Experienced</option>
                    </select>
                    {errors.experience && <p className="text-red-400 text-sm">{errors.experience.message}</p>}
                  </div>

                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Title / Expertise</label>
                    <input
                      type="text"
                      {...register("title", { required: "Title is required" })}
                      placeholder="e.g. MERN Stack Instructor"
                      className="input input-bordered w-full bg-zinc-900 border-zinc-700 text-white placeholder-gray-500"
                    />
                    {errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Category</label>
                    <select
                      {...register("category", { required: "Category is required" })}
                      className="select select-bordered w-full bg-zinc-900 border-zinc-700 text-white"
                    >
                      <option value="">Select category</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="App Development">Mobile App Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="Content Creation">Content Creation</option>
                    </select>
                    {errors.category && <p className="text-red-400 text-sm">{errors.category.message}</p>}
                  </div>

                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Bio (optional)</label>
                    <textarea
                      {...register("bio")}
                      rows={3}
                      placeholder="Tell students about yourself..."
                      className="textarea textarea-bordered w-full bg-zinc-900 border-zinc-700 text-white placeholder-gray-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saveProfileMutation.isPending}
                    className="w-full bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
                  >
                    {saveProfileMutation.isPending ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              </div>

              {/* Subscription Plans */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-2">2. Choose Your Plan</h3>
                <p className="text-gray-400 text-sm mb-6">Subscribe to unlock the teacher platform and start selling courses.</p>

                <div className="space-y-4">
                  {Object.entries(PLANS).map(([key, plan]) => (
                    <div
                      key={key}
                      className={`relative border rounded-xl p-5 transition-all ${
                        plan.popular
                          ? "border-yellow-400 bg-yellow-400/5"
                          : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-3 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                          BEST VALUE
                        </span>
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-bold text-lg">{plan.label}</h4>
                          <p className="text-gray-400 text-sm">{plan.period}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-xl">₦{plan.price.toLocaleString()}</p>
                          {plan.discount > 0 && (
                            <p className="text-green-400 text-sm line-through">₦{plan.originalPrice.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      {plan.discount > 0 && (
                        <p className="text-yellow-400 text-sm mt-2 font-medium">Save ₦{plan.discount.toLocaleString()} (10% off)</p>
                      )}
                      <button
                        onClick={() => onSubscribe(key)}
                        disabled={subscribeMutation.isPending && selectedPlan === key}
                        className={`w-full mt-4 py-2 rounded-lg font-bold transition ${
                          plan.popular
                            ? "bg-yellow-400 text-black hover:bg-yellow-500"
                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                        } disabled:opacity-50`}
                      >
                        {subscribeMutation.isPending && selectedPlan === key ? "Processing..." : "Subscribe Now"}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-zinc-900 border border-zinc-700 rounded-xl p-4">
                  <p className="text-gray-400 text-xs leading-relaxed">
                    By subscribing, you get access to the full teacher dashboard: create courses, upload videos, track student progress, and receive payments directly to your bank account. Cancel anytime before your next billing cycle.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BeTeacher;