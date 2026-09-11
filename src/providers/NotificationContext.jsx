/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosSecure.get("/notifications");
      const data = res.data;
      const items = data.notifications || [];
      setNotifications(items);
      // Premium read-state: unread badge = notifications not yet marked read.
      setUnreadCount(data.unread ?? items.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [axiosSecure]);

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
