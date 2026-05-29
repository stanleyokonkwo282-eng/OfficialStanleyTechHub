import { FaChalkboardTeacher, FaGlobe, FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router";

export default function JoinAsTeacher() {
  return (
    <section className="bg-black py-16 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left - Image */}
        <div>
          <img
            src="https://i.postimg.cc/6pxqKkV6/WhatsApp-Image-2026-05-21-at-5-03-29-PM.jpg"
            alt="Stanley Okonkwo - Founder, Creators Hub Academy"
            className="w-full h-auto rounded-xl shadow-md shadow-yellow-400/20 border border-zinc-800"
          />
        </div>

        {/* Right - Content */}
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Share Your Knowledge
          </h2>
          <p className="text-yellow-400 font-semibold mb-4">
            Stanley Okonkwo — Founder, Creators Hub Academy
          </p>
          <p className="text-gray-400 mb-5 text-lg text-justify">
            Join thousands of passionate educators who are empowering the next
            generation of developers, designers, and freelancers. Whether you're
            an expert in tech, design, or freelancing — your knowledge can
            change lives.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center space-x-4">
              <FaChalkboardTeacher className="text-yellow-400 text-2xl" />
              <span className="text-gray-400">Teach at your own pace</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaMoneyBillWave className="text-yellow-400 text-2xl" />
              <span className="text-gray-400">Earn while you teach</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaGlobe className="text-yellow-400 text-2xl" />
              <span className="text-gray-400">Impact learners worldwide</span>
            </div>
          </div>

          <Link
            to="/become-teacher"
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg text-lg font-medium transition duration-200"
          >
            Become a Teacher
          </Link>
        </div>
      </div>
    </section>
  );
}