import axios from "axios";
import { auth } from "../../firebase.config";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Attach the freshest Firebase ID token directly from the SDK on every
// request. Using auth.currentUser (Firebase's live object) instead of
// React state avoids any race where React hasn't re-rendered yet.
axiosSecure.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error("Failed to get ID token", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosSecure.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error.config;

    if (status === 403) {
      window.location.href = "/unauthorized";
      return Promise.reject(error);
    }

    // On 401, try ONE forced token refresh + retry before giving up.
    // This protects against a token being momentarily stale or missing
    // right after a fresh login or page reload.
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const freshToken = await currentUser.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return axiosSecure(originalRequest);
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr.message);
        }
      }
      // Refresh failed, or there's genuinely no user — real logout.
      await auth.signOut().catch(() => {});
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const useAxiosSecure = () => axiosSecure;

export default useAxiosSecure;