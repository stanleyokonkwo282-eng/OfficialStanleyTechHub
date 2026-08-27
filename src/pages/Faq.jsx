import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const faqs = [
  {
    question: "How do I create an account on Creators Hub Academy?",
    answer:
      "You can sign up with your email and password, or use Google login. Verify your email and browse our catalog of paid digital skills courses.",
  },
  {
    question: "Are the courses really free?",
    answer:
      "No. All courses require a ₦5,000 enrollment fee via Paystack. A ₦10,000 verification fee only applies if you want a shareable certificate after passing the exam.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We accept Paystack (card, bank transfer, USSD) for course enrollment and certificate verification. No manual bank transfer or screenshot uploads are needed.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Click 'Forgot Password' on the login page, enter your registered email, and follow the reset link sent to your inbox.",
  },
  {
    question: "Are the courses self-paced?",
    answer:
      "Yes, all courses are self-paced. Learn at your own speed, track progress, and resume exactly where you left off across devices.",
  },
  {
    question: "How do I get a certificate?",
    answer:
      "Pass the course exam (minimum 60%), pay the ₦10,000 verification fee via Paystack or bank transfer, and our team will issue your verifiable certificate within 24–48 hours.",
  },
  {
    question: "How can I become a teacher on the platform?",
    answer:
      "Go to 'Teach on Creators Hub' in the dashboard, fill in your experience, title, and category, then submit your request. An admin will review and approve it.",
  },
  {
    question: "Can I edit my profile?",
    answer:
      "Yes. Go to Dashboard → My Profile → Edit Profile to update your name, phone number, and profile picture URL.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Chat us on WhatsApp at +234 813 443 8808 or email support@creatorshubacademy.com. We typically respond within a few hours.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. We use Firebase Authentication for secure login and MongoDB for encrypted data storage. Your personal information is never shared with third parties.",
  },
  {
    question: "How do I track my learning progress?",
    answer:
      "Your dashboard shows enrolled courses, completed lessons, exam attempts, and certificate status automatically as you learn.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 text-white">
          Frequently{" "}
          <span className="underline underline-offset-8 decoration-yellow-400 decoration-4">
            Asked
          </span>{" "}
          Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-zinc-950 border border-zinc-800 rounded-lg"
            >
              <button
                onClick={() => toggleAnswer(index)}
                className="w-full text-left px-5 py-4 flex justify-between items-center"
              >
                <span className="text-lg font-medium text-white">
                  {faq.question}
                </span>
                <span className="text-yellow-400">
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 text-gray-400">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}