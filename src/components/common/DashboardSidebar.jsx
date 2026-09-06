import { FaBookOpen, FaCertificate, FaBell, FaMoneyBillWave, FaChartBar, FaBullhorn, FaGraduationCap, FaSun, FaMoon, FaUsers } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { IoDocumentsSharp } from "react-icons/io5";
import { LuBookUser, LuShare2 } from "react-icons/lu";
import { MdAddToPhotos, MdUpload } from "react-icons/md";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import { NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

export default function DashboardSidebar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const linkStyle = ({ isActive }) =>
    isActive
      ? "text-yellow-400 bg-zinc-800 rounded-lg px-3 py-2 block"
      : "text-gray-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg px-3 py-2 block transition-all";

  return (
    <div className="w-3/12 bg-zinc-950 border-r border-zinc-800 text-white p-6 space-y-4 hidden md:block min-h-screen">
      <h2 className="text-xl font-bold mb-6 text-white">Dashboard</h2>
      <nav className="flex flex-col space-y-1">

        {/* Admin Links */}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/teachers" className={linkStyle}>
            <LinkTile title="All Teachers">
              <PiChalkboardTeacherBold />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/users" className={linkStyle}>
            <LinkTile title="All Users">
              <LuBookUser />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/courses" className={linkStyle}>
            <LinkTile title="All Courses">
              <FaBookOpen />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/notifications" className={linkStyle}>
            <LinkTile title="Notifications">
              <FaBell />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/broadcasts" className={linkStyle}>
            <LinkTile title="Broadcasts & Ads">
              <FaBullhorn />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/certificates" className={linkStyle}>
            <LinkTile title="Certificates">
              <FaCertificate />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/payouts" className={linkStyle}>
            <LinkTile title="Teacher Payouts">
              <FaMoneyBillWave />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/daily-summary" className={linkStyle}>
            <LinkTile title="Daily Summary">
              <FaChartBar />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/courses/bulk-import" className={linkStyle}>
            <LinkTile title="Bulk Import">
              <MdUpload />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/visits" className={linkStyle}>
            <LinkTile title="Site Visits">
              <FaChartBar />
            </LinkTile>
          </NavLink>
        )}
        {(user?.role === "admin" || user?.role === "teacher") && (
          <NavLink to="/dashboard/admin/cohorts" className={linkStyle}>
            <LinkTile title="Manage Cohorts">
              <FaUsers />
            </LinkTile>
          </NavLink>
        )}

        {/* Student Links */}
        {user?.role === "student" && (
          <NavLink to="/dashboard/courses" className={linkStyle}>
            <LinkTile title="Enrolled Courses">
              <IoDocumentsSharp />
            </LinkTile>
          </NavLink>
        )}
        {(user?.role === "student" || user?.role === "teacher") && (
          <NavLink to="/dashboard/academy-portal" className={linkStyle}>
            <LinkTile title="Academy Portal">
              <FaGraduationCap />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "student" && (
          <NavLink to="/dashboard/referrals" className={linkStyle}>
            <LinkTile title="My Referrals">
              <LuShare2 />
            </LinkTile>
          </NavLink>
        )}

        {/* Teacher Links */}
        {user?.role === "teacher" && (
          <NavLink to="/dashboard/courses" className={linkStyle}>
            <LinkTile title="My Courses">
              <IoDocumentsSharp />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "teacher" && (
          <NavLink to="/dashboard/courses/add" className={linkStyle}>
            <LinkTile title="Add Course">
              <MdAddToPhotos />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "teacher" && (
          <NavLink to="/dashboard/teacher/payout" className={linkStyle}>
            <LinkTile title="Payout & Earnings">
              <FaMoneyBillWave />
            </LinkTile>
          </NavLink>
        )}
        {user?.role === "teacher" && (
          <NavLink to="/dashboard/teacher/subscription" className={linkStyle}>
            <LinkTile title="My Subscription">
              <FaCertificate />
            </LinkTile>
          </NavLink>
        )}

        {/* All Roles */}
        <NavLink to="/dashboard/profile" className={linkStyle}>
          <LinkTile title="My Profile">
            <IoIosPerson />
          </LinkTile>
        </NavLink>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 text-base font-medium text-gray-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg px-3 py-2 transition-all w-full"
        >
          {theme === "dark" ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>
    </div>
  );
}

const LinkTile = ({ title, children }) => {
  return (
    <span className="flex items-center gap-3 text-base font-medium">
      <span className="text-lg">{children}</span>
      {title}
    </span>
  );
};
