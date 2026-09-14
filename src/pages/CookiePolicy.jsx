import HeadTag from "../components/common/HeadTag";
import { Cookie, ShieldCheck, Settings2 } from "lucide-react";
import { CATEGORY_META, getConsent, openCookieSettings } from "../utils/cookieConsent";
import { useState } from "react";

const TABLE_ROWS = [
  { name: "cha_cookie_consent_v1", purpose: "Remembers your cookie choice (necessary)", expiry: "Persistent", category: "Strictly Necessary" },
  { name: "Firebase auth session", purpose: "Keeps you logged in securely", expiry: "Session", category: "Strictly Necessary" },
  { name: "cha_theme", purpose: "Remembers dark / light mode", expiry: "Persistent", category: "Preferences" },
  { name: "cha_sound_enabled", purpose: "Remembers notification-sound toggle", expiry: "Persistent", category: "Preferences" },
  { name: "chub_remember_email", purpose: "Pre-fills your login email (Remember me)", expiry: "Persistent", category: "Preferences" },
  { name: "cha_last_memory", purpose: "Resume where you left off in a course", expiry: "Persistent", category: "Preferences" },
  { name: "chub_portfolioLink_events", purpose: "Counts portfolio page views / clicks", expiry: "Persistent", category: "Analytics" },
  { name: "YouTube (youtube-nocookie)", purpose: "Plays lesson videos privacy-enhanced", expiry: "Session", category: "Analytics" },
];

export default function CookiePolicy() {
  const [consent] = useState(() => getConsent());
  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <HeadTag title="Cookie Policy | Creators Hub Academy" />
        <p className="flex items-center gap-2 text-amber-400 text-sm font-bold tracking-wide uppercase">
          <Cookie className="h-4 w-4" /> Transparency first
        </p>
        <h1 className="text-4xl font-black text-white mt-2 mb-2">Cookie Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: September 2026 · Governed by the laws of the Federal Republic of Nigeria (NDPR).</p>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-400" /> 1. What this covers
            </h2>
            <p>Creators Hub Academy (operated by Stanley Chukwunonso Okonkwo, Lagos, Nigeria — support@creatorshubacademy.com) uses cookies and local storage to run the learning platform, remember your preferences, and — only with your permission — understand usage.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">2. Categories we use</h2>
            <ul className="space-y-2">
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <li key={key} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="font-bold text-white">{meta.label}{meta.locked ? " · always on" : ""}</p>
                  <p className="text-sm text-gray-400 mt-1">{meta.description}</p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">3. Cookies & storage on this site</h2>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-900 text-left text-zinc-300">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3">Expiry</th>
                    <th className="px-4 py-3">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((r) => (
                    <tr key={r.name} className="border-t border-zinc-800 text-gray-300">
                      <td className="px-4 py-3 font-mono text-xs text-amber-300">{r.name}</td>
                      <td className="px-4 py-3">{r.purpose}</td>
                      <td className="px-4 py-3">{r.expiry}</td>
                      <td className="px-4 py-3">{r.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">4. Your current choice</h2>
            <p className="text-sm">
              {consent
                ? `Saved on ${new Date(consent.updatedAt).toLocaleString()} — Preferences ${consent.preferences ? "ON" : "OFF"}, Analytics ${consent.analytics ? "ON" : "OFF"}, Marketing ${consent.marketing ? "ON" : "OFF"}.`
                : "You have not saved a choice yet — the banner will ask on your next visit."}
            </p>
            <button onClick={openCookieSettings} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-300 transition">
              <Settings2 className="h-4 w-4" /> Change cookie settings
            </button>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">5. Contact</h2>
            <p>Questions about cookies or your data? Email support@creatorshubacademy.com. You can also clear site data anytime in your browser settings.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
