import HeadTag from "../components/common/HeadTag";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <HeadTag title="Privacy Policy | Creators Hub Academy" />
        <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: August 2026</p>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">1. Data Controller</h2>
            <p>
              Creators Hub Academy is operated by Stanley Chukwunonso Okonkwo, based in Lagos, Nigeria. For data protection enquiries, contact support@creatorshubacademy.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">2. Information We Collect</h2>
            <p>
              We collect information you provide directly, such as your name, email address, phone number, and payment details when you create an account or enroll in a course. We also collect usage data to improve the platform experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">3. How We Use Your Information</h2>
            <p>
              Your information is used to provide course access, process payments, send important updates, and improve our services. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">5. Cookies</h2>
            <p>
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can disable cookies in your browser settings, though some features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">6. Your Rights</h2>
            <p>
              You have the right to access, correct, or request deletion of your personal data. Contact us at support@creatorshubacademy.com for any privacy-related requests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">7. Governing Law</h2>
            <p>
              This policy is governed by the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts in Lagos, Nigeria.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
