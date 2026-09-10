const Benefits = () => {
  const studentBenefits = [
    { icon: "🎬", title: "Video + PDF Tracks", description: "Learn from graded YouTube video modules or dedicated PDF handbooks — whichever fits how you learn best." },
    { icon: "⏯️", title: "Resume Exactly Where You Stopped", description: "LastMemory saves your exact video second or handbook page. Come back any time and continue instantly." },
    { icon: "📝", title: "Proctored Exams (60% Pass)", description: "You can only attempt the exam after finishing every module. 60 marks is a pass, and passing unlocks your certificate." },
    { icon: "🛡️", title: "No Skipping / No Distractions", description: "Fast-forwarding is blocked and content stays in-app, so you genuinely complete the training — no shortcuts." },
    { icon: "🏆", title: "Verified Certificates", description: "Earn a shareable, verifiable certificate with a unique ID after passing your course exam." },
    { icon: "🤝", title: "Community Chat & Support", description: "Chat with peers and teachers, send voice notes, or hop on a video call built into your dashboard." },
  ];

  const teacherBenefits = [
    { icon: "💼", title: "Sell Your Own Courses", description: "Upload video or PDF courses, set your own price, and earn 90% of every enrollment via Paystack." },
    { icon: "📅", title: "Subscription With Everything", description: "One monthly subscription = course creation, unlimited chat/voice/video with students, and your earnings dashboard." },
    { icon: "📈", title: "Earnings & Payouts", description: "Track sales, platform fees, and withdraw earnings to your bank — all from your teacher dashboard." },
    { icon: "🎓", title: "Set Exams Per Course", description: "Author multiple-choice exams (60% pass) for each course so graduates are certified properly." },
    { icon: "🚀", title: "Reach Motivated Students", description: "Get discovered in a platform built for Nigerian creators. Students come ready to learn and complete." },
  ];

  return (
    <section className="bg-zinc-950 py-16 md:py-24 px-6 border-y border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Benefits For Everyone
          </p>
          <h2 className="text-4xl font-black text-white mb-4">
            Built For <span className="text-yellow-400">Students & Teachers</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A complete, professional learning management system — whether you're
            here to learn a profitable digital skill or to teach and earn.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Students */}
          <div className="bg-black rounded-3xl border border-zinc-800 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🎓</span>
              <h3 className="text-2xl font-black text-white">For Students</h3>
            </div>
            <ul className="space-y-4">
              {studentBenefits.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span className="text-xl shrink-0 mt-0.5">{b.icon}</span>
                  <div>
                    <p className="text-white font-bold">{b.title}</p>
                    <p className="text-gray-400 text-sm">{b.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Teachers */}
          <div className="bg-black rounded-3xl border border-amber-500/30 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">👨‍🏫</span>
              <h3 className="text-2xl font-black text-white">For Teachers</h3>
            </div>
            <ul className="space-y-4">
              {teacherBenefits.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span className="text-xl shrink-0 mt-0.5">{b.icon}</span>
                  <div>
                    <p className="text-white font-bold">{b.title}</p>
                    <p className="text-gray-400 text-sm">{b.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;