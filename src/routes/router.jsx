import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/student/CourseDetails";
import CoursePlayer from "../pages/student/CoursePlayer";
import DashBoard from "../pages/common/Dashboard";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import RouteErrorPage from "../pages/common/RouteErrorPage";
import LazyPage from "../components/common/LazyPage";

const lazyImport = (importFn) => {
  const Component = lazy(importFn);
  return () => (
    <LazyPage>
      <Component />
    </LazyPage>
  );
};

const About = lazyImport(() => import("../pages/About"));
const Contact = lazyImport(() => import("../pages/Contact"));
const ManageCertificates = lazyImport(() => import("../pages/admin/ManageCertificates"));
const ManageBroadcasts = lazyImport(() => import("../pages/admin/ManageBroadcasts"));
const AdminManagePayouts = lazyImport(() => import("../pages/admin/AdminManagePayouts"));
const AdminDailySummary = lazyImport(() => import("../pages/admin/AdminDailySummary"));
const ManageCourses = lazyImport(() => import("../pages/admin/ManageCourses"));
const AdminNotifications = lazyImport(() => import("../pages/admin/AdminNotifications"));
const ManageTeachers = lazyImport(() => import("../pages/admin/ManageTeachers"));
const ManageUsers = lazyImport(() => import("../pages/admin/ManageUsers"));
const ManageVisits = lazyImport(() => import("../pages/admin/ManageVisits"));
const BulkImportCourses = lazyImport(() => import("../pages/admin/BulkImportCourses"));
const ManageCohorts = lazyImport(() => import("../pages/admin/ManageCohorts"));
const BeTeacher = lazyImport(() => import("../pages/BeTeacher"));
const CategoryCourses = lazyImport(() => import("../pages/CategoryCourses"));
const CourseDash = lazyImport(() => import("../pages/common/CourseDash"));
const Profile = lazyImport(() => import("../pages/common/Profile"));
const ProfileEdit = lazyImport(() => import("../pages/common/ProfileEdit"));
const ContinueLearning = lazyImport(() => import("../pages/common/ContinueLearning"));
const AcademyPortal = lazyImport(() => import("../components/common/AcademyPortal"));
const FAQ = lazyImport(() => import("../pages/Faq"));
const NotFound = lazyImport(() => import("../pages/NotFound"));
const PrivacyPolicy = lazyImport(() => import("../pages/PrivacyPolicy"));
const TermsOfService = lazyImport(() => import("../pages/TermsOfService"));
const RefundPolicy = lazyImport(() => import("../pages/RefundPolicy"));
const Unauthorized = lazyImport(() => import("../pages/Unauthorized"));
const VerifyCertificate = lazyImport(() => import("../pages/VerifyCertificate"));
const CourseAssignments = lazyImport(() => import("../pages/student/CourseAssignments"));
const Certificate = lazyImport(() => import("../pages/student/Certificate"));
const ExamPage = lazyImport(() => import("../pages/student/ExamPage"));
const Referrals = lazyImport(() => import("../pages/student/Referrals"));
const StripeWrapper = lazyImport(() => import("../pages/student/StripeWrapper"));
const AddCourse = lazyImport(() => import("../pages/teacher/AddCourse"));
const CourseSummery = lazyImport(() => import("../pages/teacher/CourseSummery"));
const TeacherPayout = lazyImport(() => import("../pages/teacher/TeacherPayout"));
const TeacherSubscription = lazyImport(() => import("../pages/teacher/TeacherSubscription"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms-of-service", element: <TermsOfService /> },
      { path: "/refund-policy", element: <RefundPolicy /> },
      { path: "/courses", element: <Courses /> },
      { path: "/category/:category", element: <CategoryCourses /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/verify/:certificateId", element: <VerifyCertificate /> },
      { path: "/verify", element: <VerifyCertificate /> },
      {
        path: "/become-teacher",
        element: (
          <PrivateRoute>
            <BeTeacher />
          </PrivateRoute>
        ),
      },
      {
        path: "/courses/:id",
        element: (
          <PrivateRoute>
            <CourseDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment/:id",
        element: (
          <PrivateRoute>
            <StripeWrapper />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashBoard />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Profile /> },
          { path: "profile", element: <Profile /> },
          {
            path: "continue",
            element: (
              <PrivateRoute>
                <ContinueLearning />
              </PrivateRoute>
            ),
          },
          {
            path: "academy-portal",
            element: (
              <PrivateRoute>
                <AcademyPortal />
              </PrivateRoute>
            ),
          },
          {
            path: "referrals",
            element: (
              <PrivateRoute>
                <Referrals />
              </PrivateRoute>
            ),
          },
          {
            path: "courses/add",
            element: (
              <RoleBasedRoute allowedRoles={["teacher"]}>
                <AddCourse />
              </RoleBasedRoute>
            ),
          },
          {
            path: "courses/:courseId",
            element: (
              <RoleBasedRoute allowedRoles={["teacher", "admin"]}>
                <CourseSummery />
              </RoleBasedRoute>
            ),
          },
          { path: "courses", element: <CourseDash /> },
          {
            path: "assignments/:courseId",
            element: (
              <RoleBasedRoute allowedRoles={["student"]}>
                <CourseAssignments />
              </RoleBasedRoute>
            ),
          },
          {
            path: "teachers",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                <ManageTeachers />
              </RoleBasedRoute>
            ),
          },
          {
            path: "users",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </RoleBasedRoute>
            ),
          },
          {
            path: "admin/courses",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                <ManageCourses />
              </RoleBasedRoute>
            ),
          },
          {
            path: "certificates",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                <ManageCertificates />
              </RoleBasedRoute>
            ),
          },
          {
            path: "payouts",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminManagePayouts />
              </RoleBasedRoute>
            ),
          },
          {
            path: "daily-summary",
            element: (
              <PrivateRoute>
                <AdminDailySummary />
              </PrivateRoute>
            ),
          },
          {
            path: "visits",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                <ManageVisits />
              </RoleBasedRoute>
            ),
          },
          {
            path: "notifications",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminNotifications />
              </RoleBasedRoute>
            ),
          },
          {
            path: "broadcasts",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                <ManageBroadcasts />
              </RoleBasedRoute>
            ),
          },
          {
            path: "courses/bulk-import",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                <BulkImportCourses />
              </RoleBasedRoute>
            ),
          },
          {
            path: "admin/cohorts",
            element: (
              <RoleBasedRoute allowedRoles={["admin", "teacher"]}>
                <ManageCohorts />
              </RoleBasedRoute>
            ),
          },
          {
            path: "profile/edit",
            element: (
              <PrivateRoute>
                <ProfileEdit />
              </PrivateRoute>
            ),
          },
          {
            path: "teacher/payout",
            element: (
              <RoleBasedRoute allowedRoles={["teacher"]}>
                <TeacherPayout />
              </RoleBasedRoute>
            ),
          },
          {
            path: "teacher/subscription",
            element: (
              <RoleBasedRoute allowedRoles={["teacher"]}>
                <TeacherSubscription />
              </RoleBasedRoute>
            ),
          },
        ],
      },
      {
        path: "/dashboard/learn/:courseId",
        element: (
          <PrivateRoute>
            <CoursePlayer />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/certificate/:courseId",
        element: (
          <PrivateRoute>
            <Certificate />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/exam/:courseId",
        element: (
          <PrivateRoute>
            <ExamPage />
          </PrivateRoute>
        ),
      },
      { path: "/unauthorized", element: <Unauthorized /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
