import { FaChalkboardTeacher, FaGlobe, FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router";

export default function JoinAsTeacher() {
  return (
    <section className="bg-black py-16 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <img
            src="https://i.postimg.cc/6pxqKkV6/Whats-App-Image-2026-05-21-at-5-03-29-PM.jpg"
            alt="Stanley Okonkwo - Founder"
            className="w-full h-auto rounded-xl shadow-md shadow-yellow-400/20 border border-zinc-800"
          />
          <p className="text-center text-gray-400 text-sm mt-3">
            Stanley Okonkwo — Founder, Creators Hub Academy
          </p>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white mb-5">Share Your Knowledge</h2>
          <p className="text-gray-400 mb-5 text-lg text-justify">
            Join thousands of passionate educators empowering the next generation of
            designers, marketers, and creators. Whether you are an expert in tech,
            design, video editing, or freelancing — your knowledge can change lives.
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
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg text-lg font-bold transition duration-200"
          >
            Become a Teacher
          </Link>
        </div>
      </div>
    </section>
  );
}