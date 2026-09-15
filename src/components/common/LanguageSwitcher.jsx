import { useEffect, useRef, useState } from "react";
import { FaGlobe, FaChevronDown, FaCheck } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  Language list — Google Translate supports all of these out of the  */
/*  box. Ordered by relevance to a Nigerian + global LMS audience.      */
/* ------------------------------------------------------------------ */
const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français (French)", flag: "🇫🇷" },
  { code: "ha", label: "Hausa", flag: "🇳🇬" },
  { code: "ig", label: "Igbo", flag: "🇳🇬" },
  { code: "yo", label: "Yoruba", flag: "🇳🇬" },
  { code: "ar", label: "العربية (Arabic)", flag: "🇸🇦" },
  { code: "es", label: "Español (Spanish)", flag: "🇪🇸" },
  { code: "pt", label: "Português (Portuguese)", flag: "🇵🇹" },
  { code: "de", label: "Deutsch (German)", flag: "🇩🇪" },
  { code: "it", label: "Italiano (Italian)", flag: "🇮🇹" },
  { code: "zh-CN", label: "中文 (Chinese)", flag: "🇨🇳" },
  { code: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
  { code: "am", label: "አማርኛ (Amharic)", flag: "🇪🇹" },
  { code: "nl", label: "Nederlands (Dutch)", flag: "🇳🇱" },
];

const COOKIE_KEY = "googtrans";
const STORAGE_KEY = "chub_language";

/* Read the active language from the googtrans cookie (/en/xx format). */
const readActiveLang = () => {
  try {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "en";
  } catch {
    return "en";
  }
};

/* Persist the choice the way Google Translate expects, then apply it. */
const applyLanguage = (code) => {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* private mode — cookie below is the source of truth anyway */
  }
  const value = code === "en" ? "/en/en" : `/en/${code}`;
  const host = window.location.hostname;
  // Root-path cookies so the setting applies site-wide.
  document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
  try {
    // Domain cookie so it also sticks on sub-paths served across hosts.
    document.cookie = `${COOKIE_KEY}=${value}; domain=${host}; path=/; max-age=${60 * 60 * 24 * 365}`;
  } catch {
    /* some hosts reject domain cookies — root cookie above is enough */
  }
  window.location.reload();
};

let scriptPromise = null;
const loadTranslateScript = () => {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    if (window.google?.translate?.TranslateElement) {
      resolve();
      return;
    }
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "chub-google-translate"
        );
      } catch {
        /* widget init is best-effort; cookie alone still translates on reload */
      }
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.defer = true;
    script.onerror = () => resolve(); // offline CDN — dropdown still sets cookie
    document.body.appendChild(script);
  });
  return scriptPromise;
};

export default function LanguageSwitcher({ variant = "navbar" }) {
  const [active, setActive] = useState("en");
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    setActive(readActiveLang());
    loadTranslateScript();
  }, []);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  const current = LANGUAGES.find((l) => l.code === active) || LANGUAGES[0];
  const isFooter = variant === "footer";

  return (
    <div ref={rootRef} className={`relative ${isFooter ? "" : "hidden md:block"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        title="Change language / Changer de langue"
        className={
          isFooter
            ? "inline-flex items-center gap-1.5 text-zinc-400 hover:text-yellow-400 transition-colors underline underline-offset-2 text-sm"
            : "flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-semibold text-gray-200 hover:border-yellow-400/60 hover:text-yellow-400 transition-colors"
        }
      >
        <FaGlobe className={isFooter ? "h-3.5 w-3.5 text-zinc-600" : "text-yellow-400 text-sm"} />
        <span>
          {current.flag} {current.code === "en" ? (isFooter ? "English" : "EN") : current.label.split(" ")[0]}
        </span>
        <FaChevronDown className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className={`absolute z-[60] max-h-72 w-56 overflow-y-auto rounded-xl border border-zinc-700/80 bg-zinc-950/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-md animate-fadeIn ${
            isFooter ? "bottom-full mb-2 left-1/2 -translate-x-1/2" : "right-0 mt-2"
          }`}
        >
          <p className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Choose language
          </p>
          {LANGUAGES.map((lang) => {
            const selected = lang.code === active;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setOpen(false);
                  if (!selected) applyLanguage(lang.code);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                  selected
                    ? "bg-yellow-400/10 text-yellow-400 font-semibold"
                    : "text-gray-200 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span className="flex-1">{lang.label}</span>
                {selected && <FaCheck className="text-xs" />}
              </button>
            );
          })}
          <p className="px-2.5 py-1.5 text-[10px] leading-relaxed text-zinc-600">
            Powered by Google Translate — page text updates instantly.
          </p>
        </div>
      )}
    </div>
  );
}

export { STORAGE_KEY };


