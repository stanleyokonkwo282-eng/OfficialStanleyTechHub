import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import HeroScene3D from "./HeroScene3D";

const AMBER = "#FFC700";
const skills = [
  "Canva", "CapCut", "Photoshop", "Digital Marketing",
  "AI Tools", "SEO", "Copywriting",
];

const metrics = [
  { icon: "🎓", value: "25+", label: "Digital Courses", sub: "Video & PDF formats", hero: true, span: "sm:col-span-2" },
  { icon: "🎬", value: "90+", label: "Video Lessons", sub: "Step-by-step tutorials", span: "" },
  { icon: "📜", value: "₦10,000", label: "Certificate", sub: "Unique verification ID", span: "" },
  { icon: "🏆", value: "₦5,000", label: "Enrollment", sub: "Instant access via Paystack", span: "sm:col-span-2 sm:col-start-2" },
];

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let frame = 0;
    let latest = { x: 0, y: 0 };
    const onMove = (e) => {
      latest = { x: e.clientX, y: e.clientY };
      if (!frame) {
        frame = requestAnimationFrame(() => {
          setPos(latest);
          frame = 0;
        });
      }
    };
    const onLeave = () => {
      latest = { x: 0, y: 0 };
      setPos({ x: 0, y: 0 });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return pos;
}

const CursorSpotlight = () => {
  const { x, y } = useMousePosition();
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `radial-gradient(680px circle at ${x}px ${y}px, rgba(255,199,0,0.08), transparent 60%)`,
      }}
    />
  );
};

const TiltCard = ({ icon, value, label, sub, hero, span, delay = 0 }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glare, setGlare] = useState({ x: 0, y: 0, show: false });

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 14, ry: px * 14 });
    setGlare({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      show: true,
    });
  };

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setGlare({ x: 0, y: 0, show: false });
  };

  const transform = `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${hero ? 28 : 18}px) scale(${hero ? 1.03 : 1.015})`;

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.35, 1] }}
        className={`${span} h-full`}
      >
        <div
          ref={cardRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ transform, transformStyle: "preserve-3d" }}
          className={`
            group relative flex flex-col justify-between
            ${hero ? "p-8 ring-1 ring-amber-400/15" : "p-6"}
            bg-[#0A0A0A]/80 backdrop-blur-md border border-[#1F1F1F] rounded-[1.25rem]
            hover:border-amber-400/40
            hover:shadow-[0_25px_60px_rgba(255,199,0,0.1)]
            transition-[border-color_0.3s_cubic-bezier(0.22,1,0.35,1),box-shadow_0.3s_cubic-bezier(0.22,1,0.35,1)]
          `}
        >
          <div style={{ transform: "translateZ(40px)" }} className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/25">
              <span className="text-3xl">{icon}</span>
            </div>
          </div>

          <div style={{ transform: "translateZ(30px)" }}>
            <h3 className={`font-black ${hero ? "text-5xl" : "text-3xl"} text-[#FFC700] tracking-tight`}>
              {value}
            </h3>
            <p className="mt-1 text-neutral-200 font-semibold text-base">{label}</p>
            <p className="text-neutral-500 text-sm font-medium">{sub}</p>
          </div>

          <div
            aria-hidden
            className={`absolute -inset-px rounded-[1.25rem] pointer-events-none overflow-hidden ${
              glare.show ? "opacity-100" : "opacity-0"
            } transition-opacity`}
          >
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] bg-white/25 blur-[3px] rounded-full"
              style={{ left: `${glare.x}%`, top: `${glare.y}%` }}
            />
          </div>
        </div>
      </motion.div>
  );
};

export default function Hero3D() {
  const headline = "Learn. Create. Lead.".split(" ");
  const navigate = useNavigate();
  const handlePrimaryClick = () => navigate("/courses");

  return (
    <div className="relative min-h-screen bg-[#000000] text-white overflow-hidden">
      <CursorSpotlight />
      <div className="absolute inset-0 z-0">
        <HeroScene3D />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.02] select-none">
              {headline.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.35, 1] }}
                  className="inline-block"
                >
                  {word === "Create." || word === "Lead." ? (
                    <span className="text-[#FFC700]">{word}&nbsp;</span>
                  ) : (
                    <>{word}&nbsp;</>
                  )}
                </motion.span>
              ))}
            </h1>

            <p className="text-neutral-300 text-lg md:text-xl max-w-xl leading-relaxed">
              Master profitable digital skills — Graphic Design, Video Editing,
              Digital Marketing, AI Tools, and more. Enroll for ₦5,000 and earn a
              verified certificate with a unique ID.
            </p>

            <div className="flex flex-wrap gap-2 max-w-xl">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 text-xs font-semibold bg-[#0A0A0A]/80 backdrop-blur border border-[#1F1F1F] text-neutral-400 rounded-full cursor-default hover:border-amber-400/40 hover:text-neutral-100 transition-all duration-300 hover:scale-[1.03]"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrimaryClick}
                className="group relative overflow-hidden bg-[#FFC700] text-black text-lg font-black px-8 py-4 rounded-xl flex items-center gap-3 hover:shadow-[0_0_35px_rgba(255,199,0,0.35)] transition-shadow"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                <span className="relative z-10">Explore Courses</span>
                <span className="relative z-10 group-hover:translate-x-0.5 transition-transform">→</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/about")}
                className="relative overflow-hidden border border-[#1F1F1F] hover:border-amber-400/40 text-neutral-200 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all bg-[#0A0A0A]/60 backdrop-blur"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 hover:via-white/5 to-transparent transition-all" />
                Learn More
              </motion.button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center text-white font-black text-sm"
                    style={{
                      background: "linear-gradient(135deg, #1a6b1a 0%, #008000 50%, #1a6b1a 100%)",
                    }}
                  >
                    {["C", "E", "F", "O"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-bold text-lg">3,000+ Students</p>
                <p className="text-neutral-500 text-sm">Students learning daily</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch"
              style={{ perspective: "1200px" }}
            >
              {metrics.map((m, i) => (
                <TiltCard
                  key={m.label}
                  icon={m.icon}
                  value={m.value}
                  label={m.label}
                  sub={m.sub}
                  hero={m.hero}
                  span={m.span}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
