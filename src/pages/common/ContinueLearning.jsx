import { useEffect } from "react";
import { useNavigate } from "react-router";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import { useLastMemory } from "../../hooks/useLastMemory";

export default function ContinueLearning() {
  const navigate = useNavigate();
  const { memory, formatLastActive } = useLastMemory();

  useEffect(() => {
    if (!memory) return;
    const timer = setTimeout(() => {
      if (memory.courseId && memory.lessonId) {
        navigate(`/dashboard/learn/${memory.courseId}`, {
          replace: true,
          state: { resumeLessonId: memory.lessonId },
        });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [memory, navigate]);

  if (!memory) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-6xl">🧭</div>
        <h2 className="text-2xl font-bold text-white">No recent session found</h2>
        <p className="text-gray-400 max-w-md">
          We couldn't find a saved lesson to resume. Start learning from your
          enrolled courses.
        </p>
        <button
          onClick={() => navigate("/dashboard/courses")}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500"
        >
          Browse My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-6 text-center">
      <LoaderSpinner />
      <p className="text-neutral-400 text-sm">
        Resuming your last session...
        {memory.lessonTitle && (
          <span className="block text-white font-semibold mt-1">
            {memory.lessonTitle}
          </span>
        )}
        {formatLastActive(memory.lastActiveAt) && (
          <span className="text-xs text-neutral-500">
            Last active: {formatLastActive(memory.lastActiveAt)}
          </span>
        )}
      </p>
      <button
        onClick={() => navigate("/dashboard/courses")}
        className="text-xs text-amber-400 underline underline-offset-4 hover:text-amber-300"
      >
        Cancel and go to My Courses
      </button>
    </div>
  );
}
