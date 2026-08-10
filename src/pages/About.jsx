import { FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";

export default function About() {
  const phone = "+234 813 443 8808";
  const waLink = "https://wa.me/2348134438808";

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
                  Stanley Chukwunonso Okonkwo is a visionary technologist, multimedia expert, and lifelong learner who bridges the gap between complex digital tools and human empowerment. With over eight years of cross-industry experience spanning ICT infrastructure, office administration, and financial management, Stanley has cultivated a unique perspective on what it means to lead in the digital age.
                </p>
                <p>
                  He holds a Diploma in Computer Science and has continuously pushed the boundaries of his expertise—from mastering full-stack web development (MERN stack) and database engineering to refining his skills in advanced AI prompt engineering, livestreaming, and professional multimedia production. Yet, for Stanley, technology is never just about code or creative assets; it is a profound tool for service.
                </p>
                <p>
                  Guided by a deep passion for God and a commitment to helping others succeed, Stanley founded the Creators Hub Academy. He believes that digital literacy is a fundamental pillar of modern independence. By demystifying professional tools—like Canva, Photoshop, and AI-driven workflows—he empowers individuals to transform their creative passions into sustainable, monetizable digital careers.
                </p>
                <p>
                  Whether he is architecting robust backend infrastructures for educational platforms or mentoring a new generation of creators, Stanley's mission remains constant: to inspire, teach, and build a future where every learner has the digital fluency to thrive.
                </p>
              </div>

              <div className="mt-10 bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border border-yellow-400/30 rounded-2xl p-8 text-center">
                <p className="text-yellow-400 font-bold text-lg mb-2">Explore the vision in action</p>
                <p className="text-white text-2xl font-black">Creators Hub Academy</p>
                <p className="text-gray-400 text-sm mt-2">Learn · Grow · Create · Build Your Future Together</p>
              </div>
            </div>
          </div>
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
