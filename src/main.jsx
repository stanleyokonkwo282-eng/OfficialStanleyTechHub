import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import router from "./routes/router.jsx";

const queryClient = new QueryClient();

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