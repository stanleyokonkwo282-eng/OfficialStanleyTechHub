import { Link } from "react-router";
import { motion, useMotionValue, useSpring } from "framer-motion";
import renderStars from "../../utils/renderStars";

export default function CourseCard({ course }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 12);
    rotateY.set(px * 12);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      className="relative p-[1px] rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-lg hover:shadow-amber-400/20 transition-shadow duration-300"
    >
      <div className="relative h-full rounded-2xl course-glass border border-zinc-800 flex flex-col overflow-hidden">
        <div className="overflow-hidden rounded-t-2xl mb-3">
          <img
            src={course.image || course.thumbnail || "/logo.png"}
            alt={course.title}
            loading="lazy"
            decoding="async"
            className="w-full h-48 object-cover group-hover:scale-110 transition duration-500 ease-out"
            onError={(e) => { e.target.src = "/logo.png"; }}
          />
        </div>

        <div className="flex flex-col flex-1 px-4 pb-4">
          <h3 className="text-lg font-bold text-white mb-1 leading-tight line-clamp-2">
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

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
      </div>
    </motion.div>
  );
}
