import { Link } from "react-router";
import { motion } from "framer-motion";
import renderStars from "../../utils/renderStars";

export default function CourseCard({ course }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.02, y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-3 m-2 border border-zinc-800 bg-zinc-950 rounded-xl shadow-md hover:shadow-yellow-400/20 hover:border-zinc-600 transition-all duration-200 flex flex-col"
    >
      <div className="overflow-hidden rounded-lg mb-3">
        <img
          src={course.image || course.thumbnail || "/logo.png"}
          alt={course.title}
          loading="lazy"
          decoding="async"
          className="w-full h-48 object-cover hover:scale-105 transition duration-300 rounded-lg"
          onError={(e) => { e.target.src = "/logo.png"; }}
        />
      </div>

      <div className="flex flex-col flex-1 px-1">
        <h3 className="text-lg font-bold text-white mb-1 leading-tight">
          {course.title}
        </h3>

        <p className="text-sm text-gray-400 mb-1">
          By{" "}
          <span className="font-medium text-gray-300">
            {course.instructor?.[0]?.displayName || "Creators Hub Academy"}
          </span>
        </p>

        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-sm">
            {renderStars(course.rating)}
          </span>
          <span className="text-gray-400 text-xs">
            ({course.rating?.toFixed(1)})
          </span>
        </div>

        <p className="text-gray-400 text-xs mb-3">
          <span className="text-yellow-400 font-semibold">
            {course.totalEnrollments || 0}
          </span>{" "}
          students enrolled
        </p>

        <div className="flex justify-between items-center mt-auto pt-3 border-t border-zinc-800">
          <div>
            <p className="text-green-400 font-bold text-lg">₦5,000</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/courses/${course._id}`}
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition font-semibold text-sm"
            >
              Enroll Now
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
