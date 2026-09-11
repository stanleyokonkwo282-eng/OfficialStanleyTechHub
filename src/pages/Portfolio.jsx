import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  FaCrown,
  FaLocationDot,
  FaGlobe,
  FaFireFlameCurved,
  FaCode,
  FaVideo,
  FaCalculator,
  FaBuildingShield,
  FaPhone,
  FaWhatsapp,
  FaArrowLeft,
} from "react-icons/fa6";
import HeadTag from "../components/common/HeadTag";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" },
  }),
};

const SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const expertise = [
  {
    icon: FaCode,
    title: "Software & Web Engineering",
    body: "Architecting full-stack digital solutions using modern technologies. Creator of Creators Hub Academy (LMS), utilizing the MERN stack, Next.js, Vite, Tailwind CSS, and cloud deployments on Vercel and Render.",
    tags: ["MERN", "Next.js", "PWA & LTI"],
  },
  {
    icon: FaVideo,
    title: "Multimedia & Broadcast Management",
    body: "Mastery over live streaming architectures using vMix, multi-camera configurations, and pro audio gear (Zoom recorders, Rode Wireless GO II). Expert graphic designer and video editor across Adobe Photoshop, CorelDRAW, and CapCut.",
    tags: ["vMix Live", "Adobe Suite", "Audio Sync"],
  },
  {
    icon: FaCalculator,
    title: "Administration & Financial Accounting",
    body: "Carrying out rigorous administrative duties and financial bookkeeping as an assistant accountant. Proficient in posting records and managing ledgers using Sage 50 software.",
    tags: ["Sage 50", "Bookkeeping", "Operations"],
  },
  {
    icon: FaBuildingShield,
    title: "Enterprise Brands & Partnerships",
    body: "Managing digital branding assets, technical setups, and media strategies for prominent enterprises and faith-based movements including AutoPadi, Colossus Migration & Tours, Christkingdom Ministries, Christars Schools of Music and Ministries, and Christfriend Global Movement (CFG).",
    tags: ["Branding", "Media Strategy", "Ecosystems"],
  },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      <HeadTag title="Stanley Okonkwo | Portfolio & Biography | Creators Hub Academy" />

      {/* Ambient glow background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-900/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Back + WhatsApp row */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-white transition-colors px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40"
          >
            <FaArrowLeft className="text-xs" /> Back to About
          </Link>
          <a
            href="https://wa.me/2348134438808"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-white transition-colors px-4 py-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 hover:border-emerald-400/60"
          >
            <FaWhatsapp /> Chat on WhatsApp
          </a>
        </motion.div>
        {/* Hero */}
        <header className="text-center pb-14 border-b border-indigo-900/40">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/35 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-lg shadow-indigo-950/50 backdrop-blur-md"
          >
            <FaCrown className="text-amber-400" /> Executive &amp; Spiritual Biography
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4"
          >
            Stanley{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-500 animate-pulse">
              Okonkwo
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            style={SERIF}
            className="italic text-xl text-indigo-200/80 max-w-2xl mx-auto mb-8"
          >
            "Bridging cutting-edge technology, multimedia innovation, administrative
            precision, and uncompromising devotion to the Kingdom of God."
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap justify-center gap-4 text-sm text-slate-400"
          >
            <span className="flex items-center gap-2 px-3 py-1 bg-slate-900/60 rounded-lg border border-slate-800">
              <FaLocationDot className="text-indigo-400" /> Lagos State, Nigeria
            </span>
            <span className="flex items-center gap-2 px-3 py-1 bg-slate-900/60 rounded-lg border border-slate-800">
              <FaGlobe className="text-blue-400" /> Multilingual Leader
            </span>
          </motion.div>
        </header>
        {/* Zeal for God & JSP */}
        <section className="py-14 border-b border-indigo-900/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0}
              className="md:col-span-1 text-center md:text-left"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center text-3xl text-white shadow-xl shadow-indigo-900/50 mx-auto md:mx-0 mb-4">
                <FaFireFlameCurved />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Zeal for God &amp; JSP</h2>
              <p className="text-indigo-400 text-sm font-medium">Journey of the Spirit Platform</p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={1}
              className="md:col-span-2 space-y-4 text-slate-300 leading-relaxed text-base"
            >
              <p>
                At the absolute center of Stanley's existence is an unyielding, burning zeal
                for God. This divine passion materializes powerfully through{" "}
                <strong className="text-white font-semibold">Journey of the Spirit (JSP)</strong>,
                a transformative digital ministry where he serves as a Pastor on a WhatsApp
                group that radiates and spreads across all major social media handles.
              </p>
              <p>
                Through inspired teachings, spiritual fortification, and unwavering dedication,
                JSP touches lives far and wide, breaking physical boundaries to bring souls
                closer to the Divine and advance the Kingdom.
              </p>
            </motion.div>
          </div>
        </section>
        {/* Expertise grid */}
        <section className="py-14 border-b border-indigo-900/40">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-3">Multidisciplinary Expertise</h2>
            <p className="text-slate-400 text-sm">
              Seamlessly integrating technical mastery with creative direction, digital
              branding, and financial administration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={i + 1}
                className="p-8 rounded-2xl bg-slate-900/40 border border-indigo-900/30 backdrop-blur-sm hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl mb-6 group-hover:scale-110 transition-transform">
                  <card.icon />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{card.body}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {card.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        {/* Roots & Journey */}
        <section className="py-14 border-b border-indigo-900/40">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Roots &amp; Journey</h2>
            <p className="text-slate-300 leading-relaxed text-base mb-8">
              Based in vibrant <strong className="text-white">Lagos State, Nigeria</strong>,
              Stanley's journey is rooted in continuous self-improvement and entrepreneurial
              grit. Holding a Diploma in Computer Science obtained through dedicated online
              education, he applies a multidisciplinary approach across multiple sectors.
              Fluent in English, Igbo, and Hausa, with foundational proficiency in Yoruba, he
              connects effortlessly with diverse communities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-slate-300 text-sm">
              <a
                href="tel:+2348134438808"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <FaPhone className="text-indigo-400" /> 0813 443 8808
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="tel:+2349044494612"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <FaPhone className="text-indigo-400" /> 0904 449 4612
              </a>
            </div>
          </motion.div>
        </section>

        {/* Signature */}
        <footer className="pt-14 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <p style={SERIF} className="italic text-indigo-400 text-lg mb-2">
              "Driven by Faith. Powered by Code. Dedicated to Purpose."
            </p>
            <p className="text-xs text-slate-500 tracking-wider uppercase">
              Stanley Okonkwo &bull; All Rights Reserved &bull; 2026
            </p>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}