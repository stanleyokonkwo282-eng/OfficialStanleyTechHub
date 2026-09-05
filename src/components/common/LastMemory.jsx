import { useLastMemory } from "../../hooks/useLastMemory";
import { useNavigate } from "react-router";
import { Play, Clock, BookOpen, X } from "lucide-react";

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
    <div className="w-full md:max-w-2xl mx-auto mb-6">
      <div className="bg-zinc-950 border border-amber-400/20 rounded-2xl p-5 md:p-6 shadow-lg relative overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"
          aria-hidden
        />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-400/15 border border-amber-400/25 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                Resume where you left off
              </p>
              <p className="text-sm text-white font-semibold line-clamp-1">
                {memory.lessonTitle || "Lesson"}
              </p>
              {memory.courseTitle && (
                <p className="text-xs text-neutral-400 line-clamp-1">
                  {memory.courseTitle}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-500">
                <Clock className="w-3 h-3" />
                <span>
                  {formatLastActive(memory.lastActiveAt) || "Last session"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleResume}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition"
            >
              <Play className="w-3.5 h-3.5" /> Resume
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 transition"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
