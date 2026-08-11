import { Outlet } from "react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import DashboardSidebar from "../../components/common/DashboardSidebar";
import HeadTag from "../../components/common/HeadTag";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";

export default function DashBoard() {
  const { user, isUserLoading } = useAuth();

  useEffect(() => {
    if (user) {
      const justLoggedIn = sessionStorage.getItem("chub_justLoggedIn");
      if (justLoggedIn === "true") {
        toast.success(
          `Welcome, ${user.displayName || "Stanley"}! 🎉 Your dashboard is ready. Welcome to your personalized learning center.`,
          { autoClose: 6000 }
        );
        sessionStorage.removeItem("chub_justLoggedIn");
      }
    }
  }, [user]);

  if (isUserLoading) return <LoaderDotted />;
  return (
    <>
      <HeadTag title="Creators Hub Academy | Dashboard" />
      <div className="min-h-screen flex bg-black">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 bg-black text-white">
          <Outlet />
        </div>
      </div>
    </>
  );
}