import { createBrowserRouter } from "react-router";
import App from "../App";
import About from "../pages/About";
import ManageCertificates from "../pages/admin/ManageCertificates";
import ManageCourses from "../pages/admin/ManageCourses";
import ManageTeachers from "../pages/admin/ManageTeachers";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageVisits from "../pages/admin/ManageVisits";  // ✅ ADDED
import BeTeacher from "../pages/BeTeacher";
import CategoryCourses from "../pages/CategoryCourses";
import CourseDash from "../pages/common/CourseDash";
import DashBoard from "../pages/common/Dashboard";
import Profile from "../pages/common/Profile";
import Courses from "../pages/Courses";
import FAQ from "../pages/Faq";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Signup from "../pages/Signup";
import Unauthorized from "../pages/Unauthorized";
import VerifyCertificate from "../pages/VerifyCertificate";
import CourseAssignments from "../pages/student/CourseAssignments";
import Certificate from "../pages/student/Certificate";
import CourseDetails from "../pages/student/CourseDetails";
import CoursePlayer from "../pages/student/CoursePlayer";
import ExamPage from "../pages/student/ExamPage";
import StripeWrapper from "../pages/student/StripeWrapper";
import AddCourse from "../pages/teacher/AddCourse";
import CourseSummery from "../pages/teacher/CourseSummery";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/courses", element: <Courses /> },
      { path: "/category/:category", element: <CategoryCourses /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/verify/:certificateId", element: <VerifyCertificate /> },
      { path: "/verify", element: <VerifyCertificate /> },
      {
        path: "/become-teacher",
        element: <PrivateRoute><BeTeacher /></PrivateRoute>,
      },
      {
        path: "/courses/:id",
        element: <PrivateRoute><CourseDetails /></PrivateRoute>,
      },
      {
        path: "/payment/:id",
        element: <PrivateRoute><StripeWrapper /></PrivateRoute>,
      },
      {
        path: "/dashboard",
        element: <PrivateRoute><DashBoard /></PrivateRoute>,
        children: [
          { index: true, element: <Profile /> },
          { path: "profile", element: <Profile /> },
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
            path: "visits",                                    // ✅ ADDED
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                <ManageVisits />
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