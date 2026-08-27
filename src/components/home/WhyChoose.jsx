import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" },
  }),
};

export default function WhyChoose() {
  const features = [
    {
      icon: "🎬",
      title: "YouTube Video Lessons",
      description:
        "Watch high-quality video lessons embedded directly in the platform. Learn at your own pace and resume exactly where you stopped.",
    },
    {
      icon: "📜",
      title: "Verified Certificates",
      description:
        "Complete your course, pass the exam, and earn a certificate verified worldwide for just ₦10,000. Recognized by employers globally.",
    },
    {
      icon: "💳",
      title: "Secure Payments",
      description:
        "Enroll instantly with Paystack. Your payment is protected, and you get immediate access to your chosen course format.",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description:
        "Track your learning progress with lesson completion markers and a visual progress bar. Never lose your place again.",
    },
    {
      icon: "📝",
      title: "Course Exams",
      description:
        "Test your knowledge with 20-question multiple choice exams after completing each course. Pass with 60% to earn your certificate.",
    },
    {
      icon: "📱",
      title: "Learn Anywhere",
      description:
        "Access your courses from any device — phone, tablet, or computer. Learn on your commute, at home, or anywhere you have internet.",
    },
    {
      icon: "🏆",
      title: "Digital Skills Focus",
      description:
        "Every course is designed around profitable, in-demand digital skills that help you earn money online as a Nigerian creator.",
    },
    {
      icon: "🤝",
      title: "Community Support",
      description:
        "Join a community of Nigerian digital creators. Get support, share your work, and grow together with like-minded learners.",
    },
  ];

  return (
    <section className="bg-black py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.p custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Why We Are Different
          </motion.p>
          <motion.h2 custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-4xl font-black text-white mb-4">
            Why Choose{" "}
            <span className="text-yellow-400">Creators Hub Academy?</span>
          </motion.h2>
          <motion.p custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-gray-400 max-w-2xl mx-auto text-lg">
            Built specifically for Nigerian digital creators who want to learn
            profitable skills, earn internationally, and build a future online.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              custom={i + 3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              whileHover={{ scale: 1.04, y: -6 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/10 transition group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h4 className="font-bold text-lg text-white mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
