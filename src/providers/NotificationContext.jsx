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
      setNotifications(data.notifications || []);
      setUnreadCount((data.notifications || []).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [axiosSecure]);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, isLoading, refreshNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
