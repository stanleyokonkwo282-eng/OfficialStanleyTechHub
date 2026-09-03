import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Megaphone,
  CheckCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  EyeOff,
} from "lucide-react";
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 8000,
});

const FALLBACK_ANNOUNCEMENTS = [
  {
    _id: "fallback-1",
    type: "sponsor",
    sponsorName: "PixelCraft Studio",
    title: "50% Off 3D Assets Pack for Creators",
    tagline: "Level up your design workflow",
    description:
      "Get over 500+ commercial-ready 3D icons, rigged characters, and lighting presets at half price this week only.",
    ctaText: "Claim Discount",
    ctaLink: "https://example.com/promo",
    badgeColor: "from-amber-400 to-amber-600",
    dateLabel: "Today",
  },
  {
    _id: "fallback-2",
    type: "update",
    sponsorName: "Creators Hub Academy",
    title: "New Course Dropped: Blender to WebGL",
    tagline: "Platform update & learning track",
    description:
      "Learn how to export interactive 3D assets and render them smoothly inside modern web environments.",
    ctaText: "Start Learning",
    ctaLink: "/courses",
    badgeColor: "from-amber-300 to-amber-500",
    dateLabel: "Yesterday",
  },
  {
    _id: "fallback-3",
    type: "ad",
    sponsorName: "MicDrop Audio Gear",
    title: "The Ultimate Creator Microphone",
    tagline: "Studio quality sound for streams & podcasts",
    description:
      "Clean noise-cancellation with zero latency. Exclusive 20% discount for all Creators Hub Academy members.",
    ctaText: "View Product",
    ctaLink: "https://example.com/gear",
    badgeColor: "from-amber-400 to-orange-500",
    dateLabel: "2 days ago",
  },
  {
    _id: "fallback-4",
    type: "update",
    sponsorName: "Creators Hub Academy",
    title: "Office Hours: Live Q&A with Stanley",
    tagline: "Weekly community session",
    description:
      "Join our founder this Saturday for a live mentor session. Ask anything about freelancing, course creation, or building a digital business.",
    ctaText: "Join the Session",
    ctaLink: "/about",
    badgeColor: "from-amber-300 to-amber-500",
    dateLabel: "3 days ago",
  },
];

const STORAGE_KEY = "cha_read_announcements";

function getReadIds() {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function saveReadIds(ids) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota errors
  }
}

function formatDate(d) {
  if (!d) return "";
  try {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function AdsNotificationCenter() {
  const [readIds, setReadIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setReadIds(getReadIds());
    setHydrated(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["active-broadcasts"],
    queryFn: async () => {
      const res = await axiosPublic.get("/broadcasts/active");
      return res.data?.data || [];
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const announcements = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item) => ({
        _id: item._id,
        type: item.type || "update",
        sponsorName: item.sponsorName || "",
        title: item.title || "",
        tagline: item.tagline || "",
        description: item.description || "",
        ctaText: item.ctaText || "Learn More",
        ctaLink: item.ctaLink || "#",
        badgeColor: item.badgeColor || "from-amber-400 to-amber-600",
        dateLabel: formatDate(item.createdAt),
      }));
    }
    return FALLBACK_ANNOUNCEMENTS;
  }, [data]);

  const markAsRead = (id) => {
    if (readIds.includes(id)) return;
    const updated = [...readIds, id];
    setReadIds(updated);
    saveReadIds(updated);
  };

  const markAllAsRead = () => {
    const allIds = announcements.map((c) => c._id);
    setReadIds(allIds);
    saveReadIds(allIds);
  };

  const displayedList = announcements.filter((item) => {
    if (filter === "unread") return !readIds.includes(item._id);
    return true;
  });

  const safeIndex = Math.min(currentIndex, Math.max(displayedList.length - 1, 0));
  const activeItem = displayedList[safeIndex] || displayedList[0];
  const unreadCount = announcements.filter((c) => !readIds.includes(c._id)).length;

  const goPrev = () => {
    if (displayedList.length === 0) return;
    setCurrentIndex((i) => (i - 1 + displayedList.length) % displayedList.length);
  };
  const goNext = () => {
    if (displayedList.length === 0) return;
    setCurrentIndex((i) => (i + 1) % displayedList.length);
  };

  const isUnreadForActive = activeItem
    ? !readIds.includes(activeItem._id)
    : false;

  if (!hydrated) {
    return (
      <section className="relative w-full max-w-5xl mx-auto my-10 p-6 md:p-8 rounded-3xl bg-zinc-900/80 border border-amber-400/15 backdrop-blur-xl shadow-2xl text-white">
        <div className="py-12 text-center text-neutral-500 text-sm">
          Loading announcements…
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full max-w-5xl mx-auto my-10 p-6 md:p-8 rounded-3xl bg-zinc-900/80 border border-amber-400/15 backdrop-blur-xl shadow-2xl text-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
            <Megaphone className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Broadcast & Sponsored Hub
            </h2>
            <p className="text-xs text-neutral-400">
              {isLoading
                ? "Refreshing live feed…"
                : "Daily news, creator product discounts, and updates"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-black p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => {
                setFilter("all");
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-amber-400 text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              All ({announcements.length})
            </button>
            <button
              onClick={() => {
                setFilter("unread");
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === "unread"
                  ? "bg-amber-400 text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {displayedList.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
          <EyeOff className="w-10 h-10 text-neutral-500" />
          <h3 className="text-lg font-semibold text-neutral-300">All caught up!</h3>
          <p className="text-xs text-neutral-500 max-w-sm">
            You have marked all sponsored promotions and updates as read.
          </p>
          <button
            onClick={() => setFilter("all")}
            className="text-xs text-amber-400 underline underline-offset-4 hover:text-amber-300"
          >
            View past announcements
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 relative p-6 md:p-8 rounded-2xl bg-gradient-to-b from-zinc-800/50 to-black/60 border border-white/10 flex flex-col justify-between overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${activeItem.badgeColor} text-black`}
                >
                  {activeItem.type === "sponsor"
                    ? `Sponsored • ${activeItem.sponsorName}`
                    : "Academy Notice"}
                </span>

                <div className="flex items-center gap-2">
                  {activeItem.dateLabel && (
                    <span className="text-xs text-neutral-400">
                      {activeItem.dateLabel}
                    </span>
                  )}
                  {isUnreadForActive ? (
                    <span
                      className="w-2 h-2 rounded-full bg-rose-500"
                      title="Unread"
                    />
                  ) : (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-0.5">
                      <CheckCheck className="w-3 h-3" /> Read
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1">
                  {activeItem.tagline}
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-white">
                  {activeItem.title}
                </h3>
              </div>

              <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
                {activeItem.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goNext}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
                  aria-label="Next announcement"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-neutral-500 ml-1">
                  {safeIndex + 1} / {displayedList.length}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {!readIds.includes(activeItem._id) && (
                  <button
                    onClick={() => markAsRead(activeItem._id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 transition"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
                    Mark as read
                  </button>
                )}
                <a
                  href={activeItem.ctaLink}
                  target={activeItem.ctaLink.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  onClick={() => markAsRead(activeItem._id)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wide transition shadow-lg shadow-amber-500/20"
                >
                  {activeItem.ctaText} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">
              Active Feeds
            </p>
            <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
              {displayedList.map((item, idx) => {
                const isRead = readIds.includes(item._id);
                const isSelected = activeItem._id === item._id;

                return (
                  <button
                    key={item._id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-amber-400/10 border-amber-400/50"
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">
                        {item.type}
                      </span>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-white line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {item.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
