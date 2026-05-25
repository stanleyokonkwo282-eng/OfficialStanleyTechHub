import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function CoursePlayer() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [videoError, setVideoError] = useState(false);

  const { data: lessonsData, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/${courseId}`);
      return res.data;
    },
  });

  const { data: progressData, refetch: refetchProgress } = useQuery({
    queryKey: ["progress", courseId, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/lessons/progress/${courseId}/${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (lessonsData?.lessons?.length > 0) {
      const lastWatchedId = progressData?.lastWatchedLessonId;
      if (lastWatchedId) {
        const lastLesson = lessonsData.lessons.find(
          (l) => l._id === lastWatchedId.toString()
        );
        if (lastLesson) {
          setActiveLesson(lastLesson);
          setExpandedModules({ [lastLesson.moduleNumber]: true });
          return;
        }
      }
      setActiveLesson(lessonsData.lessons[0]);
      setExpandedModules({ [lessonsData.lessons[0].moduleNumber]: true });
    }
  }, [lessonsData, progressData]);

  useEffect(() => {
    setVideoError(false);
  }, [activeLesson]);

  const markCompleteMutation = useMutation({
    mutationFn: async (lessonId) => {
      const res = await axiosSecure.post("/lessons/complete", {
        lessonId,
        courseId,
        studentEmail: user?.email,
      });
      return res.data;
    },
    onSuccess: (data) => {
      refetchProgress();
      if (data.courseCompleted) {
        toast.success("Congratulations! You completed the course!");
        setTimeout(() => navigate(`/dashboard/certificate/${courseId}`), 2000);
      } else {
        toast.success("Lesson marked as complete!");
        goToNextLesson();
      }
    },
  });

  const updateLastWatchedMutation = useMutation({
    mutationFn: async (lessonId) => {
      await axiosSecure.post("/lessons/last-watched", {
        lessonId,
        courseId,
        studentEmail: user?.email,
      });
    },
  });

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
    updateLastWatchedMutation.mutate(lesson._id);
  };

  const goToNextLesson = () => {
    if (!lessonsData?.lessons || !activeLesson) return;
    const currentIndex = lessonsData.lessons.findIndex(
      (l) => l._id === activeLesson._id
    );
    if (currentIndex < lessonsData.lessons.length - 1) {
      const nextLesson = lessonsData.lessons[currentIndex + 1];
      setActiveLesson(nextLesson);
      setExpandedModules({ [nextLesson.moduleNumber]: true });
      updateLastWatchedMutation.mutate(nextLesson._id);
    }
  };

  const toggleModule = (moduleNumber) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleNumber]: !prev[moduleNumber],
    }));
  };

  const isCompleted = (lessonId) => {
    return progressData?.completedLessonIds?.includes(lessonId);
  };

  const getYouTubeId = (url) => {
    const match = url?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  const modules = lessonsData?.lessons?.reduce((acc, lesson) => {
    const key = lesson.moduleNumber;
    if (!acc[key]) {
      acc[key] = {
        moduleNumber: key,
        moduleTitle: lesson.moduleTitle,
        moduleDescription: lesson.moduleDescription,
        lessons: [],
      };
    }
    acc[key].lessons.push(lesson);
    return acc;
  }, {});

  if (lessonsLoading) return <LoaderSpinner />;

  if (!lessonsData?.lessons?.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">No lessons available yet.</p>
      </div>
    );
  }

  const youtubeId = getYouTubeId(activeLesson?.videoUrl);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar */}
      <div className="bg-zinc-950 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-400 hover:underline text-sm"
        >
          Back
        </button>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {progressData?.percentage || 0}% Complete
          </span>
          <div className="w-40 bg-zinc-700 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressData?.percentage || 0}%` }}
            />
          </div>
          {progressData?.percentage === 100 && (
            <button
              onClick={() => navigate(`/dashboard/certificate/${courseId}`)}
              className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-semibold hover:bg-yellow-500"
            >
              Get Certificate
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {activeLesson && (
            <div>
              {/* Video */}
              <div className="w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden mb-6">
                {youtubeId && !videoError ? (
                  <iframe
                    key={activeLesson._id}
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title={activeLesson.lessonTitle}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    onError={() => setVideoError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <div className="text-6xl">&#9654;</div>
                    <p className="text-white text-lg font-semibold">
                      {activeLesson.lessonTitle}
                    </p>
                    <p className="text-gray-400 text-sm max-w-md">
                      This video cannot be embedded here. Watch it directly on YouTube,
                      then come back and mark it as complete.
                    </p>
                    <a
                      href={activeLesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition"
                    >
                      Watch on YouTube
                    </a>
                    <p className="text-gray-500 text-xs">
                      After watching, click Mark Complete below
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-yellow-400 text-sm mb-1">
                      Module {activeLesson.moduleNumber} — Lesson {activeLesson.lessonNumber}
                    </p>
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {activeLesson.lessonTitle}
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      {activeLesson.lessonDescription}
                    </p>
                  </div>
                  {isCompleted(activeLesson._id) ? (
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap font-semibold">
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => markCompleteMutation.mutate(activeLesson._id)}
                      disabled={markCompleteMutation.isPending}
                      className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 disabled:opacity-50 whitespace-nowrap"
                    >
                      {markCompleteMutation.isPending ? "Saving..." : "Mark Complete"}
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const index = lessonsData.lessons.findIndex(
                      (l) => l._id === activeLesson._id
                    );
                    if (index > 0) handleSelectLesson(lessonsData.lessons[index - 1]);
                  }}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 text-sm"
                >
                  Previous Lesson
                </button>
                <button
                  onClick={goToNextLesson}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 font-semibold text-sm"
                >
                  Next Lesson
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-zinc-950 border-l border-zinc-800 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="text-white font-semibold">Course Content</h3>
            <p className="text-gray-400 text-sm mt-1">
              {progressData?.completedLessons || 0} / {progressData?.totalLessons || 0} lessons completed
            </p>
          </div>

          {modules &&
            Object.values(modules).map((module) => (
              <div key={module.moduleNumber} className="border-b border-zinc-800">
                <button
                  onClick={() => toggleModule(module.moduleNumber)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-zinc-900"
                >
                  <div>
                    <p className="text-white font-medium text-sm">
                      Module {module.moduleNumber}
                    </p>
                    <p className="text-gray-400 text-xs">{module.moduleTitle}</p>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {expandedModules[module.moduleNumber] ? "^" : "v"}
                  </span>
                </button>

                {expandedModules[module.moduleNumber] && (
                  <div className="bg-zinc-900">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson._id}
                        onClick={() => handleSelectLesson(lesson)}
                        className={`w-full p-3 pl-6 text-left flex items-center gap-3 hover:bg-zinc-800 border-t border-zinc-800 ${
                          activeLesson?._id === lesson._id
                            ? "bg-zinc-800 border-l-2 border-l-yellow-400"
                            : ""
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                            isCompleted(lesson._id)
                              ? "bg-green-500 text-white"
                              : "bg-zinc-700 text-gray-400"
                          }`}
                        >
                          {isCompleted(lesson._id) ? "v" : lesson.lessonNumber}
                        </span>
                        <span
                          className={`text-sm ${
                            activeLesson?._id === lesson._id
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          {lesson.lessonTitle}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
