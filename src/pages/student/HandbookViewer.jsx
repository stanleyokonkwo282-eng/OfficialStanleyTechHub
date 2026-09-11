import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
  CheckCircle2,
  FileCode,
} from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function HandbookViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Safe fetch that tries multiple endpoints before failing
  useEffect(() => {
    let isMounted = true;
    const fetchHandbook = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try standard route, then fallback
        let res;
        try {
          res = await axiosSecure.get(`/courses/${id}`);
        } catch {
          res = await axiosSecure.get(`/courses/single/${id}`);
        }
        const data = res.data?.data || res.data;
        if (isMounted) {
          setCourse(data);
        }
      } catch (err) {
        console.error("Handbook fetch error:", err);
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load course handbook data."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHandbook();
    return () => {
      isMounted = false;
    };
  }, [id, axiosSecure]);

  // Flatten lessons safely
  const lessonsList = useMemo(() => {
    if (!course) return [];
    if (Array.isArray(course.modules) && course.modules.length > 0) {
      return course.modules.flatMap((mod, mIdx) =>
        (mod.lessons || []).map((les, lIdx) => ({
          ...les,
          moduleTitle: mod.title || `Module ${mIdx + 1}`,
          uniqueId: les._id || les.id || `${mIdx}-${lIdx}-${les.title || lIdx}`,
          displayTitle: les.title || `Lesson ${lIdx + 1}`,
        }))
      );
    }
    // If course has no modules but has top-level document/file link
    return [{
      uniqueId: "root-handbook",
      displayTitle: course.title || "Course Master Handbook",
      moduleTitle: "Complete Manual",
      fileUrl: course.fileUrl || course.pdfUrl || course.videoUrl || course.handbookUrl || "",
    }];
  }, [course]);

  // Set default active lesson
  useEffect(() => {
    if (lessonsList.length > 0 && !activeLessonId) {
      setActiveLessonId(lessonsList[0].uniqueId);
    }
  }, [lessonsList, activeLessonId]);

  const activeLesson = useMemo(() => {
    return lessonsList.find((l) => l.uniqueId === activeLessonId) || lessonsList[0];
  }, [lessonsList, activeLessonId]);

  const currentIndex = lessonsList.findIndex((l) => l.uniqueId === activeLesson?.uniqueId);
  const prevLesson = currentIndex > 0 ? lessonsList[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessonsList.length - 1 ? lessonsList[currentIndex + 1] : null;

  // Resolve source link
  const documentSource =
    activeLesson?.fileUrl ||
    activeLesson?.pdfUrl ||
    activeLesson?.htmlUrl ||
    activeLesson?.videoUrl ||
    course?.resourceHtmlUrl ||
    course?.resourcePdfUrl ||
    course?.fileUrl ||
    course?.pdfUrl ||
    "";

  const isHtml =
    documentSource.toLowerCase().includes(".html") ||
    documentSource.startsWith("data:text/html") ||
    documentSource.startsWith("/documents/");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-white gap-3">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-zinc-400">Loading Handbook Reader...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-white p-4 text-center">
        <h2 className="text-lg font-bold text-rose-400 mb-2">Notice: Handbook Unavailable</h2>
        <p className="text-xs text-zinc-400 max-w-sm mb-6">{error || "Course data could not be reached."}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2.5 bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs hover:bg-amber-400"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col">
      {/* TOP HEADER */}
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
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
              {isHtml ? "Interactive HTML Course" : "Handbook Study Portal"}
            </span>
            <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-[200px] sm:max-w-md">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {documentSource && (
            <a
              href={documentSource}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-bold text-zinc-200 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Open Full Screen</span>
            </a>
          )}
          {documentSource && (
            <a
              href={documentSource}
              download
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black transition shadow-lg shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-zinc-800 border border-white/10 text-zinc-300 lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* MAIN VIEWER */}
        <main className="flex-1 flex flex-col p-3 sm:p-5 overflow-y-auto">
          {/* CONTROL STRIP */}
          <div className="bg-[#0d121d] border border-white/10 rounded-2xl p-4 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {activeLesson?.moduleTitle}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white mt-1">
                {activeLesson?.displayTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                disabled={!prevLesson}
                onClick={() => setActiveLessonId(prevLesson?.uniqueId)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  prevLesson
                    ? "bg-zinc-800 border-white/10 text-white hover:bg-zinc-700"
                    : "bg-zinc-900/40 border-white/5 text-zinc-600 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <button
                disabled={!nextLesson}
                onClick={() => setActiveLessonId(nextLesson?.uniqueId)}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-black transition ${
                  nextLesson
                    ? "bg-amber-500 text-zinc-950 hover:bg-amber-400"
                    : "bg-zinc-800 border border-white/10 text-zinc-600 cursor-not-allowed"
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DOCUMENT IFRAME */}
          <div className="flex-1 min-h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#000000] relative shadow-2xl">
            {documentSource ? (
              <iframe
                src={documentSource}
                title="Handbook Viewport"
                className="w-full h-full min-h-[600px] border-0 rounded-2xl bg-white"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                <FileCode className="w-12 h-12 mb-3 text-zinc-600" />
                <p className="text-sm font-bold text-zinc-300">No Document File Linked</p>
                <p className="text-xs max-w-sm mt-1">
                  Upload an HTML document or PDF link to this lesson via the Teacher Dashboard.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed lg:static inset-y-0 right-0 z-40 w-72 sm:w-80 bg-[#0d121d] border-l border-white/10 flex flex-col transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black tracking-wider uppercase text-zinc-200">Modules &amp; Lessons</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-xs text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {lessonsList.map((les) => {
              const isActive = les.uniqueId === activeLesson?.uniqueId;
              return (
                <button
                  key={les.uniqueId}
                  onClick={() => {
                    setActiveLessonId(les.uniqueId);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs flex items-center gap-2.5 transition ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/50 text-amber-300 font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className="truncate flex-1">{les.displayTitle}</span>
                  {isActive && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

