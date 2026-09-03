import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Volume2,
  VolumeX,
} from "lucide-react";
import confetti from "canvas-confetti";

const scenes = [
  {
    id: 1,
    title: "THE CHASE BEGINS",
    subtitle: "Tom spots Jerry sneaking around!",
    jerryAction: "Sprinting across the wooden floor",
    tomAction: "Looming large in fast pursuit",
    bgColor: "from-amber-950/40 via-black to-zinc-950",
    accentColor: "from-amber-400 to-amber-600",
  },
  {
    id: 2,
    title: "FINDING A HIDING PLACE",
    subtitle: "A quick slip behind the living room couch.",
    jerryAction: "Peeking nervously around the corner",
    tomAction: "Reaching blindly with big paws",
    bgColor: "from-blue-950/40 via-black to-zinc-950",
    accentColor: "from-amber-400 to-amber-600",
  },
  {
    id: 3,
    title: "SETTLING DOWN",
    subtitle: "Safe for now! Time for a good story.",
    jerryAction: "Opening 'Cheese Tales' on the floor",
    tomAction: "Looking confused in the background",
    bgColor: "from-emerald-950/40 via-black to-zinc-950",
    accentColor: "from-amber-400 to-amber-600",
  },
  {
    id: 4,
    title: "LOST IN A BOOK",
    subtitle: "Even Tom stops to enjoy the quiet moment.",
    jerryAction: "Laughing out loud while reading",
    tomAction: "Peeking over with a smile",
    bgColor: "from-purple-950/40 via-black to-zinc-950",
    accentColor: "from-amber-400 to-amber-600",
  },
];

function JerrySvg({ action }) {
  const running = action === "sprinting" || action === "sneaking";
  const reading = action === "reading" || action === "laughing";
  const hiding = action === "peeking";

  return (
    <motion.svg
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      style={{ overflow: "visible", filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.5))" }}
      animate={
        running
          ? { y: [0, -6, 0] }
          : reading
            ? { y: [0, -1, 0] }
            : hiding
              ? { x: [0, -3, 0, 3, 0] }
              : { y: 0 }
      }
      transition={
        running
          ? { duration: 0.32, repeat: Infinity, ease: "easeInOut" }
          : reading
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : hiding
              ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.4 }
      }
    >
      <defs>
        <radialGradient id="jerryBody1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#E8B57A" />
          <stop offset="100%" stopColor="#B8843A" />
        </radialGradient>
        <radialGradient id="jerryBelly1" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFF3D6" />
          <stop offset="100%" stopColor="#E8C58A" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="80" rx="32" ry="26" fill="url(#jerryBody1)" stroke="#7A5520" strokeWidth="1.2" />
      <ellipse cx="60" cy="85" rx="22" ry="18" fill="url(#jerryBelly1)" stroke="#B8843A" strokeWidth="0.8" />
      <ellipse cx="60" cy="40" rx="26" ry="24" fill="url(#jerryBody1)" stroke="#7A5520" strokeWidth="1.2" />
      <ellipse cx="40" cy="22" rx="11" ry="14" fill="#C28A3E" stroke="#7A5520" strokeWidth="1.2" />
      <ellipse cx="40" cy="20" rx="6" ry="8" fill="#FFB6D5" opacity="0.5" />
      <ellipse cx="80" cy="22" rx="11" ry="14" fill="#C28A3E" stroke="#7A5520" strokeWidth="1.2" />
      <ellipse cx="80" cy="20" rx="6" ry="8" fill="#FFB6D5" opacity="0.5" />
      <ellipse cx="50" cy="55" rx="4.5" ry="5" fill="#1a1a1a" />
      <ellipse cx="70" cy="55" rx="4.5" ry="5" fill="#1a1a1a" />
      <circle cx="51.5" cy="53.5" r="1.4" fill="#fff" />
      <circle cx="71.5" cy="53.5" r="1.4" fill="#fff" />
      <ellipse cx="60" cy="64" rx="2.8" ry="2.2" fill="#1a1a1a" />
      <path d="M 55 70 Q 60 73 65 70" stroke="#1a1a1a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 58 68 Q 56 70 54 70" stroke="#FF8FA3" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 62 68 Q 64 70 66 70" stroke="#FF8FA3" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {reading && (
        <g>
          <rect x="44" y="46" width="32" height="14" rx="3" fill="none" stroke="#1a1a1a" strokeWidth="1.6" />
          <line x1="50" y1="50" x2="56" y2="50" stroke="#1a1a1a" strokeWidth="0.8" />
          <line x1="50" y1="53" x2="58" y2="53" stroke="#1a1a1a" strokeWidth="0.8" />
          <line x1="64" y1="50" x2="70" y2="50" stroke="#1a1a1a" strokeWidth="0.8" />
          <line x1="64" y1="53" x2="68" y2="53" stroke="#1a1a1a" strokeWidth="0.8" />
        </g>
      )}
      <ellipse cx="45" cy="100" rx="8" ry="5" fill="#8B5A1F" stroke="#5A3A10" strokeWidth="1" />
      <ellipse cx="75" cy="100" rx="8" ry="5" fill="#8B5A1F" stroke="#5A3A10" strokeWidth="1" />
    </motion.svg>
  );
}

function TomSvg({ action }) {
  const running = action === "pursuing" || action === "reaching";
  const watching = action === "confused" || action === "smiling";

  return (
    <motion.svg
      viewBox="0 0 140 140"
      width="100%"
      height="100%"
      style={{ overflow: "visible", filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.6))" }}
      animate={
        running
          ? { y: [0, -8, 0], rotate: [0, -2, 0] }
          : watching
            ? { y: [0, -2, 0] }
            : { y: 0 }
      }
      transition={
        running
          ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
          : watching
            ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.4 }
      }
    >
      <defs>
        <radialGradient id="tomBody" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#5a7a9a" />
          <stop offset="100%" stopColor="#2c3e50" />
        </radialGradient>
        <radialGradient id="tomBelly" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#d4b896" />
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="95" rx="42" ry="34" fill="url(#tomBody)" stroke="#1a2533" strokeWidth="1.5" />
      <ellipse cx="70" cy="100" rx="28" ry="22" fill="url(#tomBelly)" stroke="#8B6F2A" strokeWidth="0.8" />
      <ellipse cx="70" cy="50" rx="34" ry="32" fill="url(#tomBody)" stroke="#1a2533" strokeWidth="1.5" />
      <polygon points="40,30 32,8 50,22" fill="url(#tomBody)" stroke="#1a2533" strokeWidth="1.2" />
      <polygon points="100,30 108,8 90,22" fill="url(#tomBody)" stroke="#1a2533" strokeWidth="1.2" />
      <polygon points="40,28 35,12 46,22" fill="#FFB6D5" opacity="0.6" />
      <polygon points="100,28 105,12 94,22" fill="#FFB6D5" opacity="0.6" />
      <ellipse cx="56" cy="65" rx="6" ry="7" fill="#9ec5ff" />
      <ellipse cx="84" cy="65" rx="6" ry="7" fill="#9ec5ff" />
      <ellipse cx="56" cy="65" rx="2.5" ry="4" fill="#1a1a1a" />
      <ellipse cx="84" cy="65" rx="2.5" ry="4" fill="#1a1a1a" />
      <circle cx="57.5" cy="63" r="1.2" fill="#fff" />
      <circle cx="85.5" cy="63" r="1.2" fill="#fff" />
      <ellipse cx="70" cy="78" rx="3.5" ry="2.8" fill="#1a1a1a" />
      <path d="M 64 84 Q 70 88 76 84" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 60 70 L 56 76 M 80 70 L 84 76" stroke="#1a1a1a" strokeWidth="0.6" strokeLinecap="round" />
      <ellipse cx="35" cy="100" rx="9" ry="5" fill="#3a4a5e" stroke="#1a2533" strokeWidth="1" />
      <ellipse cx="105" cy="100" rx="9" ry="5" fill="#3a4a5e" stroke="#1a2533" strokeWidth="1" />
    </motion.svg>
  );
}

function getJerryAction(id) {
  return ["sprinting", "sneaking", "reading", "laughing"][id - 1];
}

function getTomAction(id) {
  return ["pursuing", "reaching", "confused", "smiling"][id - 1];
}

function JerryOnGroundSvg() {
  return (
    <svg
      viewBox="0 0 120 80"
      width="100%"
      height="100%"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="bookCover1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a4a8a" />
          <stop offset="100%" stopColor="#0d2952" />
        </linearGradient>
        <linearGradient id="bookPages1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff8e1" />
          <stop offset="100%" stopColor="#e8d8a8" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="74" rx="55" ry="3" fill="#000" opacity="0.5" />
      <path d="M 6 56 L 60 52 L 114 56 L 114 64 L 60 60 L 6 64 Z" fill="url(#bookCover1)" stroke="#000" strokeWidth="1" />
      <path d="M 14 58 L 60 54 L 106 58 L 106 62 L 60 58 L 14 62 Z" fill="url(#bookPages1)" stroke="#8B6F2A" strokeWidth="0.5" />
      <line x1="60" y1="52" x2="60" y2="60" stroke="#000" strokeWidth="0.5" opacity="0.5" />
      <text x="60" y="60" textAnchor="middle" fill="#FFC700" fontSize="5" fontWeight="700" fontFamily="serif">CH ACADEMY</text>
    </svg>
  );
}

export default function JerryAnimationHome() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setIsPlaying(false);
      return;
    }
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentScene((prev) => {
          const next = (prev + 1) % scenes.length;
          if (next === 3) {
            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.8 },
                colors: ["#FFC700", "#FFE082", "#FFB6D5", "#fff"],
              });
            } catch (e) {
              console.warn("Confetti failed:", e);
            }
          }
          return next;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const active = scenes[currentScene];

  return (
    <section className="relative w-full min-h-[85vh] bg-black text-white flex flex-col items-center justify-center p-6 overflow-hidden border-t border-amber-400/10">
      <motion.div
        key={active.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 bg-gradient-to-br ${active.bgColor}`}
      />

      <div className="relative z-10 w-full max-w-5xl bg-zinc-900/70 border border-amber-400/15 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide">
                Jerry's Reading Adventure
              </h2>
              <p className="text-xs text-neutral-400">Interactive Story Sequence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
              title={isMuted ? "Unmute" : "Mute"}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-400" />
              )}
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 text-amber-400" />
              )}
            </button>
            <button
              onClick={() => {
                setCurrentScene(0);
                setIsPlaying(true);
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
              aria-label="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative h-72 md:h-96 w-full rounded-2xl bg-black/80 border border-white/5 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center gap-4 sm:gap-8 p-6">
            <motion.div
              key={`jerry-${active.id}`}
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
            >
              <JerrySvg action={getJerryAction(active.id)} />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${active.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="flex-1 text-center max-w-xs"
              >
                <div
                  className={`px-4 py-1.5 inline-block rounded-full text-xs font-black tracking-widest uppercase bg-gradient-to-r ${active.accentColor} text-black shadow-lg`}
                >
                  Scene {active.id} of 4
                </div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mt-4 text-white">
                  {active.title}
                </h1>
                <p className="text-neutral-300 text-sm md:text-base mt-3">
                  {active.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              key={`tom-${active.id}`}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
            >
              <TomSvg action={getTomAction(active.id)} />
            </motion.div>
          </div>

          {(active.id === 3 || active.id === 4) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-16"
            >
              <JerryOnGroundSvg />
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {scenes.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentScene(idx);
                setIsPlaying(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                currentScene === idx
                  ? "bg-white/10 border-amber-400/50 shadow-lg"
                  : "bg-white/5 border-white/5 opacity-50 hover:opacity-80"
              }`}
            >
              <p className="text-[10px] text-neutral-400 font-bold uppercase">
                Frame 0{s.id}
              </p>
              <p className="text-xs font-semibold text-white truncate">
                {s.title}
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-left">
            <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
              Jerry (The Mouse)
            </p>
            <p className="text-xs text-neutral-200 mt-1">{active.jerryAction}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-left">
            <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
              Tom (The Cat)
            </p>
            <p className="text-xs text-neutral-200 mt-1">{active.tomAction}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
