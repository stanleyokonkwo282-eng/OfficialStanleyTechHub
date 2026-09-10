import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

export default function StudentChatForum() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activePeer, setActivePeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [points, setPoints] = useState(user?.points ?? 200);
  const [unlimitedChat, setUnlimitedChat] = useState(user?.role === "admin");
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const localVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const callStartTimeRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const lastReadCountRef = useRef(0);
  const [jumpToBottomVisible, setJumpToBottomVisible] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 🔧 FIX: Only auto-scroll when the user is already near the bottom.
  // If they've scrolled up to read old messages, show a "jump to bottom"
  // button instead of yanking the view back down on every new message.
  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom();
      lastReadCountRef.current = messages.length;
    } else if (messages.length > lastReadCountRef.current) {
      setJumpToBottomVisible(true);
    }
  }, [messages]);

  useEffect(() => {
    const verifyTopup = async () => {
      if (searchParams.get("topup") !== "success") return;
      const reference = searchParams.get("reference");
      if (!reference) return;

      setTopupLoading(true);
      try {
        const res = await axiosSecure.get(`/forum/topup/verify/${reference}`);
        setPoints(res.data.newBalance);
        setSuccessMessage(res.data.message || "Chat points added successfully.");
      } catch (err) {
        setErrorMessage(err.response?.data?.error || err.response?.data?.message || "Could not verify payment.");
      } finally {
        setTopupLoading(false);
      }
    };
    verifyTopup();
  }, [searchParams, axiosSecure]);

  const copyReferral = async () => {
    const referralCode = user?.referralCode || (user?.name || "CHA").slice(0, 3).toUpperCase() + "100";
    const referralLink = `${window.location.origin}/signup?ref=${encodeURIComponent(referralCode)}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMessage("Failed to copy referral link.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get(`/forum/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data?.data || []);
      } catch (err) {
        setErrorMessage(err.response?.data?.error || "Failed to search users.");
      }
    };
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, axiosSecure]);

  useEffect(() => {
    if (!activePeer) return;
    let isCancelled = false;
    const loadConversation = async () => {
      try {
        setErrorMessage("");
        const res = await axiosSecure.get(`/forum/history/${activePeer._id}`);
        if (isCancelled) return;
        const fetched = res.data?.data || [];
        // Only update state when there are genuinely newer messages,
        // to avoid triggering the scroll effect on every poll tick.
        setMessages((prev) => {
          if (prev.length === fetched.length) {
            const same = prev.every((m, i) => m._id === fetched[i]?._id);
            if (same) return prev;
          }
          return fetched;
        });
        if (res.data?.points !== undefined) setPoints(res.data.points);
        if (res.data?.unlimitedChat !== undefined) setUnlimitedChat(!!res.data.unlimitedChat);
      } catch (err) {
        if (!isCancelled) setErrorMessage(err.response?.data?.error || "Failed to load messages.");
      }
    };
    loadConversation();
    // 🔧 FIX: Poll for new messages every 5 seconds so that both
    //           conversation participants see incoming messages in
    //           near-real-time without switching peers or reloading.
    const interval = setInterval(loadConversation, 5000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [activePeer, axiosSecure]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activePeer) return;
    if (!unlimitedChat && points < 1) {
      setShowTopUpModal(true);
      return;
    }
    try {
      setErrorMessage("");
      const res = await axiosSecure.post("/forum/message", {
        receiverId: activePeer._id,
        content: inputMsg,
        messageType: "text",
      });
      setMessages((prev) => [...prev, {
        sender: res.data.message.sender._id,
        content: inputMsg,
        messageType: "text",
        createdAt: new Date(),
      }]);
      if (res.data?.remainingPoints !== undefined) setPoints(res.data.remainingPoints);
      if (res.data?.unlimitedChat !== undefined) setUnlimitedChat(!!res.data.unlimitedChat);
      setInputMsg("");
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to send message.");
    }
  };

  const startRecordingAudio = async () => {
    try {
      setErrorMessage("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          if (!unlimitedChat && points < 5) {
            setShowTopUpModal(true);
            return;
          }
          try {
            const res = await axiosSecure.post("/forum/message", {
              receiverId: activePeer._id,
              content: base64Audio,
              messageType: "audio",
            });
            setMessages((prev) => [...prev, {
              sender: res.data.message.sender._id,
              content: base64Audio,
              messageType: "audio",
              createdAt: new Date(),
            }]);
            if (res.data?.remainingPoints !== undefined) setPoints(res.data.remainingPoints);
            if (res.data?.unlimitedChat !== undefined) setUnlimitedChat(!!res.data.unlimitedChat);
          } catch (err) {
            setErrorMessage(err.response?.data?.error || "Failed to send audio note.");
          }
        };
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch {
      setErrorMessage("Microphone access denied. Please allow microphone permissions in your browser.");
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleVideoCall = async () => {
    if (isVideoActive) {
      // Stop the local camera preview first.
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      setIsVideoActive(false);

      // Deduct the video-call cost (20 pts/min; free for unlimited plans) based on elapsed minutes.
      if (activePeer && callStartTimeRef.current) {
        const minutes = Math.max(1, Math.ceil((Date.now() - callStartTimeRef.current) / 60000));
        try {
          const res = await axiosSecure.post("/forum/call/deduct", {
            minutes,
            callType: "video",
            receiverId: activePeer._id,
          });
          if (res.data?.remainingPoints !== undefined) setPoints(res.data.remainingPoints);
          if (res.data?.unlimitedChat !== undefined) setUnlimitedChat(!!res.data.unlimitedChat);
        } catch (err) {
          setErrorMessage(err.response?.data?.error || "Failed to deduct video call points.");
        }
        callStartTimeRef.current = null;
      }
    } else {
      if (!unlimitedChat && points < 20) {
        setShowTopUpModal(true);
        setErrorMessage("You need at least 20 chat points to start a video call.");
        return;
      }
      try {
        setErrorMessage("");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;
        setIsVideoActive(true);
        callStartTimeRef.current = Date.now();
        setTimeout(() => {
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        }, 100);
      } catch {
        setErrorMessage("Camera access denied. Please enable camera permissions in your browser.");
      }
    }
  };

  const handleTopup = async (tier) => {
    setTopupLoading(true);
    setErrorMessage("");
    try {
      const res = await axiosSecure.post("/forum/topup-initialize", { packageTier: tier });
      if (res.data?.authorization_url) {
        window.location.href = res.data.authorization_url;
      } else {
        throw new Error("No redirect URL received.");
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Could not initialize Paystack payment.");
    } finally {
      setTopupLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-[#07090e] text-white flex flex-col md:flex-row rounded-3xl overflow-hidden border border-white/10 m-2 sm:m-4 shadow-2xl relative">
      {errorMessage && (
        <div className="absolute top-0 inset-x-0 z-50 bg-rose-600/95 text-white text-xs font-bold py-2.5 px-4 flex items-center justify-between shadow-lg">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="text-white hover:opacity-75">✕</button>
        </div>
      )}
      {successMessage && (
        <div className="absolute top-0 inset-x-0 z-50 bg-emerald-600/95 text-white text-xs font-bold py-2.5 px-4 flex items-center justify-between shadow-lg">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} className="text-white hover:opacity-75">✕</button>
        </div>
      )}

      <div className="w-full md:w-80 bg-[#0d121d] border-r border-white/10 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Your Chat Balance</span>
            {unlimitedChat ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500 text-zinc-950 flex items-center gap-1">∞ Unlimited</span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-zinc-950 flex items-center gap-1">{points} Pts</span>
            )}
          </div>
          {unlimitedChat ? (
            <p className="text-[11px] text-emerald-400 font-semibold mt-2">Unlimited chat, voice notes &amp; video calls included in your plan.</p>
          ) : (
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowTopUpModal(true)} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-xs text-zinc-950">Top Up Points</button>
              <button onClick={copyReferral} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-bold text-xs">{copied ? "Copied" : "Invite"}</button>
            </div>
          )}
        </div>
        <div className="p-3 border-b border-white/10">
          <input
            type="text"
            placeholder="Search students or teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {searchResults.length > 0 ? (
            searchResults.map((peer) => (
              <div
                key={peer._id}
                onClick={() => setActivePeer(peer)}
                className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition ${activePeer?._id === peer._id ? "bg-amber-500/20 border border-amber-500/40 text-white" : "hover:bg-white/5 text-zinc-300"}`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Link
                    to={`/dashboard/profile/${peer._id}`}
                    onClick={(e) => e.stopPropagation()}
                    title={`View ${peer.name || "member"} profile`}
                  >
                    {peer.photoURL ? (
                      <img src={peer.photoURL} alt={peer.name} className="w-8 h-8 rounded-full object-cover border border-cyan-500/40 hover:border-amber-400" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-black flex items-center justify-center text-xs shrink-0 hover:border-amber-400">{peer.name?.[0]?.toUpperCase() || "U"}</div>
                    )}
                  </Link>
                  <div className="truncate">
                    <h4 className="text-xs font-bold truncate">{peer.name}</h4>
                    <span className="text-[10px] text-zinc-400 capitalize">{peer.role || "Student"}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-zinc-500">Type a name in the search box to find fellow academy members.</div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#07090e]">
        {activePeer ? (
          <>
            <div className="h-16 border-b border-white/10 bg-[#0d121d] px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to={`/dashboard/profile/${activePeer._id}`}
                  title={`View ${activePeer.name || "member"} profile`}
                >
                  <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-black flex items-center justify-center text-sm hover:border-amber-400">
                    {activePeer.photoURL ? (
                      <img src={activePeer.photoURL} alt={activePeer.name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      activePeer.name?.[0]?.toUpperCase()
                    )}
                  </div>
                </Link>
                <div>
                  <Link to={`/dashboard/profile/${activePeer._id}`} className="hover:text-amber-400">
                    <h3 className="text-sm font-bold text-white leading-tight">{activePeer.name}</h3>
                  </Link>
                  <span className="text-[10px] text-emerald-400 font-semibold">• Active Peer</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={toggleVideoCall} className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${isVideoActive ? "bg-rose-500/20 border-rose-500/50 text-rose-400" : "bg-zinc-800 hover:bg-zinc-700 border-white/10 text-zinc-300"}`}>
                  {isVideoActive ? "Close Camera" : "Camera"}
                </button>
              </div>
            </div>

            {isVideoActive && (
              <div className="h-56 sm:h-64 bg-zinc-950 border-b border-white/10 p-3 flex gap-3 items-center justify-center relative">
                <div className="w-full sm:w-80 h-full bg-zinc-900 rounded-2xl border border-cyan-500/30 overflow-hidden relative shadow-lg">
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-cyan-400">Your Camera</span>
                </div>
              </div>
            )}

            <div
              ref={messagesContainerRef}
              onScroll={() => {
                const container = messagesContainerRef.current;
                if (!container) return;
                const threshold = 80;
                isAtBottomRef.current =
                  container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
                if (isAtBottomRef.current) {
                  lastReadCountRef.current = messages.length;
                  setJumpToBottomVisible(false);
                }
              }}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              <div className="text-center text-[10px] text-zinc-500 my-1">{unlimitedChat ? "🔓 Unlimited plan • free messaging, voice & video" : "🔒 Direct peer-to-peer session • 1 Pt/text • 5 Pts/audio"}</div>
              {messages.map((m, idx) => {
                const isMe = m.sender === (user?._id || "me") || m.sender === user?._id;
                return (
                  <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs ${isMe ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-medium" : "bg-zinc-800 text-white border border-white/10"}`}>
                      {m.messageType === "audio" ? (
                        <div className="flex items-center gap-2">
                          <audio src={m.content} controls className="h-8 max-w-[200px]" />
                        </div>
                      ) : (
                        <span>{m.content}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-[#0d121d] border-t border-white/10 flex items-center gap-2">
              <button type="button" onClick={isRecording ? stopRecordingAudio : startRecordingAudio} className={`p-2.5 rounded-xl border transition ${isRecording ? "bg-rose-500 text-white border-rose-600 animate-pulse" : "bg-zinc-800 hover:bg-zinc-700 text-cyan-400 border-white/10"}`} title={isRecording ? "Click to finish and send audio note" : "Hold/Click to record audio note"}>
                {isRecording ? "Stop" : "Mic"}
              </button>
              <input type="text" placeholder={isRecording ? "Recording audio voice note..." : unlimitedChat ? "Type message (free)..." : "Type message (1 pt)..."} disabled={isRecording} value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 disabled:opacity-50" />
              <button type="submit" disabled={isRecording || !inputMsg.trim()} className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition disabled:opacity-40 shadow-lg shadow-amber-500/20">Send</button>
            </form>
            {jumpToBottomVisible && (
              <button
                onClick={() => {
                  scrollToBottom();
                  setJumpToBottomVisible(false);
                }}
                className="fixed bottom-24 right-6 z-50 p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-xl shadow-amber-500/30 transition transform hover:scale-110"
                title="New messages — click to jump to latest"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
            <h3 className="text-sm font-bold text-zinc-300">No Conversation Selected</h3>
            <p className="text-xs max-w-sm mt-1">Select a student or instructor from the left list to start messaging, sending voice notes, or opening camera sessions.</p>
          </div>
        )}
      </div>

      {showTopUpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0d121d] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setShowTopUpModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">✕</button>
            <h3 className="text-lg font-black text-white text-center">Top Up Chat Points</h3>
            <p className="text-xs text-zinc-400 text-center mt-1 mb-6">Instant activation via Paystack card or bank transfer.</p>
            <div className="space-y-3">
              <div onClick={() => !topupLoading && handleTopup("starter")} className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-between cursor-pointer transition hover:border-amber-500/40">
                <div><h4 className="text-sm font-bold text-white">Starter Pack</h4><p className="text-[11px] text-zinc-400">200 Points</p></div>
                <span className="font-extrabold text-amber-400 text-sm">₦1,000</span>
              </div>
              <div onClick={() => !topupLoading && handleTopup("pro")} className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 flex items-center justify-between cursor-pointer transition hover:border-amber-500">
                <div><h4 className="text-sm font-bold text-white">Pro Community Pack</h4><p className="text-[11px] text-zinc-400">600 Points</p></div>
                <span className="font-extrabold text-amber-400 text-sm">₦2,500</span>
              </div>
              <div onClick={() => !topupLoading && handleTopup("elite")} className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-between cursor-pointer transition hover:border-amber-500/40">
                <div><h4 className="text-sm font-bold text-white">Elite Networker Pack</h4><p className="text-[11px] text-zinc-400">1,500 Points</p></div>
                <span className="font-extrabold text-amber-400 text-sm">₦5,000</span>
              </div>
            </div>
            {topupLoading && <div className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-400"><span>Connecting to Paystack gateway...</span></div>}
          </div>
        </div>
      )}
    </div>
  );
}
