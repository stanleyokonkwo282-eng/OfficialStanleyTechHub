import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import router from "./routes/router.jsx";

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
}

// Wake up Render backend immediately when site loads
// This prevents the 50-second cold start delay when students try to enroll
fetch(`${import.meta.env.VITE_BASE_URL.replace("/api", "")}`)
  .then(() => console.log("Backend is awake"))
  .catch(() => console.log("Backend waking up..."));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);