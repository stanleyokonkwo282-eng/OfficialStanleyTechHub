import { useMutation } from "@tanstack/react-query";
import { MdArrowRight, MdNotificationsActive } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";
import { Link, NavLink } from "react-router";
import { toast } from "react-toastify";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "../../assets/logo.png";
import useAuth from "../../hooks/useAuth";
import { NotificationContext } from "../../providers/NotificationContext";
import { useContext, useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { user, isUserLoading, userLogout } = useAuth();
  const { notifications, unreadCount, refreshNotifications } = useContext(NotificationContext);
  const { scrollY } = useScroll();
  const navBackground = useTransform(scrollY, [0, 100], ["rgba(0,0,0,0.8)", "rgba(0,0,0,0.95)"]);
  const navBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.role === "admin") {
      refreshNotifications();
    }
  }, [user, refreshNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutMutation = useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      toast.success("Logged out successfully!");
    },
    onError: (error) => {
      toast.error("Logout failed!");
      console.error(error);
    },
  });

  const linkStyle = ({ isActive }) =>
    isActive ? "text-yellow-400 font-semibold" : "font-semibold text-white hover:text-yellow-400 transition-colors";

  const links = (
    <>
      <li>
        <NavLink to="/" className={linkStyle}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/courses" className={linkStyle}>
          All Courses
        </NavLink>
      </li>
      <li>
        <NavLink to="/become-teacher" className={linkStyle}>
          Teach on Creators Hub
        </NavLink>
      </li>

      {/* Dashboard links only visible on mobile */}
      <hr className="md:hidden my-2 border-zinc-700" />

      {user?.role === "admin" && (
        <li className="md:hidden">
          <NavLink to="/dashboard/teachers" className={linkStyle}>
            All Teachers
          </NavLink>
        </li>
      )}

      {user?.role === "admin" && (
        <li className="md:hidden">
          <NavLink to="/dashboard/users" className={linkStyle}>
            All Users
          </NavLink>
        </li>
      )}

      {user?.role === "admin" && (
        <li className="md:hidden">
          <NavLink to="/dashboard/courses" className={linkStyle}>
            All Courses
          </NavLink>
        </li>
      )}

      {user?.role === "admin" && (
        <li className="md:hidden">
          <NavLink to="/dashboard/notifications" className={linkStyle}>
            Notifications
          </NavLink>
        </li>
      )}

      {user?.role === "student" && (
        <li className="md:hidden">
          <NavLink to="/dashboard/courses" className={linkStyle}>
            Enrolled Courses
          </NavLink>
        </li>
      )}

      {user?.role === "teacher" && (
        <li className="md:hidden">
          <NavLink to="/dashboard/courses" className={linkStyle}>
            My Courses
          </NavLink>
        </li>
      )}

      {user?.role === "teacher" && (
        <li className="md:hidden">
          <NavLink to="/dashboard/courses/add" className={linkStyle}>
            Add Course
          </NavLink>
        </li>
      )}

      {user && (
        <li className="md:hidden">
          <NavLink to="/dashboard/profile" className={linkStyle}>
            My Profile
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <motion.nav
      style={{ backgroundColor: navBackground, backdropFilter: navBlur }}
      className="sticky top-0 z-50 border-b border-zinc-800 shadow-lg px-4"
    >
      <div className="navbar">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden text-2xl text-white"
            >
              <TiThMenu />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-zinc-950 border border-zinc-800 rounded-box z-50 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Creators Hub Academy"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-lg font-bold text-white hidden sm:block">
              Creators Hub <span className="text-yellow-400">Academy</span>
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>

        <div className="navbar-end">
          <UserData
            user={user}
            isUserLoading={isUserLoading}
            logoutMutation={logoutMutation}
            notifications={notifications}
            unreadCount={unreadCount}
            setShowDropdown={setShowDropdown}
            showDropdown={showDropdown}
            dropdownRef={dropdownRef}
          />
        </div>
      </div>
    </motion.nav>
  );
}

const UserData = ({ user, isUserLoading, logoutMutation, notifications, unreadCount, setShowDropdown, showDropdown, dropdownRef }) => {
  if (isUserLoading)
    return <span className="loading loading-spinner loading-lg text-yellow-400"></span>;

  if (!user)
    return (
      <Link to="/login" className="btn bg-yellow-400 text-black border-none hover:bg-yellow-500 font-bold">
        Login
      </Link>
    );

  return (
    <div className="flex items-center gap-3">
      {user?.role === "admin" && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-white hover:text-yellow-400 transition-colors"
          >
            <MdNotificationsActive className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-box shadow-xl z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-zinc-800">
                <h3 className="text-white font-semibold">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-sm p-3">No notifications yet</p>
              ) : (
                notifications.slice(0, 5).map((notif) => (
                  <Link
                    key={notif._id}
                    to="/dashboard/notifications"
                    className="block p-3 hover:bg-zinc-800 border-b border-zinc-800/50 last:border-0"
                    onClick={() => setShowDropdown(false)}
                  >
                    <p className="text-sm text-white">
                      {notif.type === "user_joined" && `🆕 New ${notif.meta?.role || "user"} joined`}
                      {notif.type === "user_login" && `🔑 ${notif.meta?.role || "User"} login: ${notif.studentName}`}
                      {notif.type === "course_joined" && `📚 New enrollment: ${notif.courseTitle}`}
                      {notif.type === "exam_completed" && `🎓 Exam completed: ${notif.courseTitle}`}
                      {notif.type === "certificate_payment" && `💳 Certificate payment`}
                      {notif.type === "site_visit" && notif.meta?.authenticated ? `👁️ ${notif.meta?.userName || notif.studentName} visited ${notif.meta?.page || "site"}` : `👁️ New site visit`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </Link>
                ))
              )}
              <Link
                to="/dashboard/notifications"
                className="block p-3 text-center text-yellow-400 hover:bg-zinc-800 text-sm font-medium"
                onClick={() => setShowDropdown(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="dropdown dropdown-end">
        <div tabIndex={1} role="button">
          <img
            src={user.photoURL}
            alt="profile"
            className="w-10 h-10 rounded-full ring-2 ring-yellow-400 hover:ring-4 transition-all duration-300 cursor-pointer"
          />
        </div>

        <ul
          tabIndex={1}
          className="menu menu-sm dropdown-content bg-zinc-950 border border-zinc-800 rounded-box z-50 mt-3 w-52 p-2 shadow right-0"
        >
          <li>
            <p className="font-semibold text-center text-yellow-400 py-1">
              {user?.displayName}
            </p>
          </li>
          <li>
            <Link to="/dashboard/profile" className="text-gray-300 hover:text-yellow-400">
              <MdArrowRight />
              Profile
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="text-gray-300 hover:text-yellow-400">
              <MdArrowRight />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              onClick={() => logoutMutation.mutate()}
              className="text-red-400 hover:text-red-300"
            >
              <MdArrowRight />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
