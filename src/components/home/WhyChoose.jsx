import { FaCertificate, FaClock, FaUserFriends, FaVideo } from "react-icons/fa";

export default function WhyChoose() {
  return (
    <section className="bg-black py-16 md:py-32 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Why Choose{" "}
          <span className="text-yellow-400">Creators Hub Academy?</span>
        </h2>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
          Thousands of learners trust Creators Hub Academy for its premium
          content, expert mentors, and career‑focused learning tools.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Interactive Video Courses */}
          <Card
            title="Interactive Video Courses"
            description="Engage with high-quality videos, quizzes, and projects that help you apply what you learn."
          >
            <FaVideo className="text-6xl text-yellow-400 mx-auto mb-4" />
          </Card>

          {/* 2. Verified Certificates */}
          <Card
            title="Verified Certificates"
            description="Earn recognized certificates to showcase your new skills and boost your resume."
          >
            <FaCertificate className="text-6xl text-yellow-400 mx-auto mb-4" />
          </Card>

          {/* 3. 1-on-1 Mentor Support */}
          <Card
            title="1-on-1 Mentor Support"
            description="Get personalized feedback and career advice directly from industry experts."
          >
            <FaUserFriends className="text-6xl text-yellow-400 mx-auto mb-4" />
          </Card>

          {/* 4. Learn Anytime */}
          <Card
            title="Learn Anytime"
            description="Access your courses anytime, anywhere — perfect for busy professionals and freelancers."
          >
            <FaClock className="text-6xl text-yellow-400 mx-auto mb-4" />
          </Card>
        </div>
      </div>
    </section>
  );
}

const Card = ({ title, description, children }) => (
  <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl shadow hover:shadow-lg hover:shadow-yellow-400/20 transition">
    {children}
    <h4 className="font-bold text-xl mb-4 text-white">{title}</h4>
    <p className="text-gray-400">{description}</p>
  </div>
);