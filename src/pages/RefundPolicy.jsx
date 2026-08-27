import HeadTag from "../components/common/HeadTag";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <HeadTag title="Refund Policy | Creators Hub Academy" />
        <h1 className="text-4xl font-black text-white mb-4">Refund Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: August 2026</p>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">1. Overview</h2>
            <p>
              We want you to be satisfied with your purchase. If you are not happy with a course, we offer refunds under the conditions outlined below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">2. Refund Eligibility</h2>
            <p>
              Refund requests must be submitted within 7 days of purchase. To qualify, you must not have completed more than 20% of the course content. Requests are reviewed on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">3. Non-Refundable Items</h2>
            <p>
              Once a certificate has been issued or course completion has been recorded, the enrollment fee is non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">4. How to Request a Refund</h2>
            <p>
              Contact our support team at support@creatorhubacademy.com with your order details and the reason for your request. We aim to respond within 3 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">5. Processing</h2>
            <p>
              Approved refunds are processed back to the original payment method within 7–10 business days, depending on your bank or payment provider.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
