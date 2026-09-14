/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export function buildOfflineReply(question, lessons, courseTitle) {
  const q = String(question || "").toLowerCase();
  const flat = (lessons || [])
    .flatMap((m) =>
      (m.lessons || m.items || []).map((l) => ({
        module: m.moduleTitle || m.title || "",
        title: l.lessonTitle || l.title || "",
        desc: l.lessonDescription || l.description || "",
      }))
    )
    .filter((l) => l.title || l.desc);
  const words = q.split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  const scored = flat
    .map((l) => {
      const hay = `${l.module} ${l.title} ${l.desc}`.toLowerCase();
      let score = 0;
      words.forEach((w) => { if (hay.includes(w)) score += 1; });
      return { ...l, score };
    })
    .filter((l) => l.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  if (scored.length > 0) {
    const bullets = scored
      .map((l) => `~ ${l.title}${l.module ? ` (${l.module})` : ""}`)
      .join("\n");
    return `The AI tutor is temporarily unavailable, but "${courseTitle || "your course"}" covers this:\n${bullets}\nOpen the matching lesson from the sidebar — and retry the AI in a few minutes.`;
  }
  return `The AI tutor is temporarily unavailable (backend AI quota or connection issue). Your course "${courseTitle || "this course"}" still works normally — keep reading, then retry the AI shortly.`;
}

export default function AiAssistant(props) {
  const { courseId, courseTitle, lessonId } = props;
  const lessonTitle = props.lessonTitle || "General";
  const lessonDescription = props.lessonDescription || "";
  const lessonsForFallback = props.lessonsForFallback || [];
  const offset = props.floatingOffsetClass || "bottom-24 md:bottom-6";
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I'm your AI Course Assistant. Ask me anything about this lesson or course!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendDown, setBackendDown] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const endRef = useRef(null);
  const lessonKey = lessonId || lessonTitle || "general";
  const headLabel = backendDown ? "AI offline - course help" : loading ? "Thinking..." : "AI Course Assistant";

  const doSend = async (text, isRetry) => {
    setMessages((prev) => [...prev, { sender: "user", text: isRetry ? `${text} (retry)` : text }]);
    setLoading(true);
    try {
      const res = await axiosSecure.post("/ai/chat", {
        prompt: text,
        lessonTitle,
        lessonDescription,
        courseId,
        lessonId,
        studentEmail: user?.email,
      });
      if (res.data?.error === true) {
        const err = new Error(res.data.reply || "AI backend soft error");
        err.isBackendSoftError = true;
        throw err;
      }
      setMessages((prev) => [...prev, { sender: "ai", text: res.data.reply }]);
      setBackendDown(false);
      setRetryCount(0);
    } catch (error) {
      const status = error?.response?.status;
      const raw = `${error?.response?.data?.error || error?.response?.data?.message || error?.message || ""}`.toLowerCase();
      const isQuota = error?.isBackendSoftError || status === 429 || /quota|rate limit|resource_exhausted|high traffic/.test(raw);
      setBackendDown(true);
      const attempts = retryCount + 1;
      setRetryCount(attempts);
      const canRetry = attempts < 3;
      const header = isQuota
        ? "The AI service is rate-limited right now (Gemini free-tier quota). Your course content is unaffected."
        : "I can't reach the AI service right now (connection issue). Your course content is unaffected.";
      const offline = buildOfflineReply(text, lessonsForFallback, courseTitle || "");
      setMessages((prev) => [...prev, {
        sender: "ai",
        text: `${header}\n${offline}${canRetry ? "\n\nTap Retry to try the AI again." : "\n\nRetry limit reached - wait a few minutes, then ask again."}`,
        retryable: canRetry,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (loading) return;
    const text = input.trim();
    if (!text) return;
    setInput("");
    doSend(text, false);
  };

  const onRetry = () => {
    if (loading) return;
    const rev = [...messages].reverse();
    const lastUser = rev.find((m) => m.sender === "user");
    let text = lastUser ? String(lastUser.text || "").replace(/ \(retry\)$/, "") : "";
    if (!text) return;
    doSend(text, true);
  };

  const { data: historyData } = useQuery({
    queryKey: ["ai-chat-history", courseId, lessonKey, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/ai/chat-history/${courseId}/${lessonId}/${user?.email}`);
      return res.data;
    },
    enabled: !!courseId && !!lessonId && !!user?.email,
    retry: false,
  });

  useEffect(() => {
    const saved = historyData?.messages;
    if (saved?.length > 0) setMessages(saved.map((m) => ({ sender: m.sender, text: m.text })));
    else setMessages([{ sender: "ai", text: "Hello! I'm your AI Course Assistant. Ask me anything about this lesson or course!" }]);
    setBackendDown(false);
    setRetryCount(0);
  }, [lessonKey, historyData]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  return (
    <>
      <div className={`fixed right-4 z-40 ${offset}`}>
        <button onClick={() => setOpen(true)} aria-label="Open AI Tutor" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/10 text-white font-bold text-xs shadow backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] active:scale-95">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-purple-100">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>AI Tutor</span>
          {backendDown && <span className="h-2 w-2 rounded-full bg-amber-400" title="AI backend unreachable" />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-y-3 right-3 z-50 flex w-[92vw] max-w-md flex-col overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/90 backdrop-blur-2xl sm:inset-y-6 sm:right-6">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3.5">
            <div className="flex items-center gap-2 text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm">AI</span>
              <div>
                <h3 className="font-semibold text-sm leading-tight">{headLabel}</h3>
                {backendDown && <p className="text-[11px] text-amber-300/90">Course-based help until AI recovers</p>}
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close AI assistant" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-gray-300 hover:bg-white/10 hover:text-white">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 p-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-lg whitespace-pre-line ${msg.sender === "user" ? "bg-gradient-to-r from-yellow-300 to-amber-400 text-black font-medium" : "border border-white/10 bg-white/5 text-gray-100"}`}>
                  {msg.text}
                  {msg.sender === "ai" && msg.retryable && !loading && (
                    <button onClick={onRetry} className="mt-2 block rounded-lg border border-amber-400/40 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-400/10 transition">Retry AI</button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">Thinking...</div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={onSubmit} className="flex gap-2 border-t border-white/10 bg-zinc-950/80 p-3">
            <input type="text" value={input} onChange={(ev) => setInput(ev.target.value)} placeholder="Ask a question about this lesson..." className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-yellow-400 focus:outline-none" />
            <button type="submit" disabled={loading} className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50">Send</button>
          </form>
        </div>
      )}
    </>
  );
}
