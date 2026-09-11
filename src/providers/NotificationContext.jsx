/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { auth } from "../../firebase.config";
import {
  playNotificationSound,
  showBrowserNotification,
  requestNotificationPermission,
} from "../utils/sound";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // Read-state tracking for the notification sound: we only chime when NEW
  // unread items arrive since the previous poll (never on the first load).
  const prevUnreadRef = useRef(0);
  const firstLoadDoneRef = useRef(false);
  // Keep the latest fetcher in a ref so the poll interval is created once and
  // never churns if the axios instance identity changes between renders.
  const fetchRef = useRef(null);

  const fetchNotifications = useCallback(
    async ({ silent = false } = {}) => {
      // Notifications are admin-facing; skip the fetch entirely when nobody is
      // signed in (prevents a wasted 401 round-trip every poll tick).
      if (!auth?.currentUser) {
        firstLoadDoneRef.current = false;
        prevUnreadRef.current = 0;
        return;
      }
      if (!silent) setIsLoading(true);
      try {
        const res = await axiosSecure.get("/notifications");
        const data = res.data;
        const items = data.notifications || [];
        // Premium read-state: unread badge = notifications not yet marked read.
        const unread = data.unread ?? items.filter((n) => !n.read).length;

        // 🔔 Sound + desktop alert when NEW unread notifications arrive.
        if (firstLoadDoneRef.current && unread > prevUnreadRef.current) {
          playNotificationSound();
          const newest = items[0];
          showBrowserNotification(
            "New notification",
            newest
              ? `${newest.studentName || newest.studentEmail || "Activity"}${
                  newest.courseTitle ? ` — ${newest.courseTitle}` : ""
                }`
              : "You have a new notification"
          );
        }
        prevUnreadRef.current = unread;
        firstLoadDoneRef.current = true;

        setNotifications(items);
        setUnreadCount(unread);
      } catch (error) {
        if (!silent) console.error("Failed to fetch notifications:", error);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [axiosSecure]
  );

  fetchRef.current = fetchNotifications;

  // Poll for new notifications (30s) + instant refresh when the tab regains
  // focus. Only runs while a user is signed in.
  useEffect(() => {
    const tick = () => fetchRef.current?.({ silent: true });
    const interval = setInterval(tick, 30000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    tick();
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Ask for desktop-notification permission once, on the first user click
  // (browsers require a gesture before prompting).
  useEffect(() => {
    const onFirstClick = () => {
      requestNotificationPermission();
      document.removeEventListener("click", onFirstClick);
    };
    document.addEventListener("click", onFirstClick);
    return () => document.removeEventListener("click", onFirstClick);
  }, []);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (id) => {
      if (!id) return;
      // Optimistic local update so the UI feels instant.
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      try {
        const res = await axiosSecure.patch(`/notifications/${id}/read`);
        setUnreadCount(res.data?.unread ?? 0);
      } catch (error) {
        console.error("Failed to mark notification read:", error);
        refreshNotifications();
      }
    },
    [axiosSecure, refreshNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      const res = await axiosSecure.post("/notifications/read-all");
      setUnreadCount(res.data?.unread ?? 0);
    } catch (error) {
      console.error("Failed to mark all notifications read:", error);
      refreshNotifications();
    }
  }, [axiosSecure, refreshNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
