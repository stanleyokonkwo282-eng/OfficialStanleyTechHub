import { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Download,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Terminal,
} from "lucide-react";

const CHAPTERS = [
  {
    id: "m1-c1",
    module: "Module 1: Creator Workspace",
    title: "Workstation Calibration for 4K Video & 3D",
    readTime: "4 min read",
    badge: "Performance",
    summary:
      "Configure Windows 11 display refresh rates, HDR balance, and dedicated NVMe scratch disks for Premiere, Photoshop, and Blender workflows.",
    keyPoints: [
      "Enable Variable Refresh Rate (VRR) & 144Hz+ in Settings > System > Display > Advanced Display.",
      "Split storage: OS on primary drive, media cache/scratch files on high-speed NVMe.",
      "Set Graphic Performance Preferences to High Performance GPU for your creative apps.",
    ],
    proTip:
      "Always allocate at least 20% free space on your NVMe scratch drive to avoid cache throttling during long render sessions.",
  },
  {
    id: "m1-c2",
    module: "Module 1: Creator Workspace",
    title: "Phone Link Pro Sync (iOS & Android)",
    readTime: "3 min read",
    badge: "Workflow",
    summary:
      "Eliminate transfer cables. Wirelessly beam high-res camera captures, sync universal clipboards, and test responsive mobile interfaces directly on desktop.",
    keyPoints: [
      "Pair Windows Phone Link with Link to Windows using secure QR authentication.",
      "Enable cross-device copy and paste to seamlessly send links, prompts, and hex codes.",
      "Drag and drop raw camera footage straight into your project timeline without compression.",
    ],
    proTip:
      "Keep both devices connected to the same 5GHz Wi-Fi network for instantaneous drag-and-drop file transfers.",
  },
  {
    id: "m2-c1",
    module: "Module 2: Visual Production",
    title: "Generative Canvas & AI Object Removal",
    readTime: "5 min read",
    badge: "AI Tools",
    summary:
      "Master the modernized Windows Photos studio. Clean up stray background cables, isolate product shots, and export high-contrast web banners.",
    keyPoints: [
      "Use Generative Erase in Photos to seamlessly clean up backgrounds in YouTube thumbnails.",
      "Leverage 1-click background blur and replacement for quick portrait turnarounds.",
      "Batch edit and color-correct RAW camera files before importing into design suites.",
    ],
    proTip:
      "Use the Retouch tool with a soft brush margin to prevent halo artifacts on contrast boundaries.",
  },
  {
    id: "m3-c1",
    module: "Module 3: Speed Tuning",
    title: "Memory Leaks & Terminal Recovery",
    readTime: "6 min read",
    badge: "Diagnostics",
    summary:
      "Free up RAM locked by background tasks and run non-destructive system integrity checks to prevent crashes during export.",
    keyPoints: [
      "Disable background startup applications to reclaim up to 4GB of physical RAM on boot.",
      "Toggle Efficiency Mode in Task Manager to prioritize rendering processes.",
      "Execute DISM and SFC deployment sweeps monthly to repair core libraries.",
    ],
    terminalCommand:
      "dism.exe /Online /Cleanup-image /Restorehealth && sfc /scannow",
    proTip:
      "Run DISM before big driver updates to ensure system image dependencies are fully stabilized.",
  },
  {
    id: "m4-c1",
    module: "Module 4: Security & Asset Defense",
    title: "Brand Asset Encryption & Phishing Defense",
    readTime: "5 min read",
    badge: "Security",
    summary:
      "Protect monetization accounts, client deliverables, and private brand assets from unauthorized breaches and network interception.",
    keyPoints: [
      "Enable BitLocker drive encryption on all external portable storage drives.",
      "Implement FIDO2 / hardware 2FA keys for creator YouTube and email channels.",
      "Always route public Wi-Fi through an encrypted VPN tunnel to block packet sniffing.",
    ],
    proTip:
      "Never store your unencrypted client project files on external drives without BitLocker or hardware PIN protection enabled.",
  },
];

export default function PremiumCourseReader({
  title = "Creator OS & Workstation Masterclass",
  version = "2026 Pro Edition",
  courseName = "Creators Hub Academy",
  lessonTitle = "",
  moduleNumber = 1,
  lessonNumber = 1,
  duration = "",
  pdfUrl = "",
  lessons: lessonsProp,
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const lessons = lessonsProp || CHAPTERS;
  const active = lessons[activeIdx] || lessons[0];

  const handleCopy = (cmd) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(cmd);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full max-w-5xl mx-auto my-8 rounded-3xl bg-black/95 border border-amber-400/15 text-white shadow-2xl backdrop-blur-xl overflow-hidden">
      <div
        className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-300/10 blur-[100px] rounded-full pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 md:p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400/15 border border-amber-400/25 text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 text-black">
                {courseName}
              </span>
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {version}
              </span>
            </div>
            <h2 className="text-base md:text-lg font-black tracking-tight text-white mt-1">
              {lessonTitle || title}
            </h2>
            <p className="text-[11px] text-neutral-400">
              Module {moduleNumber} • Lesson {lessonNumber}
              {duration ? ` • ${duration}` : ""}
            </p>
          </div>
        </div>

        <a
          href={pdfUrl || "#"}
          download
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs tracking-wide transition shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Download className="w-4 h-4" /> Download Full Manual
        </a>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-1 mb-1">
            Course Syllabus ({lessons.length} Core Modules)
          </p>
          <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
            {lessons.map((ch, idx) => (
              <button
                key={ch.title || ch.id || idx}
                onClick={() => setActiveIdx(idx)}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  activeIdx === idx
                    ? "bg-white/10 border-amber-400/50 shadow-lg"
                    : "bg-white/5 border-white/5 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">
                    {ch.badge}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {ch.readTime}
                  </span>
                </div>
                <p className="text-xs font-bold text-white line-clamp-1">
                  {ch.title}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">
                  {ch.module}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl bg-zinc-950/70 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase text-neutral-400">
                {active.module}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-bold">
                {active.badge}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-white mb-3">
              {active.title}
            </h3>

            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              {active.summary}
            </p>

            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Core Action Steps
              </p>
              {active.keyPoints.map((pt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-neutral-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {active.terminalCommand && (
              <div className="mb-6 p-3 rounded-xl bg-black border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono overflow-x-auto">
                  <Terminal className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{active.terminalCommand}</span>
                </div>
                <button
                  onClick={() => handleCopy(active.terminalCommand)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition flex-shrink-0"
                  title="Copy command"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-400/10 to-amber-400/5 border border-amber-400/20">
              <p className="text-xs text-neutral-200">
                <strong className="text-amber-400">Creator Pro-Tip:</strong>{" "}
                {active.proTip}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
            <button
              onClick={() =>
                setActiveIdx((prev) => Math.max(0, prev - 1))
              }
              disabled={activeIdx === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <span className="text-[11px] text-neutral-400">
              {activeIdx + 1} of {lessons.length}
            </span>

            <button
              onClick={() =>
                setActiveIdx((prev) =>
                  Math.min(lessons.length - 1, prev + 1)
                )
              }
              disabled={activeIdx === lessons.length - 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
