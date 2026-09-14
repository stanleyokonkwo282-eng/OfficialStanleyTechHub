// Cookie consent manager — Creators Hub Academy.
// Single source of truth for GDPR / Nigeria NDPR cookie consent.
// Consent is versioned + timestamped in localStorage; third-party tracking
// (analytics, marketing) must check `canUse()` before writing anything.

export const CONSENT_KEY = "cha_cookie_consent_v1";
export const CONSENT_VERSION = 1;

export const OPEN_SETTINGS_EVENT = "cha:open-cookie-settings";
export const CONSENT_CHANGED_EVENT = "cha:consent-changed";

export const CATEGORIES = ["necessary", "preferences", "analytics", "marketing"];

export const CATEGORY_META = {
  necessary: {
    label: "Strictly Necessary",
    description:
      "Login sessions, security, load balancing and remembering your cookie choice itself. The site cannot function without these. Always on.",
    locked: true,
  },
  preferences: {
    label: "Preferences",
    description:
      "Remembers your theme (dark/light), sound toggle, remembered email and where you left off in a course.",
    locked: false,
  },
  analytics: {
    label: "Analytics",
    description:
      "Helps us understand which pages and portfolio links are popular so we can improve courses. No advertising profiles.",
    locked: false,
  },
  marketing: {
    label: "Marketing",
    description:
      "Used for referral attribution and any future promotional measurement. Off by default.",
    locked: false,
  },
};

export const defaultConsent = () => ({
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
});

// Known third-party analytics cookies we clean up when analytics is rejected.
const ANALYTICS_COOKIES = ["_ga", "_gid", "_gat", "_gat_gtag", "_gac_", "__utmz", "__utma"];

export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasConsented() {
  return getConsent() !== null;
}

/** Gate-keeper: call before writing any non-essential storage / firing trackers. */
export function canUse(category) {
  if (category === "necessary") return true;
  const consent = getConsent();
  if (!consent) return false;
  return consent[category] === true;
}

function eraseCookie(name) {
  try {
    const host = window.location.hostname;
    const domains = [undefined, host, `.${host}`];
    const paths = ["/", window.location.pathname];
    domains.forEach((domain) => {
      paths.forEach((path) => {
        document.cookie =
          `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;Max-Age=0` +
          `;path=${path}` +
          (domain ? `;domain=${domain}` : "");
      });
    });
  } catch {
    /* cookie cleanup is best-effort */
  }
}

export function saveConsent(prefs) {
  const base = defaultConsent();
  const next = {
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
    necessary: true,
    preferences: prefs?.preferences === true,
    analytics: prefs?.analytics === true,
    marketing: prefs?.marketing === true,
  };
  void base;
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — consent still applies in-memory for this session */
  }
  // Honour a rejection immediately: wipe known analytics cookies.
  if (typeof document !== "undefined" && next.analytics !== true) {
    ANALYTICS_COOKIES.forEach(eraseCookie);
  }
  try {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: next }));
  } catch {
    /* older browsers — non-blocking */
  }
  return next;
}

export function acceptAll() {
  return saveConsent({ preferences: true, analytics: true, marketing: true });
}

export function rejectAll() {
  return saveConsent({ preferences: false, analytics: false, marketing: false });
}

export function resetConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
  ANALYTICS_COOKIES.forEach((name) => {
    try {
      eraseCookie(name);
    } catch {
      /* ignore */
    }
  });
  try {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: null }));
  } catch {
    /* ignore */
  }
}

/** Subscribe to consent changes. Returns an unsubscribe function. */
export function onConsentChange(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = (e) => callback(e?.detail ?? getConsent());
  window.addEventListener(CONSENT_CHANGED_EVENT, handler);
  return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handler);
}

export function openCookieSettings() {
  try {
    window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
  } catch {
    /* ignore */
  }
}

// Minimal document.cookie helpers for future first-party needs
// (e.g. referral attribution once marketing consent is granted).
export function setCookie(name, value, days = 180) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )};expires=${expires};path=/;SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

export function getCookie(name) {
  try {
    const target = `${encodeURIComponent(name)}=`;
    const parts = document.cookie.split("; ");
    for (const part of parts) {
      if (part.startsWith(target)) return decodeURIComponent(part.slice(target.length));
    }
    return null;
  } catch {
    return null;
  }
}

export function deleteCookie(name) {
  eraseCookie(name);
}
