import teamImage from "../assets/images/banner.jpg";
import learningImage from "../assets/images/c2a.jpg";

export default function About() {
  return (
    <div className="space-y-20 bg-black">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-32 px-6 text-center border-b border-zinc-800">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          About{" "}
          <span className="text-yellow-400">Creators Hub Academy</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
          Empowering creators worldwide to master digital skills with flexible,
          interactive, and high-quality online courses. Creators Hub Academy is
          your trusted platform to learn, create, and lead.
        </p>
      </section>

      {/* Who We Are */}
      <section className="max-w-6xl mx-auto px-6 md:flex md:items-center md:gap-12">
        <div className="md:w-1/2">
          <img
            src={teamImage}
            alt="Our Team"
            className="rounded-lg shadow-lg w-full border border-zinc-800"
          />
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">Who We Are</h2>
          <p className="text-gray-300 mb-4">
            Creators Hub Academy is a forward-thinking online learning platform
            designed for creators of all backgrounds. We are a team of passionate
            educators, developers, and content specialists committed to bridging
            the gap between knowledge and practical digital skills.
          </p>
          <p className="text-gray-300">
            With years of experience in both traditional education and modern
            content creation, our team ensures that every course is carefully
            crafted to deliver real-world value, personalized learning
            experiences, and interactive engagement.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-zinc-950 py-16 px-6 border-t border-b border-zinc-800">
        <div className="max-w-6xl mx-auto text-center md:text-left md:flex md:gap-12 md:items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">What We Do</h2>
            <p className="text-gray-300 mb-4">
              At Creators Hub Academy, we offer a comprehensive learning
              ecosystem where students, teachers, and administrators can
              seamlessly interact. From enrolling in courses to tracking
              progress, submitting assignments, and receiving certificates,
              everything is designed to enhance the learning journey.
            </p>
            <p className="text-gray-300">
              Our platform supports interactive classes, assignments, quizzes,
              and feedback mechanisms, ensuring learners not only consume
              content but actively engage with it.
            </p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src={learningImage}
              alt="Learning"
              className="rounded-lg shadow-lg w-full border border-zinc-800"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-yellow-400 text-center">
          How Creators Hub Academy Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg shadow hover:shadow-yellow-400/20 transition">
            <h3 className="font-semibold text-xl mb-2 text-yellow-400">Sign Up & Explore</h3>
            <p className="text-gray-300">
              Create your free account and browse a wide range of courses in
              graphic design, AI tools, content creation, video editing, and more.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg shadow hover:shadow-yellow-400/20 transition">
            <h3 className="font-semibold text-xl mb-2 text-yellow-400">Enroll & Learn</h3>
            <p className="text-gray-300">
              Use coupon code <span className="text-yellow-400 font-bold">CREATOR</span> to
              enroll in any course for FREE. Watch lessons, track your progress,
              and resume exactly where you stopped.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg shadow hover:shadow-yellow-400/20 transition">
            <h3 className="font-semibold text-xl mb-2 text-yellow-400">Get Certified & Grow</h3>
            <p className="text-gray-300">
              Complete a course and earn a verified certificate recognised
              worldwide for just ₦10,000. Add it to your CV and LinkedIn
              with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-zinc-900 py-16 px-6 text-white border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center md:flex md:items-center md:gap-12">
          <div className="md:w-1/2">
            <img
              src="https://i.postimg.cc/6pxqKkV6/WhatsApp-Image-2026-05-21-at-5-03-29-PM.jpg"
              alt="Stanley Okonkwo - Founder"
              className="rounded-lg shadow-lg w-full border border-zinc-700"
            />
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 text-left">
            <h2 className="text-3xl font-bold mb-2 text-yellow-400">Contact Us</h2>
            <p className="text-yellow-300 font-semibold mb-4">
              Stanley Okonkwo — Founder, Creators Hub Academy
            </p>
            <p className="text-gray-300 mb-4">
              Have questions, feedback, or need help? We'd love to hear from you!
              Reach out through any of the channels below:
            </p>
            <ul className="text-gray-300 space-y-3">
              <li>
                📱 <span className="text-white font-medium">WhatsApp:</span>{" "}
                
                  href="https://wa.me/2348134438808"
                  target="_blank"
                  rel="noreferrer"
                  className="text-yellow-400 hover:underline"
                >
                  +234 813 443 8808
                </a>
              </li>
              <li>
                🏦 <span className="text-white font-medium">Opay:</span> 8134438808 — Nonso Stanley Okonkwo
              </li>
              <li>
                🏦 <span className="text-white font-medium">Polaris Bank:</span> 3046748449 — Nonso Stanley Okonkwo
              </li>
              <li>
                🕐 <span className="text-white font-medium">Support Hours:</span> 9AM – 6PM (WAT)
              </li>
            </ul>
            
              href="https://wa.me/2348134438808"
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-6 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}