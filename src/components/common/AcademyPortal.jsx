import { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Download,
  Sparkles,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import COURSE_CATALOG from "../../data/courses";

export default function AcademyPortal() {
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(
    COURSE_CATALOG[0]?.slug || ""
  );
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);

  const activeCourse =
    COURSE_CATALOG.find((c) => c.slug === selectedCourseSlug) ||
    COURSE_CATALOG[0];
  const activeLesson =
    activeCourse?.lessons?.[activeLessonIdx] || activeCourse?.lessons?.[0];

  if (!activeCourse) {
    return (
      <div className="w-full max-w-5xl mx-auto my-12 p-6 text-center text-neutral-400">
        No courses available yet.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4 text-white">
      {/* Course Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 border-b border-white/10">
        {COURSE_CATALOG.map((course) => {
          const isCurrent = course.slug === selectedCourseSlug;
          return (
            <button
              key={course.slug}
              onClick={() => {
                setSelectedCourseSlug(course.slug);
                setActiveLessonIdx(0);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isCurrent
                  ? "bg-amber-400/15 border-amber-400/50 text-white shadow-lg"
                  : "bg-white/5 border-white/5 text-neutral-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              {course.title}
            </button>
          );
        })}
      </div>

      {/* Main Course Viewer Card */}
      <section className="relative p-6 md:p-8 rounded-3xl bg-black/95 border border-amber-400/15 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-300/10 blur-[100px] rounded-full pointer-events-none"
          aria-hidden
        />

        {/* Course Header */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/15 border border-amber-400/25 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 text-black">
                  {activeCourse.category}
                </span>
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> {activeCourse.level}
                </span>
              </div>
              <h2 className="text-base md:text-lg font-black tracking-tight text-white mt-1">
                {activeCourse.title}
              </h2>
            </div>
          </div>

          <a
            href={`/docs/${activeCourse.pdfFileName}`}
            download
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs tracking-wide transition shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Download className="w-4 h-4" /> Download PDF Manual
          </a>
        </div>

        {/* Reader Stage */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Lesson Directory */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-1 mb-1">
              Course Syllabus ({activeCourse.lessons.length} Lessons)
            </p>
            <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
              {activeCourse.lessons.map((lesson, idx) => (
                <button
                  key={lesson.title}
                  onClick={() => setActiveLessonIdx(idx)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    activeLessonIdx === idx
                      ? "bg-white/10 border-amber-400/50 shadow-lg"
                      : "bg-white/5 border-white/5 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">
                      {lesson.badge}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {lesson.readTime}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white line-clamp-1">
                    {lesson.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Lesson Content Area */}
          <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl bg-zinc-950/70 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold uppercase text-neutral-400">
                  Lesson {activeLessonIdx + 1}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-bold">
                  {activeLesson.badge}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-white mb-3">
                {activeLesson.title}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                {activeLesson.summary}
              </p>

              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Action Checklist
                </p>
                {activeLesson.keyPoints.map((pt, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-neutral-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-400/10 to-amber-400/5 border border-amber-400/20">
                <p className="text-xs text-neutral-200">
                  <strong className="text-amber-400">Creator Pro-Tip:</strong>{" "}
                  {activeLesson.proTip}
                </p>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
              <button
                onClick={() =>
                  setActiveLessonIdx((prev) => Math.max(0, prev - 1))
                }
                disabled={activeLessonIdx === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <span className="text-[11px] text-neutral-400">
                {activeLessonIdx + 1} of {activeCourse.lessons.length}
              </span>
              <button
                onClick={() =>
                  setActiveLessonIdx((prev) =>
                    Math.min(activeCourse.lessons.length - 1, prev + 1)
                  )
                }
                disabled={activeLessonIdx === activeCourse.lessons.length - 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
