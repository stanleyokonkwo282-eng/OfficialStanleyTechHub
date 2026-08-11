import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" },
  }),
};

export default function TrustedClients() {
  const skills = [
    { icon: "🎨", name: "Graphic Design" },
    { icon: "🎬", name: "Video Editing" },
    { icon: "📱", name: "Social Media" },
    { icon: "🤖", name: "AI Tools" },
    { icon: "💻", name: "Web Design" },
    { icon: "📈", name: "Digital Marketing" },
    { icon: "✍️", name: "Copywriting" },
    { icon: "📧", name: "Email Marketing" },
    { icon: "🛒", name: "E-Commerce" },
    { icon: "🎙️", name: "Podcasting" },
  ];

  return (
    <section className="bg-zinc-950 border-y border-zinc-800 py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-6">
        <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold">
          Skills You Will Master at Creators Hub Academy
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 px-6">
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            whileHover={{ scale: 1.08, y: -3 }}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-2 hover:border-yellow-400 hover:bg-zinc-800 transition"
          >
            <span className="text-xl">{skill.icon}</span>
            <span className="text-white font-medium text-sm">{skill.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
