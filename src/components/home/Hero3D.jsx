import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import heroImage from "../../assets/images/banner.jpg";

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
    <div className="relative min-h-screen overflow-hidden bg-[#030b17] text-white">
      <CursorSpotlight />

      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(800px circle at 72% 28%, rgba(255,199,0,0.18), transparent 56%), linear-gradient(120deg, rgba(2,6,23,0.85) 0%, rgba(3,11,23,0.72) 40%, rgba(2,6,23,0.92) 100%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030b17] to-transparent" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-12 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-amber-400/30 bg-white/5 px-4 py-2 backdrop-blur-md"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(253,224,71,0.8)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">
            Creative learning for modern careers
          </span>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-8 lg:col-span-7">
            <h1 className="select-none text-5xl font-black leading-[0.96] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[5.4rem]">
              {headline.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.35, 1] }}
                  className="inline-block"
                >
                  {word === "Create." || word === "Lead." ? (
                    <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                      {word}&nbsp;
                    </span>
                  ) : (
                    <>{word}&nbsp;</>
                  )}
                </motion.span>
              ))}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Master profitable digital skills — Graphic Design, Video Editing,
              Digital Marketing, AI Tools, and more. Enroll for ₦5,000 and earn a
              verified certificate with a unique ID.
            </p>

            <div className="flex max-w-xl flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="cursor-default rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/50 hover:text-white"
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
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-8 py-4 text-lg font-black text-slate-950 shadow-[0_22px_50px_rgba(250,204,21,0.32)] transition-shadow hover:shadow-[0_26px_60px_rgba(250,204,21,0.42)]"
              >
                <span className="relative z-10">Explore Courses</span>
                <span className="relative z-10 ml-2 transition-transform group-hover:translate-x-1">→</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/about")}
                className="relative overflow-hidden rounded-xl border border-white/15 bg-[#0b1522]/70 px-8 py-4 font-semibold text-slate-200 transition-all hover:border-amber-400/60 hover:text-white"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all" />
                <span className="relative z-10">Learn More</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-4 pt-3">
              <div className="flex -space-x-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#030b17] text-sm font-black text-white shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #1a6b1a 0%, #008000 50%, #1a6b1a 100%)",
                    }}
                  >
                    {['C', 'E', 'F', 'O'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-lg font-bold text-white">3,000+ Students</p>
                <p className="text-sm text-slate-400">Students learning daily</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-[2rem] border border-white/10 bg-[#071321]/80 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            >
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10">
                <img
                  src={heroImage}
                  alt="Students learning creative skills"
                  className="h-[420px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071321] via-[#071321]/15 to-transparent" />

                <div className="absolute left-5 top-5 rounded-full border border-amber-300/30 bg-[#091827]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200 backdrop-blur-sm">
                  Since 2021
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="rounded-2xl border border-white/10 bg-[#091827]/80 p-4 shadow-lg backdrop-blur-md">
                    <p className="text-amber-300">Creative careers. Real results.</p>
                    <div className="mt-2 flex items-center justify-between gap-6">
                      <div>
                        <p className="text-2xl font-black tracking-tight text-white">12k+</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Skill hours</p>
                      </div>
                      <div className="h-12 w-px bg-white/10" />
                      <div>
                        <p className="text-2xl font-black tracking-tight text-white">94%</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-black text-amber-300">25+</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Courses</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-black text-amber-300">90+</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Lessons</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-black text-amber-300">₦5k</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Enrollment</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3" style={{ perspective: "1200px" }}>
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
  );
}
