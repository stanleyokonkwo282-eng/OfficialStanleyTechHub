import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import router from "./routes/router.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const queryClient = new QueryClient();

// Safe Node modification overrides to prevent React "removeChild" & "insertBefore" crashes
// typically caused by browser translation extensions or other third-party DOM mutators.
if (typeof window !== "undefined") {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) {
      console.warn("Prevented removeChild error: Node to be removed is not a child of this node.", child, this);
      return child;
    }
    return originalRemoveChild.call(this, child);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      console.warn("Prevented insertBefore error: Reference node is not a child of this node.", referenceNode, this);
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };

  const originalError = console.error;
  console.error = function (...args) {
    const message = args[0];
    if (typeof message === "string") {
      const lower = message.toLowerCase();
      if (
        (lower.includes("cannot read") && lower.includes("this model does not support image input")) ||
        lower.includes("this model does not support image input") ||
        lower.includes("does not provide an export named")
      ) {
        return;
      }
    }
    if (args[0] && typeof args[0].message === "string") {
      const lower = args[0].message.toLowerCase();
      if (
        lower.includes("cannot read") ||
        lower.includes("this model does not support image input") ||
        lower.includes("does not provide an export named")
      ) {
        return;
      }
    }
    originalError.apply(console, args);
  };

  window.addEventListener("error", (event) => {
    const msg = (event.message || "").toLowerCase();
    if (
      msg.includes("cannot read") ||
      msg.includes("this model does not support image input") ||
      msg.includes("does not provide an export named")
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const msg = typeof reason === "string" ? reason : reason?.message || "";
    const lower = msg.toLowerCase();
    if (
      lower.includes("cannot read") ||
      lower.includes("this model does not support image input") ||
      lower.includes("does not provide an export named")
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  const removeExtensionErrors = () => {
    const selectors = [
      '[class*="extension"]',
      '[class*="sidebar"]',
      '[id*="extension"]',
      '[id*="sidebar"]',
    ];
    document.querySelectorAll(selectors.join(", ")).forEach((el) => {
      const text = (el.textContent || "").toLowerCase();
      if (
        text.includes("cannot read") ||
        text.includes("this model does not support image input") ||
        text.includes("extension error")
      ) {
        el.remove();
      }
    });
  };

  const observer = new MutationObserver(() => {
    removeExtensionErrors();
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
    removeExtensionErrors();
  }
  window.addEventListener("load", removeExtensionErrors);
}

// Wake up Render backend immediately when site loads
// This prevents the 50-second cold start delay when students try to enroll
fetch(`${import.meta.env.VITE_BASE_URL.replace("/api", "")}`)
  .then(() => console.log("Backend is awake"))
  .catch(() => console.log("Backend waking up..."));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);