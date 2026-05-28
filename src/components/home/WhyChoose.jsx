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
      icon: "🆓",
      title: "100% Free Access",
      description:
        "All 25 courses are completely free with coupon code CREATOR. No hidden fees, no credit card required. Just learn and grow.",
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
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Why We Are Different
          </p>
          <h2 className="text-4xl font-black text-white mb-4">
            Why Choose{" "}
            <span className="text-yellow-400">Creators Hub Academy?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Built specifically for Nigerian digital creators who want to learn
            profitable skills, earn internationally, and build a future online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/10 transition group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="font-bold text-lg text-white mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
