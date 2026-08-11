import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [watchPercent, setWatchPercent] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('video');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  
  // --- AI Assistant States ---
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I'm your AI Course Assistant. Ask me anything about this lesson or course!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  const watchInterval = useRef(null);
  const completedRef = useRef(false);
  const lastKnownTime = useRef(0);
  const playerContainerId = "youtube-player-container";
  const apiLoadedRef = useRef(false);

  // --- Scroll chat to bottom ---
  useEffect(() => {
    if (aiDrawerOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, aiDrawerOpen]);

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

  // --- Fetch saved AI chat history for the active lesson ---
  const { data: chatHistoryData } = useQuery({
    queryKey: ["ai-chat-history", courseId, activeLesson?._id, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/ai/chat-history/${courseId}/${activeLesson._id}/${user?.email}`
      );
      return res.data;
    },
    enabled: !!activeLesson?._id && !!user?.email,
  });

  // --- Populate chat with saved history when lesson changes ---
  useEffect(() => {
    if (chatHistoryData?.messages?.length > 0) {
      setChatMessages(
        chatHistoryData.messages.map((m) => ({ sender: m.sender, text: m.text }))
      );
    } else {
      setChatMessages([
        { sender: "ai", text: "Hello! I'm your AI Course Assistant. Ask me anything about this lesson or course!" }
      ]);
    }
  }, [chatHistoryData, activeLesson?._id]);

  // --- Reset PDF loading/error when lesson changes ---
  useEffect(() => {
    setPdfLoading(false);
    setPdfError(false);
  }, [activeLesson?._id]);

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

  const markCompleteMutationRef = useRef(markCompleteMutation);
  markCompleteMutationRef.current = markCompleteMutation;
  const updateLastWatchedMutationRef = useRef(updateLastWatchedMutation);
  updateLastWatchedMutationRef.current = updateLastWatchedMutation;

  // --- Curated distinct YouTube educational video IDs for varied lessons ---
  const CURATED_LESSON_VIDEOS = [
    "WONZVnlam6U", "a5KYlHNKQB8", "AvgCkHrcj8w", "sByzHoiYFX0", "ZK86XQ1iFVs",
    "Ib8UBwU3bgQ", "agbj7dBmDvs", "4fGPbEDzPqA", "oSQbRFquPso", "sCHiTpTqY4E",
    "9wBGvJDLpBs", "wBKTpS3KBFU", "8ySO1niE0HQ", "sz56f0KBQBI", "nGEV2quqhx0",
    "F-E3tqHGfuo", "tE-4hMHobes", "RZBzAFc3nGk", "X4FQHbCNUcw", "bixR-KIJKYM",
    "KjGALDEBxs8", "RNM7YoTt-lI", "eAH_3hvjIIY", "YMcfNBFQfyM", "Nz1-7nWolC8",
    "fBDCCXsCoXE", "a1mDwOaVZl4", "iHR6rg1RoZs", "JTxsNm9IdYU", "uFBfBCASHsc",
    "XpopyNZKLrY", "mTE9OmG2zkw", "gBdGMRlnLaM", "owm3Ztj_1YI", "r1qkCzDxJQ8",
    "9kfvblvOoFY", "5CxXhyhT6Fc", "u44pBnAn7cM", "qpH7-KFWZRI", "2cRtDFnmqrw"
  ];

  // --- Helper: extract YouTube ID with unique topic fallback ---
  const getYouTubeId = (url, lessonTitle = "") => {
    if (url) {
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^?&\n?#]+)/);
      if (match && match[1]) return match[1];
    }
    // Deterministic unique hash based on title so each lesson gets a distinct video
    let hash = 0;
    const str = (lessonTitle || "") + (url || "");
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % CURATED_LESSON_VIDEOS.length;
    return CURATED_LESSON_VIDEOS[index];
  };

  // --- Load YouTube API once ---
  useEffect(() => {
    if (apiLoadedRef.current) return;
    if (!window.YT) {
      window.onYouTubeIframeAPIReady = () => {
        apiLoadedRef.current = true;
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // --- Initialize player when activeLesson changes ---
  useEffect(() => {
    if (!activeLesson || !window.YT || videoError) return;

    const youtubeId = getYouTubeId(activeLesson.videoUrl, activeLesson.lessonTitle);
    if (!youtubeId) {
      setVideoError(true);
      return;
    }
    setVideoError(false);
    setWatchPercent(0);
    completedRef.current = false;
    lastKnownTime.current = 0;

    // Cleanup previous player instance if it exists
    if (playerRef.current && playerRef.current.destroy) {
      try {
        playerRef.current.destroy();
      } catch (err) {
        console.debug("Player cleanup error:", err);
      }
      playerRef.current = null;
    }

    // Create new player with safe parameters
    const onPlayerReady = (event) => {
      setPlayerReady(true);
      const startTime = activeLesson.lastWatchedTime || 0;
      if (startTime > 0) {
        event.target.seekTo(startTime, true);
        lastKnownTime.current = startTime;
      }
      playerRef.current = event.target;
    };

    const onPlayerError = (event) => {
      console.error("YouTube Player Error:", event.data);
      setVideoError(true);
      toast.error("Video playback failed. Please try again or contact support.");
    };

    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.PLAYING) {
        if (watchInterval.current) clearInterval(watchInterval.current);
        watchInterval.current = setInterval(() => {
          if (playerRef.current && playerReady && !completedRef.current && playerRef.current.getCurrentTime) {
            let currentTime = playerRef.current.getCurrentTime();
            const duration = playerRef.current.getDuration();
            if (duration > 0 && lastKnownTime.current > 0) {
              if (currentTime > lastKnownTime.current + 1.0) {
                playerRef.current.seekTo(lastKnownTime.current, true);
                toast.warning("Forward skipping is not allowed", { autoClose: 1500 });
                currentTime = lastKnownTime.current;
              }
            }
            if (currentTime > 0) lastKnownTime.current = currentTime;
            const percent = (currentTime / duration) * 100;
            setWatchPercent(Math.min(100, percent));
            if (Math.floor(currentTime) % 10 === 0 && currentTime > 0) {
              updateLastWatchedMutationRef.current.mutate(activeLesson._id, currentTime);
            }
            if (percent >= 90 && !completedRef.current) {
              clearInterval(watchInterval.current);
              markCompleteMutationRef.current.mutate(activeLesson._id);
            }
          }
        }, 2000);
      } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
        if (watchInterval.current) clearInterval(watchInterval.current);
        if (playerRef.current && playerReady && playerRef.current.getCurrentTime) {
          const currentTime = playerRef.current.getCurrentTime();
          if (currentTime > 0) updateLastWatchedMutationRef.current.mutate(activeLesson._id, currentTime);
        }
      }
    };

    // Small delay to ensure container is ready
    const timer = setTimeout(() => {
      try {
        if (!window.YT || !window.YT.Player) {
          console.error("YouTube API not loaded");
          setVideoError(true);
          return;
        }
        const newPlayer = new window.YT.Player(playerContainerId, {
          videoId: youtubeId,
          playerVars: {
            rel: 0,
            modestbranding: 1,
            start: activeLesson.lastWatchedTime || 0,
            playsinline: 1,
            controls: 1,
          },
          events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange, onError: onPlayerError },
        });
        playerRef.current = newPlayer;
        setPlayerReady(false);
      } catch (err) {
        console.error("Failed to create YouTube player:", err);
        setVideoError(true);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (watchInterval.current) clearInterval(watchInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLesson, videoError]);

  // --- Cleanup on unmount ---
  useEffect(() => {
    return () => {
      if (watchInterval.current) clearInterval(watchInterval.current);
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (err) {
          console.debug("Final player cleanup error:", err);
        }
      }
    };
  }, []);

  // --- Pause/Resume safeguards when switching media formats ---
  useEffect(() => {
    if (selectedFormat === 'reading') {
      if (watchInterval.current) {
        clearInterval(watchInterval.current);
        watchInterval.current = null;
      }
      if (playerRef.current && playerRef.current.pauseVideo) {
        try { playerRef.current.pauseVideo(); } catch (err) { console.debug(err); }
      }
      setPlayerReady(false);
    } else if (selectedFormat === 'video') {
      if (playerRef.current && playerRef.current.playVideo) {
        try { playerRef.current.playVideo(); } catch (err) { console.debug(err); }
      }
    }
  }, [selectedFormat]);

  const modules = useMemo(() => {
    return lessonsData?.lessons?.reduce((acc, lesson) => {
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
    }, {}) || {};
  }, [lessonsData?.lessons]);

  const handleSelectLesson = useCallback((lesson) => {
    if (watchInterval.current) clearInterval(watchInterval.current);
    if (playerRef.current && playerRef.current.stopVideo) playerRef.current.stopVideo();
    
    // Explicitly save current position before switching
    if (playerRef.current && playerReady && activeLesson && playerRef.current.getCurrentTime) {
      try {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime > 0) {
          updateLastWatchedMutationRef.current.mutate(activeLesson._id, currentTime);
        }
      } catch (err) {
        console.debug("Error saving watch time on lesson switch:", err);
      }
    }
    
    setActiveLesson(lesson);
    setWatchPercent(0);
    completedRef.current = false;
    lastKnownTime.current = 0;
    setDrawerOpen(false);
  }, [activeLesson, playerReady]);

  const goToNextLesson = useCallback(() => {
    if (!lessonsData?.lessons || !activeLesson) return;
    const idx = lessonsData.lessons.findIndex(l => l._id === activeLesson._id);
    if (idx < lessonsData.lessons.length - 1) {
      const next = lessonsData.lessons[idx + 1];
      handleSelectLesson(next);
      setExpandedModules(prev => ({ ...prev, [next.moduleNumber]: true }));
    }
  }, [lessonsData, activeLesson, handleSelectLesson]);

  const toggleModule = useCallback((moduleNumber) => {
    setExpandedModules(prev => ({ ...prev, [moduleNumber]: !prev[moduleNumber] }));
  }, []);

  const isCompleted = (lessonId) => progressData?.completedLessonIds?.includes(lessonId);

  // --- Send message to AI Assistant ---
  const handleSendAiMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || aiLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setAiLoading(true);

    try {
      const res = await axiosSecure.post("/ai/chat", {
        prompt: userMessage,
        lessonTitle: activeLesson?.lessonTitle || "General",
        lessonDescription: activeLesson?.lessonDescription || "",
        courseId,
        lessonId: activeLesson?._id,
        studentEmail: user?.email,
      });
      setChatMessages(prev => [...prev, { sender: "ai", text: res.data.reply }]);
    } catch (error) {
      console.debug(error);
      setChatMessages(prev => [...prev, { sender: "ai", text: "Sorry, I encountered an error connecting to the AI. Please try again." }]);
    } finally {
      setAiLoading(false);
    }
  };

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
  const useFallback = videoError && activeLesson;
  const fallbackYoutubeId = getYouTubeId(activeLesson?.videoUrl, activeLesson?.lessonTitle);

  const rawPdfUrl = activeLesson?.pdfUrl;
  const normalizedPdfUrl = rawPdfUrl
    ? rawPdfUrl.startsWith("http")
      ? rawPdfUrl
      : `${import.meta.env.VITE_BASE_URL || ''}${rawPdfUrl.startsWith("/") ? "" : "/"}${rawPdfUrl}`
    : null;
  const canPreview = Boolean(normalizedPdfUrl && (rawPdfUrl.startsWith("http") || rawPdfUrl.startsWith("/uploads/")));

  // YouTube watch link for fallback
  const youtubeWatchUrl = fallbackYoutubeId
    ? `https://www.youtube.com/watch?v=${fallbackYoutubeId}`
    : null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar */}
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
              <div className="mb-6">
                <div className="tabs tabs-boxed justify-center mb-6 max-w-md mx-auto">
                  <button 
                    onClick={() => setSelectedFormat('video')} 
                    className={`tab flex-1 gap-2 ${selectedFormat === 'video' ? 'tab-active font-semibold' : ''}`}
                  >
                    🎥 Video Lecture
                  </button>
                  <button 
                    onClick={() => setSelectedFormat('reading')} 
                    className={`tab flex-1 gap-2 ${selectedFormat === 'reading' ? 'tab-active font-semibold' : ''}`}
                  >
                    📄 PDF Document Summary
                  </button>
                </div>

                 {selectedFormat === 'video' ? (
                  <div className="w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden mb-4">
                    {!useFallback ? (
                      <div id={playerContainerId} className="w-full h-full" />
                    ) : (
                      fallbackYoutubeId ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                          <div className="text-5xl">⚠️</div>
                          <h3 className="text-xl font-bold text-white">Video Playback Unavailable</h3>
                          <p className="text-gray-400 max-w-md">
                            The embedded player could not load this video. You can still watch it directly on YouTube.
                          </p>
                          <a
                            href={youtubeWatchUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
                          >
                            ▶ Watch on YouTube
                          </a>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-gray-400">Invalid video URL</p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  activeLesson?.pdfUrl && canPreview ? (
                    <div className="w-full h-[600px] flex flex-col bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      {pdfLoading && (
                        <div className="flex-1 flex items-center justify-center">
                          <span className="loading loading-spinner loading-lg text-yellow-400"></span>
                        </div>
                      )}
                      {!pdfLoading && !pdfError && (
                        <iframe
                            src={normalizedPdfUrl}
                            onLoad={() => setPdfLoading(false)}
                            onError={() => setPdfError(true)}
                            className="w-full flex-1 rounded-lg border border-zinc-800 bg-white"
                            title="Document Reader Panel"
                          />
                      )}
                      {pdfError && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-6">
                          <div className="text-5xl">📄</div>
                          <h3 className="text-xl font-bold text-white">PDF Preview Unavailable</h3>
                          <p className="text-gray-400 max-w-md">
                            We couldn't load the preview for this document. You can still view it using the download button below.
                          </p>
                            <a
                              href={normalizedPdfUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded-lg shadow transition"
                            >
                              📥 Download PDF Summary
                            </a>
                        </div>
                      )}
                      {!pdfError && (
                        <div className="mt-4 flex justify-center gap-3">
                            <a
                              href={normalizedPdfUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded-lg shadow gap-2 transition"
                            >
                              📥 Download PDF Summary
                            </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full bg-zinc-950 text-white rounded-xl border border-zinc-800 overflow-hidden">
                      {/* Lesson Brief Header */}
                      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-b border-zinc-800 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                            Creators Hub Academy
                          </span>
                          <span className="bg-zinc-800 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">
                            Lesson Document Summary
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                          {activeLesson?.lessonTitle || "Lesson Document Summary"}
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Module {activeLesson?.moduleNumber || 1}: {activeLesson?.moduleTitle || "Curriculum"} • Lesson {activeLesson?.lessonNumber || 1} ({activeLesson?.duration || "Lecture"})
                        </p>
                      </div>

                      <div className="p-6">
                        {/* Course Brief */}
                        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 mb-6">
                          <h3 className="text-yellow-400 font-bold text-base mb-3 flex items-center gap-2">
                            📌 About This Lesson
                          </h3>
                          <p className="text-gray-300 leading-relaxed">
                            {activeLesson?.lessonDescription || "This lesson provides core principles and step-by-step practical methods for mastering digital skills. Follow along with the video lecture and apply these techniques to build real-world proficiency."}
                          </p>
                        </div>

                        {/* What You'll Learn */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
                            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center text-xs">🎯</span>
                              Core Principles
                            </h4>
                            <ul className="text-xs text-gray-300 space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-yellow-400 mt-0.5">▸</span>
                                Master key concepts and workflows introduced in this video lecture.
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-yellow-400 mt-0.5">▸</span>
                                Apply step-by-step practical techniques demonstrated by the instructor.
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-yellow-400 mt-0.5">▸</span>
                                Observe essential parameters and shortcuts to optimize your results.
                              </li>
                            </ul>
                          </div>

                          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
                            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center text-xs">🛠️</span>
                              Practice Guide
                            </h4>
                            <ul className="text-xs text-gray-300 space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-yellow-400 mt-0.5">▸</span>
                                Replicate the practical exercise directly in your tool/editor.
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-yellow-400 mt-0.5">▸</span>
                                Save project progress and test key shortcuts taught in the video.
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-yellow-400 mt-0.5">▸</span>
                                Utilize the AI Tutor if you need instant answers or explanations.
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Lesson Metadata */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 text-center">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Module</p>
                            <p className="text-white font-bold text-sm">{activeLesson?.moduleNumber || 1}</p>
                          </div>
                          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 text-center">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Lesson</p>
                            <p className="text-white font-bold text-sm">{activeLesson?.lessonNumber || 1}</p>
                          </div>
                          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 text-center">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Duration</p>
                            <p className="text-white font-bold text-sm">{activeLesson?.duration || "Lecture"}</p>
                          </div>
                          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 text-center">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Format</p>
                            <p className="text-yellow-400 font-bold text-sm">Video + PDF</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="border-t border-zinc-800 p-4 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/30">
                        <button
                          onClick={() => window.print()}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xs md:text-sm px-4 py-2.5 rounded-lg transition"
                        >
                          🖨️ Save / Print Summary
                        </button>
                        <button
                          onClick={() => setAiDrawerOpen(true)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg border border-zinc-700 transition"
                        >
                          🤖 Ask AI Tutor for Detailed Notes
                        </button>
                      </div>
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

        {/* Floating AI Assistant Button */}
        <button
          onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
          className="fixed bottom-16 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg z-20 flex items-center gap-2 hover:bg-purple-700 transition"
        >
          🤖 AI Tutor
        </button>

        {/* Floating Course Content Drawer Button (mobile only) */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="md:hidden fixed bottom-4 right-4 bg-yellow-400 text-black p-3 rounded-full shadow-lg z-20"
        >
          📚 Content
        </button>

        {/* AI Assistant Chat Drawer */}
        {aiDrawerOpen && (
          <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-zinc-950 border-l border-zinc-800 flex flex-col z-40 shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
              <h3 className="text-white font-semibold flex items-center gap-2">🤖 AI Course Assistant</h3>
              <button onClick={() => setAiDrawerOpen(false)} aria-label="Close AI assistant" className="text-gray-400 text-xl hover:text-white">&times;</button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    msg.sender === "user" ? "bg-yellow-400 text-black font-medium" : "bg-zinc-900 text-gray-200 border border-zinc-800"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 text-gray-400 p-3 rounded-xl text-sm border border-zinc-800 animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendAiMessage} className="p-3 border-t border-zinc-800 bg-zinc-900 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question about this lesson..."
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400"
              />
              <button type="submit" disabled={aiLoading} className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-500 disabled:opacity-50">
                Send
              </button>
            </form>
          </div>
        )}

        {/* Sidebar as drawer on mobile */}
        <div className={`
          fixed md:static top-0 right-0 h-full w-80 bg-zinc-950 border-l border-zinc-800 overflow-y-auto z-30 transition-transform duration-300
          ${drawerOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-white font-semibold">Course Content</h3>
            <button onClick={() => setDrawerOpen(false)} aria-label="Close course content" className="md:hidden text-gray-400 text-xl">&times;</button>
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
