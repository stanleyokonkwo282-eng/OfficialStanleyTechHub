import { getDatabase, ref, push } from "firebase/database";
import "../../firebase.config.js";
import { canUse } from "./cookieConsent";

const STORAGE_KEY = "chub_portfolioLink_events";

// Analytics-gated: no local + no remote tracking until the learner opts in.
const allowed = () => canUse("analytics");

const readEvents = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeEvents = (events) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Storage may be unavailable (e.g. private mode); tracking degrades gracefully.
  }
};

const baseEvent = (type, meta = {}) => ({
  type,
  ts: Date.now(),
  path: window.location.pathname,
  ua: navigator.userAgent,
  ...meta,
});

const logToRTDB = async (event) => {
  try {
    const db = getDatabase();
    await push(ref(db, "portfolioLinkEvents"), event);
  } catch {
    // Remote logging is best-effort; local tracking still works offline.
  }
};

export const trackLinkView = (meta) => {
  if (!allowed()) return null;
  const events = readEvents();
  const event = baseEvent("view", meta);
  events.push(event);
  writeEvents(events);
  logToRTDB(event);
};

export const trackLinkClick = (meta) => {
  if (!allowed()) return null;
  const events = readEvents();
  const event = baseEvent("click", meta);
  events.push(event);
  writeEvents(events);
  logToRTDB(event);
  return event;
};

export const getTrackingStats = () => {
  const events = readEvents();
  const views = events.filter((e) => e.type === "view").length;
  const clicks = events.filter((e) => e.type === "click").length;
  return { views, clicks, total: events.length };
};
