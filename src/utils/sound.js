// Lightweight Web Audio chime generator — no external audio files needed.
// Provides: admin-notification chime, incoming chat-message ping, a persistent
// mute toggle (localStorage), and desktop notifications for background tabs.

const SOUND_ENABLED_KEY = "cha_sound_enabled";

export const isSoundEnabled = () => {
  try {
    return localStorage.getItem(SOUND_ENABLED_KEY) !== "off";
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled) => {
  try {
    localStorage.setItem(SOUND_ENABLED_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable */
  }
};

export const toggleSoundEnabled = () => {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  return next;
};

let audioCtx = null;
const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => undefined);
    }
    return audioCtx;
  } catch {
    return null;
  }
};

// Play a short chime: list of { freq, start, duration, gain, type } tones.
const playChime = (tones) => {
  if (!isSoundEnabled()) return false;
  const ctx = getAudioContext();
  if (!ctx) return false;
  const now = ctx.currentTime;
  try {
    tones.forEach(({ freq, start, duration, gain = 0.16, type = "sine" }) => {
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      const startAt = now + start;
      vol.gain.setValueAtTime(0.0001, startAt);
      vol.gain.exponentialRampToValueAtTime(gain, startAt + 0.02);
      vol.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      osc.connect(vol);
      vol.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.05);
    });
    return true;
  } catch {
    return false;
  }
};

// New admin notification: bright two-tone "ding-dong" (E5 → A5).
export const playNotificationSound = () =>
  playChime([
    { freq: 659.25, start: 0, duration: 0.18 },
    { freq: 880, start: 0.14, duration: 0.34, gain: 0.18 },
  ]);

// Incoming chat message: softer double-blip (C5 → G4).
export const playMessageSound = () =>
  playChime([
    { freq: 523.25, start: 0, duration: 0.12, gain: 0.14 },
    { freq: 392, start: 0.1, duration: 0.22, gain: 0.12 },
  ]);

// Desktop notification — only surfaced when the tab is in the background, so
// the user gets a visible alert alongside the sound while browsing elsewhere.
export const showBrowserNotification = (title, body) => {
  try {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (!("Notification" in window)) return;
    if (document.visibilityState === "visible") return;
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/logo.png" });
    }
  } catch {
    /* notifications unavailable */
  }
};

// Ask for desktop-notification permission (call from a user gesture once).
export const requestNotificationPermission = async () => {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (window.Notification && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  } catch {
    /* ignore */
  }
};