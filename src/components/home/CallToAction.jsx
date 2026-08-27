// CallToAction.jsx
import { Link } from "react-router";
import { motion } from "framer-motion";
import bgImage from "../../assets/images/c2a.jpg";

export default function CallToAction() {
  return (
    <section
      className="relative bg-cover bg-center py-32 px-6 text-white text-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/70"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-md">
          Ready to Transform Your Learning?
        </h2>

        <p className="mb-8 text-lg md:text-xl text-gray-200 drop-shadow-sm">
          Join thousands leveling up their careers with Creators Hub Academy —
          explore the future of learning.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/courses"
            className="inline-block bg-yellow-400 text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-yellow-500 transition duration-300"
          >
            Browse Courses
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}