import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { Cookie, ShieldCheck, X, RotateCcw } from "lucide-react";
import {
  CATEGORY_META,
  OPEN_SETTINGS_EVENT,
  acceptAll,
  getConsent,
  rejectAll,
  resetConsent,
  saveConsent,
} from "../../utils/cookieConsent";

const TOGGLE_ORDER = ["preferences", "analytics", "marketing"];

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [prefs, setPrefs] = useState({ preferences: true, analytics: false, marketing: false });

  useEffect(() => {
    let timer = null;
    if (!getConsent()) timer = setTimeout(() => setVisible(true), 1200);
    const openSettings = () => {
      const c = getConsent();
      if (c) setPrefs({ preferences: !!c.preferences, analytics: !!c.analytics, marketing: !!c.marketing });
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
    };
  }, []);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      setLeaving(false);
      setShowSettings(false);
    }, 300);
  }, []);

  if (!visible) return null;
  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));
  const onAccept = () => { acceptAll(); dismiss(); };
  const onReject = () => {
    rejectAll();
    setPrefs({ preferences: false, analytics: false, marketing: false });
    dismiss();
  };
  const onSave = () => { saveConsent(prefs); dismiss(); };
  const onReset = () => {
    resetConsent();
    setPrefs({ preferences: false, analytics: false, marketing: false });
    setShowSettings(true);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={`fixed z-[90] inset-x-0 bottom-0 px-3 pb-3 sm:px-6 sm:pb-6 transition-all duration-300 ${
        leaving ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950/95 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/30">
              <Cookie className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-amber-400 sm:hidden" />
                  We value your privacy
                </h2>
                <button onClick={onReject} aria-label="Dismiss and reject optional cookies" className="rounded-lg p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                We use cookies to keep you logged in, remember your theme and progress, and
                (with your permission) understand how learners use the Academy. Read our{" "}
                <Link to="/privacy-policy" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">Privacy Policy</Link>
                {" "}and{" "}
                <Link to="/cookie-policy" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">Cookie Policy</Link>.
              </p>
              {showSettings && (
                <div className="mt-4 space-y-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 bg-zinc-800/50">
                    <div>
                      <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-green-400" />
                        {CATEGORY_META.necessary.label}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">{CATEGORY_META.necessary.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-green-500/15 border border-green-500/40 px-2.5 py-1 text-[11px] font-bold text-green-400">ALWAYS ON</span>
                  </div>
                  {TOGGLE_ORDER.map((key) => (
                    <div key={key} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-zinc-800/40 transition">
                      <div>
                        <p className="text-sm font-semibold text-white">{CATEGORY_META[key].label}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{CATEGORY_META[key].description}</p>
                      </div>
                      <button role="switch" aria-checked={prefs[key]} aria-label={`${CATEGORY_META[key].label} cookies`} onClick={() => toggle(key)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${prefs[key] ? "bg-amber-400" : "bg-zinc-700"}`}>
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${prefs[key] ? "left-[22px]" : "left-0.5"}`} />
                      </button>
                    </div>
                  ))}
                  <button onClick={onReset} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition px-1 pt-1">
                    <RotateCcw className="h-3 w-3" /> Reset my choice (ask again next visit)
                  </button>
                </div>
              )}
              <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center gap-2">
                {showSettings ? (
                  <>
                    <button onClick={onSave} className="flex-1 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-300 transition">Save my choices</button>
                    <button onClick={onAccept} className="flex-1 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:border-amber-400/60 hover:text-white transition">Accept all</button>
                  </>
                ) : (
                  <>
                    <button onClick={onAccept} className="flex-1 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-300 transition">Accept all</button>
                    <button onClick={onReject} className="flex-1 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition">Reject all</button>
                    <button onClick={() => setShowSettings(true)} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition">Customize</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
