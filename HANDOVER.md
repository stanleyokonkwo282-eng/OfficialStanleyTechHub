# Creators Hub Academy — Handover Document

## 1. Project Overview
- React + Vite frontend for the Creators Hub Academy LMS.
- Uses Firebase Authentication and a backend API through `VITE_BASE_URL`.
- Styling is built with Tailwind CSS and DaisyUI.
- Routing via `react-router` v7.
- Data fetching via `@tanstack/react-query`.

## 2. Brand & UI Theme
- Brand: **Creators Hub Academy**
- Primary visual theme:
  - Dark background: `bg-black`, `bg-zinc-950`, `bg-zinc-900`
  - Brand accent: yellow (`text-yellow-400`, `bg-yellow-400`, `hover:bg-yellow-500`)
  - Neutral text: white/gray for readability and contrast
  - Card and panel borders: `border-zinc-800`, `border-zinc-700`
- UI style: polished learning platform with a premium dark mode aesthetic.

## 3. Key Pages
- Home page
- About page
- FAQ page
- All Courses listing
- Course Detail page
- Login / Signup
- Verify Certificate
- Become a Teacher
- Dashboard and Role-specific pages
- Student learning flow: course player, exams, certificates
- Teacher flow: add course, manage courses, course summary
- Admin flow: manage users, teachers, courses, certificates, visits analytics

## 4. Main Features Working
- Firebase email/password login
- Google login
- Password reset via Firebase
- Protected routes with `PrivateRoute`
- Role-based access with `RoleBasedRoute`
- Course browsing and search
- Enrollment using coupon code `CREATOR`
- Lesson playback via YouTube embed
- Video progress tracking and lesson completion
- Module and lesson navigation
- AI Course Assistant UI in course player
- Exam workflow with attempt tracking and pass/fail review
- Certificate request and approval flow
- Teacher request submission
- Teacher course creation and management
- Admin certificate approval and visitor analytics

## 5. Features That Need Attention
- Stripe payment integration is currently disabled in `src/pages/student/StripeWrapper.jsx`.
- AI assistant backend must exist at `/ai/chat` and `/ai/chat-history/...` for the feature to work fully.
- Course data is backend-driven; local fallback courses are only for demo/fallback purposes.
- Paystack initialization and verification depend on backend implementation.
- Certificate verification depends on backend response and certificate records.

## 6. Course & Certification Flow
- Courses are loaded from backend endpoints such as `/courses`, `/courses/:id`, `/courses/popular`, and `/courses/new`.
- Students can enroll for free with coupon code `CREATOR`.
- Students complete lessons and watch video content to earn progress.
- Exams are available after course completion using `/exam/:courseId`.
- Certificates are obtained after passing the exam and paying `₦10,000` or submitting payment proof.
- Certificate verification is handled through `/certificates/verify/:id`.

## 7. AI Integration
- The course player includes an AI assistant chat feature.
- Frontend chat flow uses:
  - `/ai/chat`
  - `/ai/chat-history/:courseId/:lessonId/:email`
- The feature is UI-ready but relies on backend support for actual AI responses.

## 8. Roles and Dashboard
- `student` role:
  - Enroll courses
  - View enrolled courses
  - Learn in course player
  - Take exams
  - Request certificates
  - Submit assignments and feedback
- `teacher` role:
  - Request teacher approval via `Become a Teacher`
  - Add and manage courses
  - View course summary and assignment stats
- `admin` role:
  - Manage users, teachers, courses
  - Approve/reject certificates
  - View visits analytics

## 9. Important Files & Paths
- `src/routes/router.jsx` — app routing and protected route setup
- `src/providers/AuthProvider.jsx` — auth state and user profile logic
- `src/pages/Login.jsx` — login with email/password and Google
- `src/pages/Courses.jsx` — course listing and search
- `src/pages/student/CourseDetails.jsx` — course enrollment and summary
- `src/pages/student/CoursePlayer.jsx` — lesson playback and AI assistant
- `src/pages/student/ExamPage.jsx` — exam workflow
- `src/pages/student/Certificate.jsx` — certificate request and approval
- `src/pages/teacher/AddCourse.jsx` — course creation form
- `src/pages/admin/ManageCertificates.jsx` — certificate administration
- `src/components/home/WhyChoose.jsx` — site selling points and content features

## 10. Backend Dependencies
- `VITE_BASE_URL` must be configured in env variables.
- Expected backend routes include:
  - `/users` and `/users/:email`
  - `/courses`, `/courses/:id`, `/courses/popular`, `/courses/new`
  - `/enrollments`, `/enrollments/:id`, `/courses/enrolled/:email`
  - `/lessons/:courseId`, `/lessons/progress/:courseId/:email`
  - `/exam/:courseId`, `/exam/submit`, `/exam/attempts/:courseId/:email`
  - `/certificates/*`
  - `/ai/chat`, `/ai/chat-history/*`
  - `/be-teacher/:email`
  - `/visits/stats`
  - `/assignments/*`

## 11. Developer Checklist
- [ ] Confirm `VITE_BASE_URL` is set correctly in the environment.
- [ ] Ensure Firebase config in `firebase.config.js` is valid.
- [ ] Add or verify backend routes for AI chat and certificate/payment processing.
- [ ] Enable Stripe if paid checkout is required.
- [ ] Review `useAxiosSecure.jsx` for auth token handling.
- [ ] Confirm role values match backend user records (`student`, `teacher`, `admin`).
- [ ] Verify `react-router` v7 routing is consistent across pages.
- [ ] Check `CoursePlayer.jsx` for video resume and lesson progress logic.

## 12. Tester Checklist
- [ ] Login and signup flows work for new and returning users.
- [ ] Google login successfully registers and logs in users.
- [ ] Password reset email triggers correctly.
- [ ] Protected routes redirect unauthenticated users to login.
- [ ] Course search and course listing load correctly.
- [ ] Enrollment with coupon code works.
- [ ] Course playback resumes from the last watched time.
- [ ] AI chat drawer opens and sends requests with backend support.
- [ ] Exams and attempt limits work.
- [ ] Certificate request form saves payment proof and shows status.
- [ ] Teacher requests, course creation, and course management work.
- [ ] Admin certificate approval and visits analytics display correctly.

## 13. Deployment Checklist
- [ ] Build the app with `npm run build`.
- [ ] Verify `VITE_BASE_URL` is configured for production.
- [ ] Confirm Firebase auth domains are authorized for the deployed domain.
- [ ] Ensure backend API is deployed and available.
- [ ] Test login, enroll, course playback, and certificate flows after deployment.
- [ ] Confirm media and image upload endpoints are live if course images are uploaded.

## 14. Notes and Next Steps
- The UI is designed for creators and digital learners with a strong dark/yellow brand identity.
- The site is ready for frontend QA, but critical backend checks are needed for AI, payments, and certificates.
- If you want, I can also add a second document listing exact backend endpoint contracts and payload structure.