import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

// Create Payment Intent when component mounts or amount changes
const createPaymentIntent = async ({ queryKey }) => {
  const [_id, { amount }] = queryKey;
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/create-payment-intent`,
    { amount }
  );
  return response.data.clientSecret;
};

const StripeCheckoutForm = ({ courseDetails }) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { data: clientSecret } = useQuery({
    enabled: !!courseDetails?.price,
    queryKey: ["stripeAmount", { amount: Number(courseDetails?.price) }],
    queryFn: createPaymentIntent,
  });

  // Save payment info to the server with useMutation
  const savePaymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/enrollments`,
        paymentData
      );
      return response.data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
        },
      }
    );

    if (error) {
      console.log("Payment Error:", error.message);
      toast.error("Payment failed: " + error.message);
    } else {
      const enrollmentData = {
        courseId: courseDetails._id,
        email: user.email,
        price: courseDetails.price,
        paymentId: paymentIntent.id,
        paymentStatus: paymentIntent.status,
        createdAt: new Date().toISOString(),
      };
      // Save payment info to the server
      await savePaymentMutation.mutateAsync(enrollmentData);
      toast.success("Payment successful!");
      navigate("/dashboard/courses");
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#ffffff",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        fontSize: "14px",
        "::placeholder": { color: "#71717a" },
        iconColor: "#fbbf24",
      },
      invalid: { color: "#f87171", iconColor: "#f87171" },
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl backdrop-blur-sm space-y-4"
    >
      <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3 transition focus-within:border-amber-500">
        <CardElement options={cardElementOptions} />
      </div>
      <button
        type="submit"
        disabled={!stripe || !clientSecret || savePaymentMutation.isPending}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-black transition shadow-lg shadow-amber-500/20 active:scale-[0.99]"
      >
        {savePaymentMutation.isPending ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
