import { FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { trackLinkView, trackLinkClick } from "../utils/linkTracker";

export default function About() {
  const phone = "+234 813 443 8808";
  const waLink = "https://wa.me/2348134438808";
  const portfolioLink = "https://github.com/stanleyokonkwo282-eng";

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.65, ease: "easeOut" },
    }),
  };

  const portfolioRef = useRef(null);

  useEffect(() => {
    const node = portfolioRef.current;
    if (!node) return;
    let fired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !fired) {
            fired = true;
            trackLinkView({ source: "about_page" });
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handlePortfolioClick = () => {
    trackLinkClick({ source: "about_page_button" });
    toast.success(
      "👋 Welcome! Thanks for stopping by — your visit is recorded. " +
        "Explore the portfolio and get in touch!",
      { autoClose: 6000, position: "top-right" }
    );
  };


  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 md:py-32 px-6 text-center border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            About Us
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Empowering the Next Generation of{" "}
            <span className="text-yellow-400">Digital Creators</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Creators Hub Academy is a free, world-class digital skills platform built
            to transform lives through practical education, verified credentials, and
            real-world opportunity.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="max-w-6xl mx-auto px-6 md:py-20">
        <div className="md:flex md:items-center md:gap-16">
          <div className="md:w-1/2">
            <div className="relative">
              <img
                src="https://i.postimg.cc/MKkVCDNJ/762719758-5443054415919655-4524288621991209147-n-(1).jpg"
                alt="Stanley Okonkwo - Founder"
                className="rounded-2xl shadow-2xl shadow-yellow-400/10 border border-zinc-800 w-full object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-black px-5 py-2 rounded-xl font-bold text-sm shadow-lg">
                Founder & CEO
              </div>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
              Who We Are
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Built by Creators, for Creators
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Creators Hub Academy is a forward-thinking online learning platform
              designed for creators of all backgrounds. We are a team of passionate
              educators, developers, and content specialists committed to bridging
              the gap between knowledge and practical digital skills.
            </p>
            <p className="text-gray-300 leading-relaxed">
              With years of experience in both traditional education and modern
              content creation, our team ensures every course delivers real-world
              value and interactive engagement.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-zinc-950 py-20 px-6 border-t border-b border-zinc-800">
        <div className="max-w-6xl mx-auto md:flex md:items-center md:gap-16">
          <div className="md:w-1/2">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              A Complete Learning Ecosystem
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              We offer a comprehensive learning ecosystem where students, teachers,
              and administrators seamlessly interact. From enrolling in courses to
              tracking progress, submitting assignments, and receiving certificates,
              everything is designed to enhance your learning journey.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our platform supports interactive classes, assignments, quizzes, and
              feedback mechanisms so learners actively engage with every lesson.
            </p>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
              alt="Learning"
              className="rounded-2xl shadow-2xl shadow-yellow-400/10 border border-zinc-800 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Start Learning in 3 Steps
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow hover:shadow-yellow-400/20 transition text-center">
            <div className="w-12 h-12 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold text-xl mb-3 text-yellow-400">
              Sign Up and Explore
            </h3>
            <p className="text-gray-300">
              Create your free account and browse courses in graphic design, AI
              tools, content creation, video editing, and more.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow hover:shadow-yellow-400/20 transition text-center">
            <div className="w-12 h-12 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold text-xl mb-3 text-yellow-400">
              Enroll and Learn
            </h3>
            <p className="text-gray-300">
              Use coupon code{" "}
              <span className="text-yellow-400 font-bold">CREATOR</span> to enroll
              in any course for FREE. Watch lessons, track your progress, and resume
              exactly where you stopped.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow hover:shadow-yellow-400/20 transition text-center">
            <div className="w-12 h-12 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold text-xl mb-3 text-yellow-400">
              Get Certified and Grow
            </h3>
            <p className="text-gray-300">
              Complete a course and earn a verified certificate recognised worldwide
              for just 10,000 Naira. Add it to your CV and LinkedIn with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* About the Founder */}
      <section className="bg-zinc-950 py-20 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
              About the Founder
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stanley Chukwunonso Okonkwo
            </h2>
            <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full" />
          </div>

          <div className="md:flex md:items-start md:gap-16">
            <div className="md:w-1/3 mb-10 md:mb-0">
              <img
                src="https://i.postimg.cc/MKkVCDNJ/762719758-5443054415919655-4524288621991209147-n-(1).jpg"
                alt="Stanley Chukwunonso Okonkwo"
                className="rounded-2xl shadow-2xl shadow-yellow-400/10 border border-zinc-800 w-full object-cover"
              />
              <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-2">Connect</h3>
                <div className="space-y-3 text-gray-300 text-sm">
                  <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition">
                    <FaPhone className="text-yellow-400" /> {phone}
                  </a>
                  <a href="mailto:hello@creatorshubacademy.com" className="flex items-center gap-2 hover:text-yellow-400 transition">
                    <FaEnvelope className="text-yellow-400" /> hello@creatorshubacademy.com
                  </a>
                </div>
                <div className="flex gap-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-xl"><FaLinkedin /></a>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-xl"><FaTwitter /></a>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-xl"><FaInstagram /></a>
                </div>
              </div>
            </div>

             <div className="md:w-2/3">
               <div className="space-y-6 text-gray-300 leading-relaxed">
                 <p className="text-lg text-white font-medium">
                   Stanley Chukwunonso Okonkwo is a dynamic technologist, ICT Specialist, and Multimedia Expert whose work is defined by the intersection of high-level digital engineering and a commitment to human development. With over eight years of experience managing complex IT infrastructures, financial systems, and multimedia workflows, Stanley has cultivated the technical acumen required to lead in a fast-evolving digital economy.
                 </p>
                 <p>
                   Guided by his faith and a deep-seated desire to uplift others, Stanley founded the{" "}
                   <a
                     href="https://creators-hub-academy.vercel.app"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-yellow-400 hover:text-yellow-300 font-semibold transition"
                   >
                     Creators Hub Academy
                   </a>
                   . He engineered the platform's full-stack MERN architecture from the ground up — integrating secure payment gateways (Paystack), automated certificate verification systems, and AI-powered tutors (Google Gemini) to provide students with a modern, frictionless learning environment serving thousands across Nigeria.
                 </p>
                 <p>
                   Whether he is producing high-quality multimedia event coverage, managing corporate ICT systems, or mentoring students in digital skills, Stanley's mission remains constant: to empower individuals with the tools they need to secure their future in the digital age.
                 </p>
               </div>

               {/* Academic Foundation & Certifications */}
               <div className="mt-12">
                 <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-4">
                   Academic Foundation & Certifications
                 </p>
                 <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-300 leading-relaxed space-y-1">
                   <p className="sm:col-span-2">
                     <span className="text-white font-medium">Diploma in Computer Science</span> — foundational academic grounding in software engineering and systems design.
                   </p>
                   <p>
                     <span className="text-white font-medium">Executive Diploma in AI</span> — leveraging cutting-edge machine learning and prompt engineering to optimize workflows.
                   </p>
                   <p>
                     <span className="text-white font-medium">Sage 50 Accounting</span> — ensuring high-level competence in financial administration and record-keeping.
                   </p>
                   <p>
                     <span className="text-white font-medium">Modern Beekeeping (Apiculture)</span> — sustainable agricultural practices and skill diversification.
                   </p>
                 </div>
               </div>

               {/* Key Competencies */}
               <div className="mt-12">
                 <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-5">
                   Key Competencies
                 </p>
                 <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 text-sm">
                   <div>
                     <p className="text-white font-medium mb-1.5">Web Development</p>
                     <p className="text-gray-400">React · Node.js · Express · MongoDB · Firebase · Vite · Docker · PostgreSQL</p>
                   </div>
                   <div>
                     <p className="text-white font-medium mb-1.5">Multimedia & Design</p>
                     <p className="text-gray-400">Adobe Photoshop · Canva (Expert) · vMix (Livestreaming) · CapCut · CorelDRAW · Shotcut</p>
                   </div>
                   <div>
                     <p className="text-white font-medium mb-1.5">Administration & Finance</p>
                     <p className="text-gray-400">ICT Infrastructure Management · Sage 50 · Office Administration · Budgeting</p>
                   </div>
                   <div>
                     <p className="text-white font-medium mb-1.5">Languages</p>
                     <p className="text-gray-400">Fluent in English, Hausa, and Igbo</p>
                   </div>
                 </div>
               </div>

               <div className="mt-10 bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border border-yellow-400/30 rounded-2xl p-8 text-center">
                 <p className="text-yellow-400 font-bold text-lg mb-2">Explore the vision in action</p>
                 <a
                   href="https://creators-hub-academy.vercel.app"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-white text-2xl font-black hover:text-yellow-300 transition"
                 >
                   Creators Hub Academy
                 </a>
                 <p className="text-gray-400 text-sm mt-2">Learn · Grow · Create · Build Your Future Together</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section ref={portfolioRef} className="relative overflow-hidden py-20 md:py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-400/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.p
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="text-yellow-400 text-sm font-semibold uppercase tracking-[0.25em] mb-4"
          >
            Portfolio
          </motion.p>

          <motion.h2
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-black text-white mb-6"
          >
            Crafting Digital Experiences <span className="text-yellow-400">That Matter</span>
          </motion.h2>

          <motion.p
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl mb-10"
          >
            From self-hosted learning infrastructure to AI-powered tools, every project
            is built with the belief that great technology should be both powerful and
            accessible to everyone.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12"
          >
            {[
              { label: "23+ Free Courses Built", value: "🎓" },
              { label: "Production Deployments", value: "🚀" },
              { label: "Self-Hosted Platform", value: "🛠️" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.08, y: -4 }}
                className="bg-zinc-950 border border-zinc-800 hover:border-yellow-400/40 rounded-xl px-5 py-3 flex items-center gap-3 transition-colors"
              >
                <span className="text-xl">{stat.value}</span>
                <span className="text-sm text-gray-300 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <motion.a
              href={portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 40px rgba(242,193,76,0.45)",
                transition: { duration: 0.25 },
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePortfolioClick}
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-extrabold text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-yellow-400/25 overflow-hidden"
            >
              <FaGithub className="text-xl relative z-10" />
              <span className="relative z-10">View My Portfolio</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -inset-1 bg-yellow-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.a>

            <motion.a
              href="mailto:hello@creatorshubacademy.com"
              whileHover={{ y: -3 }}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm font-medium"
            >
              <FaEnvelope className="text-yellow-400" />
              hello@creatorshubacademy.com
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-black py-20 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Contact Us
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            Have questions, partnership ideas, or need support? Reach out directly to Stanley Okonkwo, Founder of Creators Hub Academy.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 transition">
              <FaPhone className="text-yellow-400 text-2xl mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">WhatsApp</p>
              <a href={waLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-yellow-400 transition text-sm">
                {phone}
              </a>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 transition">
              <FaEnvelope className="text-yellow-400 text-2xl mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">Email</p>
              <a href="mailto:hello@creatorshubacademy.com" className="text-gray-400 hover:text-yellow-400 transition text-sm">
                hello@creatorshubacademy.com
              </a>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 transition">
              <FaLinkedin className="text-yellow-400 text-2xl mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">Social</p>
              <p className="text-gray-400 text-sm">Follow for updates</p>
            </div>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-yellow-400/20"
          >
            Chat with the Founder
          </a>
        </div>
      </section>
    </div>
  );
}
