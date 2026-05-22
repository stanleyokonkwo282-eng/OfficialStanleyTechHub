import { Outlet } from "react-router";
import DashboardSidebar from "../../components/common/DashboardSidebar";
import HeadTag from "../../components/common/HeadTag";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";

export default function DashBoard() {
  const { isUserLoading } = useAuth();

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