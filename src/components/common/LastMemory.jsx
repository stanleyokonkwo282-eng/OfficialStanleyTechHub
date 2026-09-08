import { useLastMemory } from "../../hooks/useLastMemory";
import { useNavigate } from "react-router";
import { Play, Clock, BookOpen, X, Sparkles } from "lucide-react";

export default function LastMemory() {
  const { memory, formatLastActive, resetMemory } = useLastMemory();
  const navigate = useNavigate();

  if (!memory) return null;

  const handleResume = () => {
    if (memory.courseId && memory.lessonId) {
      navigate(`/dashboard/learn/${memory.courseId}`, {
        replace: true,
        state: { resumeLessonId: memory.lessonId },
      });
    }
  };

  const handleDismiss = () => {
    resetMemory();
  };

  return (
    <div className="w-full md:max-w-3xl mx-auto mb-6">
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_35%),linear-gradient(135deg,_rgba(24,24,27,1),_rgba(9,9,11,1))] p-5 shadow-[0_25px_60px_rgba(251,191,36,0.08)] md:p-6">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-400/15 blur-[90px]"
          aria-hidden
        />
        <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-full bg-emerald-500/10 blur-[70px]" aria-hidden />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
                <Sparkles className="h-3 w-3" />
                Premium resume
              </div>
              <p className="text-sm font-semibold text-white md:text-base">
                {memory.lessonTitle || "Continue your learning path"}
              </p>
              {memory.courseTitle && (
                <p className="mt-1 text-xs text-neutral-400">{memory.courseTitle}</p>
              )}
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-400">
                <Clock className="h-3 w-3 text-amber-400" />
                <span>{formatLastActive(memory.lastActiveAt) || "Last session"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:flex-shrink-0">
            <button
              onClick={handleResume}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-black transition hover:bg-amber-300 md:text-sm"
            >
              <Play className="h-3.5 w-3.5" />
              Resume lesson
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-neutral-300 transition hover:bg-white/10"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
