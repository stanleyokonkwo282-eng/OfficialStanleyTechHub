/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { canUse, onConsentChange } from "../utils/cookieConsent";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    // Only read the saved theme when preferences consent was granted.
    if (!canUse("preferences")) return "dark";
    const saved = window.localStorage.getItem("cha_theme");
    return saved || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Persist theme only with preferences consent.
    if (!canUse("preferences")) return;
    try {
      window.localStorage.setItem("cha_theme", theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  // If the learner revokes preferences consent later, stop persisting.
  useEffect(() => onConsentChange(() => {}), []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
