import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  BookOpen,
  FileText,
  Menu,
  CheckCircle2,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";

export default function PdfCoursePlayer() {
  const { courseId: id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumePage, setResumePage] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState({});

    const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["pdfCourse", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/courses/${id}`);
      // Backend returns { success, message, course: result[0] } — match CourseDetails.jsx
      return res.data?.course || res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: lessonsData, isLoading: lessonsLoading, isError: lessonsError, error: lessonsQueryError } = useQuery({
    queryKey: ["pdfLessons", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/${id}`, { params: { format: "pdf" } });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const lessonErrorStatus = lessonsQueryError?.response?.status || null;
  const lessonErrorMessage = lessonsQueryError?.response?.data?.message || lessonsQueryError?.message || "";

  // Resume: open the exact handbook lesson the student last read, and remember
  // their last-seen "page" (lesson index) so they can continue where they left off.
  const { data: resumeData } = useQuery({
    queryKey: ["pdf-resume", id, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/resume/${id}/${user?.email}`);
      return res.data?.resume || null;
    },
    enabled: !!user?.email,
  });

  // Completion summary + exam eligibility (60% pass; exam only after all lessons).
  const { data: completionData, refetch: refetchCompletion } = useQuery({
    queryKey: ["pdf-completion", id, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/completion/${id}/${user?.email}`);
      return res.data || { totalLessons: 0, completedLessons: 0, percentage: 0, isComplete: false, exam: null };
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (!allLessons?.length) return;
    if (!resumeData?.lessonId) return;
    const resumeLesson = allLessons.find((l) => String(l._id || l.resolvedId) === String(resumeData.lessonId));
    if (resumeLesson) {
      setSelectedLessonId(resumeLesson.resolvedId);
      setResumePage(Math.max(0, Number(resumeData.lastPosition) || 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(resumeData), allLessons.length]);

  // Mark the current handbook lesson as completed (once fully read).
  const completeLessonMutation = useMutation({
    mutationFn: async (lesson) => {
      const res = await axiosSecure.post("/lessons/complete", {
        lessonId: lesson._id,
        courseId: id,
        studentEmail: user?.email,
      });
      return res.data;
    },
    onSuccess: async (_, lesson) => {
      setCompletedLessonIds((prev) => ({ ...prev, [String(lesson._id)]: true }));
      queryClient.invalidateQueries({ queryKey: ["pdf-completion"] });
      toast.success("Lesson marked as complete! ✅");
      if (completionData?.totalLessons && completedLessonsAll(completedLessonIds, completionData.totalLessons)) {
        toast.info("Course complete — your exam is now unlocked!", { autoClose: 5000 });
      }
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Could not mark lesson complete."),
  });

    // Persist which handbook lesson is being read (for resume).
  const persistLesson = (lesson) => {
    if (!lesson?._id || !user?.email) return;
    // Match by _id since sidebar lessons don't have resolvedId (only allLessons items do)
    const index = allLessons.findIndex((l) => String(l._id) === String(lesson._id));
    axiosSecure
      .post("/lessons/last-watched", {
        lessonId: lesson._id,
        courseId: id,
        studentEmail: user?.email,
        lastPosition: Math.max(0, index),
        progressPercent: allLessons.length > 0
          ? Math.min(100, Math.round(((index + 1) / allLessons.length) * 100))
          : 0,
      })
      .catch(() => {});
  };

  const handleSelectLesson = useCallback(
    (lesson) => {
      setSelectedLessonId(lesson.resolvedId || lesson._id);
      setResumePage(0);
      persistLesson(lesson);
      setSidebarOpen(false);
    },
    [allLessons, persistLesson]
  );

  function completedLessonsAll(localMap, total) {
    return total > 0 && total <= Object.keys(localMap).length;
  }

  const modules = useMemo(() => {
    if (!lessonsData?.lessons?.length) return [];
    const acc = {};
    for (const lesson of lessonsData.lessons) {
      const key = lesson.moduleNumber;
      if (!acc[key]) {
        acc[key] = {
          moduleNumber: key,
          moduleTitle: lesson.moduleTitle || `Module ${key}`,
          moduleDescription: lesson.moduleDescription || "",
          lessons: [],
        };
      }
      acc[key].lessons.push(lesson);
    }
    return Object.values(acc).sort((a, b) => a.moduleNumber - b.moduleNumber);
  }, [lessonsData]);

  const allLessons = useMemo(() => {
    return modules.flatMap((mod) =>
      mod.lessons.map((les) => ({
        ...les,
        moduleTitle: mod.moduleTitle,
        resolvedId: les._id || `${les.moduleNumber}-${les.lessonNumber}`,
      }))
    );
  }, [modules]);

  const currentLesson = useMemo(() => {
    if (!allLessons.length) return null;
    if (!selectedLessonId) return allLessons[0];
    return allLessons.find((l) => l.resolvedId === selectedLessonId) || allLessons[0];
  }, [allLessons, selectedLessonId]);

  const currentIndex = allLessons.findIndex((l) => l.resolvedId === currentLesson?.resolvedId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const pdfUrl = currentLesson?.pdfUrl || currentLesson?.videoUrl || "";

  const isLoading = courseLoading || lessonsLoading;
  const hasError = lessonsError || (!course && !courseLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400">Opening PDF Course Handbook...</p>
        </div>
      </div>
    );
  }

  if (hasError || !course) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-white p-4 text-center">
        <p className="text-rose-400 font-bold mb-2">Failed to load course handbook</p>
        <p className="text-zinc-400 text-xs mb-4 max-w-sm">
          {lessonsError
            ? `Could not load lessons (status: ${lessonErrorStatus || "unknown"}). Please ensure you are enrolled and logged in with the correct account.`
            : "Course not found or you do not have access."}
        </p>
        {lessonErrorMessage && (
          <p className="text-zinc-500 text-[10px] mb-4 max-w-sm font-mono">Detail: {lessonErrorMessage}</p>
        )}
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-zinc-800 rounded-xl text-xs hover:bg-zinc-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!allLessons.length) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-white p-4 text-center">
        <p className="text-rose-400 font-bold mb-2">No lessons available yet.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-zinc-800 rounded-xl text-xs hover:bg-zinc-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col">
      <header className="h-16 border-b border-white/10 bg-[#0d121d] px-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
              PDF Handbook Track
            </span>
            <h1 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {course?.title || "Course Handbook"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pdfUrl && (
            <button
              onClick={() => {
                const lesson = currentLesson;
                if (!lesson) return;
                completeLessonMutation.mutate(lesson);
              }}
              disabled={completeLessonMutation.isPending}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/90 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              title="Mark this lesson as fully read"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mark Complete</span>
            </button>
          )}
          {pdfUrl && (
            <button
              onClick={() => {
                toast.info("Continue reading right here on the academy — external viewing is locked to protect your progress.");
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold text-zinc-200 transition cursor-not-allowed"
              title="External viewing is disabled"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Read In-App</span>
            </button>
          )}
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-zinc-800 border border-white/10 text-zinc-300 lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex flex-col bg-[#07090e] p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#0d121d] border border-white/10 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {currentLesson?.moduleTitle}
                </span>
                <span className="text-zinc-500 text-xs">&bull;</span>
                <span className="text-xs text-zinc-400">Lesson {currentLesson?.lessonNumber}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white border-0 p-0 m-0">
                {currentLesson?.lessonTitle || "Lesson Handbook"}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && handleSelectLesson(prevLesson)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                  prevLesson
                    ? "bg-zinc-800 border-white/10 text-white hover:bg-zinc-700"
                    : "bg-zinc-900/40 border-white/5 text-zinc-600 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                disabled={!nextLesson}
                onClick={() => nextLesson && handleSelectLesson(nextLesson)}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                  nextLesson
                    ? "bg-amber-500 text-zinc-950 hover:bg-amber-400"
                    : "bg-zinc-800 border border-white/10 text-zinc-600 cursor-not-allowed"
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress + Exam gate */}
          <div className="bg-[#0d121d] border border-white/10 rounded-2xl p-4 mb-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                  Course Progress
                </p>
                <p className="text-xs text-zinc-300">
                  {completionData?.completedLessons || 0} of {completionData?.totalLessons || allLessons.length} lessons completed ({completionData?.percentage || 0}%)
                </p>
                <div className="w-full sm:w-72 h-2 rounded-full bg-zinc-800 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                    style={{ width: `${completionData?.percentage || 0}%` }}
                  />
                </div>
              </div>

              {completionData?.isComplete ? (
                completionData?.exam ? (
                  <button
                    onClick={() => navigate(`/dashboard/exam/${id}`)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition shadow-lg shadow-amber-500/30"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Exam Ready — Take the Exam (Pass mark {completionData?.exam?.passMark ?? 60}%)
                  </button>
                ) : (
                  <p className="text-[11px] text-zinc-500 max-w-xs text-right">
                    Course complete! Your exam will appear here once the instructor publishes it.
                  </p>
                )
              ) : (
                <p className="text-[11px] text-zinc-500 max-w-xs text-right">
                  Complete every lesson in this handbook (mark each one complete as you read) to unlock your final exam.
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-[550px] sm:min-h-[700px] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0d121d] relative shadow-2xl">
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}${resumePage > 0 ? `#page=${Math.min(Math.ceil(resumePage) + 1, 500)}` : ""}#toolbar=1&navpanes=0`}
                title={currentLesson?.lessonTitle || "PDF Document Viewer"}
                className="w-full h-full min-h-[550px] sm:min-h-[700px] border-0 rounded-2xl bg-zinc-950"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <FileText className="w-12 h-12 text-zinc-600 mb-3" />
                <h3 className="text-sm font-bold text-zinc-300">No PDF File Linked</h3>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  The instructor has not attached a readable PDF link to this lesson yet.
                </p>
              </div>
            )}
          </div>
        </main>

        <aside
          className={`fixed lg:static inset-y-0 right-0 z-40 w-80 bg-[#0d121d] border-l border-white/10 flex flex-col transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-200 m-0">Course Content</h3>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-xs text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {modules.map((mod, modIdx) => (
              <div key={modIdx} className="rounded-xl bg-[#131b2e] border border-white/5 p-3">
                <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Module {mod.moduleNumber}: {mod.moduleTitle}
                </h4>
                <div className="space-y-1">
                  {mod.lessons.map((les, lesIdx) => {
                    const lessonId = les._id || `${les.moduleNumber}-${les.lessonNumber}`;
                    const isActive = currentLesson?.resolvedId === lessonId;
                    const isDone = completedLessonIds[String(les._id)] || false;

                    return (
                      <button
                        key={lesIdx}
                        onClick={() => handleSelectLesson(les)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center gap-2.5 transition ${
                          isActive
                            ? "bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold"
                            : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        ) : (
                          <FileText
                            className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-amber-400" : "text-zinc-500"}`}
                          />
                        )}
                        <span className="truncate flex-1">{les.lessonTitle}</span>
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
