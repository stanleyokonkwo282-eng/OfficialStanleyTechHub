import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
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
  const [player, setPlayer] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [watchPercent, setWatchPercent] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const watchInterval = useRef(null);
  const completedRef = useRef(false);
  const lastKnownTime = useRef(0);
  const playerContainerId = "youtube-player-container";
  const apiLoadedRef = useRef(false);

  // --- Data fetching (unchanged) ---
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
      const res = await axiosSecure.get(`/lessons/progress/${courseId}/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: attemptsData } = useQuery({
    queryKey: ["attempts", courseId, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/exam/attempts/${courseId}/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // --- Mutations ---
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
      completedRef.current = true;
      if (data.courseCompleted) {
        toast.success("🎉 Course completed! Take the exam to get your certificate.");
      } else {
        toast.success("Lesson marked complete!");
        goToNextLesson();
      }
    },
  });

  const updateLastWatchedMutation = useMutation({
    mutationFn: async (lessonId, currentTimeSec = 0) => {
      await axiosSecure.post("/lessons/last-watched", {
        lessonId,
        courseId,
        studentEmail: user?.email,
        currentTime: currentTimeSec,
      });
    },
  });

  // --- Helper: extract YouTube ID ---
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // --- Load YouTube API once ---
  useEffect(() => {
    if (apiLoadedRef.current) return;
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      apiLoadedRef.current = true;
    }
  }, []);

  // --- Initialize player when activeLesson changes ---
  useEffect(() => {
    if (!activeLesson || !window.YT || videoError) return;

    const youtubeId = getYouTubeId(activeLesson.videoUrl);
    if (!youtubeId) {
      setVideoError(true);
      return;
    }
    setVideoError(false);
    setWatchPercent(0);
    setVideoDuration(0);
    completedRef.current = false;
    lastKnownTime.current = 0;

    // If player already exists, just load new video
    if (player && player.loadVideoById) {
      const startTime = activeLesson.lastWatchedTime || 0;
      player.loadVideoById({ videoId: youtubeId, startSeconds: startTime });
      if (startTime > 0) {
        toast.info(`Resuming from ${Math.floor(startTime / 60)}:${Math.floor(startTime % 60)}`, { autoClose: 2000 });
      }
      return;
    }

    // Create new player with mobile-friendly settings
    const onPlayerReady = (event) => {
      setPlayerReady(true);
      const startTime = activeLesson.lastWatchedTime || 0;
      if (startTime > 0) {
        event.target.seekTo(startTime, true);
        lastKnownTime.current = startTime;
      }
      setVideoDuration(event.target.getDuration());
    };

    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.PLAYING) {
        if (watchInterval.current) clearInterval(watchInterval.current);
        watchInterval.current = setInterval(() => {
          if (player && playerReady && !completedRef.current && player.getCurrentTime) {
            let currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            if (duration > 0 && lastKnownTime.current > 0) {
              // Forward seek lock
              if (currentTime > lastKnownTime.current + 1.0) {
                player.seekTo(lastKnownTime.current, true);
                toast.warning("Forward skipping is not allowed", { autoClose: 1500 });
                currentTime = lastKnownTime.current;
              }
            }
            if (currentTime > 0) lastKnownTime.current = currentTime;
            const percent = (currentTime / duration) * 100;
            setWatchPercent(Math.min(100, percent));
            setVideoDuration(duration);
            if (Math.floor(currentTime) % 10 === 0 && currentTime > 0) {
              updateLastWatchedMutation.mutate(activeLesson._id, currentTime);
            }
            if (percent >= 90 && !completedRef.current) {
              clearInterval(watchInterval.current);
              markCompleteMutation.mutate(activeLesson._id);
            }
          }
        }, 2000);
      } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
        if (watchInterval.current) clearInterval(watchInterval.current);
        if (player && playerReady && player.getCurrentTime) {
          const currentTime = player.getCurrentTime();
          if (currentTime > 0) updateLastWatchedMutation.mutate(activeLesson._id, currentTime);
        }
      }
    };

    // Mobile inline playback: add 'playsinline: 1'
    const newPlayer = new window.YT.Player(playerContainerId, {
      videoId: youtubeId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        start: activeLesson.lastWatchedTime || 0,
        playsinline: 1,          // ✅ Mobile inline playback
        controls: 1,             // Show player controls
      },
      events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange },
    });
    setPlayer(newPlayer);
    setPlayerReady(false);

    return () => {
      if (watchInterval.current) clearInterval(watchInterval.current);
    };
  }, [activeLesson, videoError]);

  // --- Cleanup on unmount ---
  useEffect(() => {
    return () => {
      if (watchInterval.current) clearInterval(watchInterval.current);
      if (player && player.destroy) player.destroy();
    };
  }, []);

  // --- Lesson selection ---
  const handleSelectLesson = (lesson) => {
    if (watchInterval.current) clearInterval(watchInterval.current);
    if (player && player.stopVideo) player.stopVideo();
    setActiveLesson(lesson);
    setWatchPercent(0);
    setVideoDuration(0);
    completedRef.current = false;
    lastKnownTime.current = 0;
    setDrawerOpen(false); // Close drawer on mobile after selection
  };

  const goToNextLesson = () => {
    if (!lessonsData?.lessons || !activeLesson) return;
    const idx = lessonsData.lessons.findIndex(l => l._id === activeLesson._id);
    if (idx < lessonsData.lessons.length - 1) {
      const next = lessonsData.lessons[idx + 1];
      handleSelectLesson(next);
      setExpandedModules(prev => ({ ...prev, [next.moduleNumber]: true }));
    }
  };

  const toggleModule = (moduleNumber) => {
    setExpandedModules(prev => ({ ...prev, [moduleNumber]: !prev[moduleNumber] }));
  };

  const isCompleted = (lessonId) => progressData?.completedLessonIds?.includes(lessonId);

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

  const courseCompleted = progressData?.percentage === 100;
  const attempts = attemptsData?.attempts || [];
  const hasPassed = attempts.some(a => a.passed);
  const isLocked = attempts.length >= 2 && !hasPassed;

  // Fallback iframe (with playsinline for mobile)
  const useFallback = videoError && activeLesson;
  const fallbackYoutubeId = getYouTubeId(activeLesson?.videoUrl);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar (responsive) */}
      <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <button onClick={() => navigate(-1)} className="text-yellow-400 text-sm md:text-base">← Back</button>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-gray-400 text-xs md:text-sm">{progressData?.percentage || 0}%</span>
          <div className="w-24 md:w-40 bg-zinc-700 rounded-full h-2">
            <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${progressData?.percentage || 0}%` }} />
          </div>
          {courseCompleted && hasPassed && (
            <button onClick={() => navigate(`/dashboard/certificate/${courseId}`)} className="bg-green-500 text-white px-2 py-1 md:px-3 rounded text-xs md:text-sm">
              Certificate
            </button>
          )}
          {courseCompleted && !hasPassed && !isLocked && (
            <button onClick={() => navigate(`/dashboard/exam/${courseId}`)} className="bg-yellow-400 text-black px-2 py-1 md:px-3 rounded text-xs md:text-sm">
              Exam
            </button>
          )}
          {courseCompleted && isLocked && <span className="text-red-400 text-xs md:text-sm">Exam Locked</span>}
        </div>
      </div>

      {/* Completion banner */}
      {courseCompleted && (
        <div className={`px-4 py-2 text-center text-xs md:text-sm font-semibold ${
          hasPassed ? "bg-green-900 text-green-300" : isLocked ? "bg-red-900 text-red-300" : "bg-yellow-900 text-yellow-300"
        }`}>
          {hasPassed ? "You passed! Click Get Certificate." : isLocked ? "Exam locked. Contact admin." : "All lessons done! Take the exam."}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Video area */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          {activeLesson ? (
            <>
              <div className="w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden mb-4">
                {!useFallback ? (
                  <div id={playerContainerId} className="w-full h-full" />
                ) : (
                  fallbackYoutubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${fallbackYoutubeId}?rel=0&modestbranding=1&playsinline=1`}
                      title={activeLesson.lessonTitle}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-400">Invalid video URL</p>
                    </div>
                  )
                )}
              </div>

              {playerReady && !isCompleted(activeLesson._id) && watchPercent > 0 && watchPercent < 90 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Auto‑complete at 90%</span>
                    <span>{Math.floor(watchPercent)}%</span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-1.5">
                    <div className="bg-yellow-400 h-1.5 rounded-full transition-all" style={{ width: `${watchPercent}%` }} />
                  </div>
                </div>
              )}

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <p className="text-yellow-400 text-xs sm:text-sm">Module {activeLesson.moduleNumber} — Lesson {activeLesson.lessonNumber}</p>
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-1">{activeLesson.lessonTitle}</h2>
                    <p className="text-gray-300 text-sm sm:text-base mt-2">{activeLesson.lessonDescription}</p>
                  </div>
                  {isCompleted(activeLesson._id) && (
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">✓ Completed</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <button onClick={() => {
                  const idx = lessonsData.lessons.findIndex(l => l._id === activeLesson._id);
                  if (idx > 0) handleSelectLesson(lessonsData.lessons[idx - 1]);
                }} className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 text-sm md:text-base flex-1 md:flex-none">
                  ← Previous
                </button>
                <button onClick={goToNextLesson} className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 font-semibold text-sm md:text-base flex-1 md:flex-none">
                  Next →
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Select a lesson from the sidebar.</div>
          )}
        </div>

        {/* Floating drawer button (mobile only) */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="md:hidden fixed bottom-4 right-4 bg-yellow-400 text-black p-3 rounded-full shadow-lg z-20"
        >
          📚 Course Content
        </button>

        {/* Sidebar as drawer on mobile */}
        <div className={`
          fixed md:static top-0 right-0 h-full w-80 bg-zinc-950 border-l border-zinc-800 overflow-y-auto z-30 transition-transform duration-300
          ${drawerOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-white font-semibold">Course Content</h3>
            <button onClick={() => setDrawerOpen(false)} className="md:hidden text-gray-400 text-xl">&times;</button>
          </div>
          <div className="p-2">
            <p className="text-gray-400 text-sm mb-2">{progressData?.completedLessons || 0} / {progressData?.totalLessons || 0} lessons</p>
          </div>
          {modules && Object.values(modules).map(module => (
            <div key={module.moduleNumber} className="border-b border-zinc-800">
              <button onClick={() => toggleModule(module.moduleNumber)} className="w-full p-3 text-left flex justify-between items-center hover:bg-zinc-900">
                <div>
                  <p className="text-white font-medium text-sm">Module {module.moduleNumber}</p>
                  <p className="text-gray-400 text-xs">{module.moduleTitle}</p>
                </div>
                <span className="text-gray-400">{expandedModules[module.moduleNumber] ? "▲" : "▼"}</span>
              </button>
              {expandedModules[module.moduleNumber] && (
                <div className="bg-zinc-900">
                  {module.lessons.map(lesson => (
                    <button
                      key={lesson._id}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`w-full p-3 pl-6 text-left flex items-center gap-2 hover:bg-zinc-800 border-t border-zinc-800 ${
                        activeLesson?._id === lesson._id ? "bg-zinc-800 border-l-2 border-l-yellow-400" : ""
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted(lesson._id) ? "bg-green-500 text-white" : "bg-zinc-700 text-gray-400"
                      }`}>
                        {isCompleted(lesson._id) ? "✓" : lesson.lessonNumber}
                      </span>
                      <span className={`text-sm ${activeLesson?._id === lesson._id ? "text-yellow-400" : "text-gray-300"}`}>
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