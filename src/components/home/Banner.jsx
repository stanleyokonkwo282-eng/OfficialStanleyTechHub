import { Link } from "react-router";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

const float = {
  y: [-10, 10, -10],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};

export default function Banner() {
  const students = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
    "https://randomuser.me/api/portraits/men/75.jpg",
  ];

  return (
    <header className="min-h-screen bg-black relative overflow-hidden flex items-center">
      {/* Background gradient blobs */}
      <motion.div animate={float} className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <motion.div animate={float} className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <div>
            {/* Badge */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-400 text-sm font-semibold">
                Nigeria's #1 Digital Skills Academy
              </span>
            </motion.div>

            <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Learn.{" "}
              <span className="text-yellow-400">Create.</span>
              {" "}Lead.
            </motion.h1>

            <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
              Master profitable digital skills — Graphic Design, Video Editing,
              Digital Marketing, AI Tools, and more. Enroll free and earn a
              verified certificate.
            </motion.p>

            {/* Skills tags */}
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap gap-2 mb-8">
              {["Canva", "CapCut", "Photoshop", "Digital Marketing", "AI Tools", "SEO", "Copywriting"].map((skill) => (
                <span
                  key={skill}
                  className="bg-zinc-900 border border-zinc-700 text-gray-300 text-xs px-3 py-1 rounded-full hover:border-yellow-400 hover:text-white transition"
                >
                  {skill}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              <Link
                to="/courses"
                className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition"
              >
                Explore Courses — FREE
              </Link>
              <Link
                to="/about"
                className="bg-zinc-900 border border-zinc-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {students.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="student"
                    className="w-10 h-10 rounded-full border-2 border-yellow-400 object-cover"
                  />
                ))}
              </div>
              <div>
                <p className="text-white font-bold text-lg">3,000+ Students</p>
                <p className="text-gray-400 text-sm">Already enrolled for free</p>
              </div>
            </motion.div>
          </div>

          {/* Right — Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: "🎨", value: "25+", label: "Digital Courses", desc: "All completely FREE" },
              { emoji: "🎓", value: "90+", label: "Video Lessons", desc: "Step-by-step tutorials" },
              { emoji: "📜", value: "₦10K", label: "Certificate", desc: "Verified worldwide" },
              { emoji: "🏆", value: "100%", label: "Free Access", desc: "Use code: CREATOR" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                custom={i + 6}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 transition"
              >
                <div className="text-4xl mb-2">{stat.emoji}</div>
                <p className="text-3xl font-black text-yellow-400">{stat.value}</p>
                <p className="text-white font-semibold">{stat.label}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
