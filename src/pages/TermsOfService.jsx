import HeadTag from "../components/common/HeadTag";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <HeadTag title="Terms of Service | Creators Hub Academy" />
        <h1 className="text-4xl font-black text-white mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: August 2026</p>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Creators Hub Academy, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">2. Operator</h2>
            <p>
              Creators Hub Academy is operated by Stanley Chukwunonso Okonkwo, Lagos, Nigeria. For support, contact support@creatorshubacademy.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">3. Course Enrollment & Payments</h2>
            <p>
              All courses are subject to a ₦5,000 enrollment fee unless otherwise stated. Payments are processed securely through Paystack. Access to course materials is granted only after successful payment confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">4. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">5. Intellectual Property</h2>
            <p>
              All course content, including videos, PDFs, and materials, is the property of Creators Hub Academy or its licensors. You may access content for personal, non-commercial use only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">6. Termination</h2>
            <p>
              We may suspend or terminate your access if you violate these terms or engage in conduct that is harmful to other users or the platform. Where possible, we will provide notice before taking such action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">7. Governing Law & Disputes</h2>
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved through good-faith negotiation, and if necessary, through the courts of Lagos, Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">8. Refunds</h2>
            <p>
              Refunds are handled in accordance with our Refund Policy. Please review that policy before purchasing any course.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">9. Contact</h2>
            <p>
              For questions about these terms, contact us at support@creatorshubacademy.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
