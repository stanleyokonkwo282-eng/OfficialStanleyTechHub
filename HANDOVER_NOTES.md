# Creators Hub Academy — Handover Notes

**Last Updated:** 2026-09-05  
**Status:** Production Live  
**Frontend Repo:** https://github.com/stanleyokonkwo282-eng/OfficialStanleyTechHub  
**Backend Repo:** https://github.com/stanleyokonkwo282-eng/creators-hub-academy-backend  
**Live Frontend:** https://creators-hub-academy.vercel.app  
**Live Backend:** https://creators-hub-academy-backend.onrender.com  

---

## Recent Deployments

### Frontend (OfficialStanleyTechHub) — Pushed to `main`
- **Static Hero**: Removed 3D WebGL hero scene for performance; replaced with static `banner.jpg` background + amber radial gradient overlay. Bundle reduced from ~3.14MB to ~2.08MB.
- **Ads & Broadcast Hub**: `AdsNotificationCenter` now fetches live announcements from backend `GET /api/broadcasts/active` via TanStack Query, with static fallback if API is empty. Includes unread counter, mark-as-read persistence in `localStorage`, and prev/next navigation.
- **Admin Broadcast Manager**: New `/dashboard/broadcasts` page for admins to create, activate/deactivate, and delete sponsored campaigns. Uses existing backend admin auth (`verifyRole(['admin'])`).
- **Premium PDF Reader**: `PremiumCourseReader.jsx` provides a chapter-based premium reading experience with syllabus sidebar, action checklists, pro-tip callouts, terminal command copy, and download button. Integrated into `CoursePlayer` reading tab.
- **Standalone PDF Viewer**: `CoursePdfViewer.jsx` offers fullscreen modal, zoom controls, page navigation, loading/error states, and localStorage progress persistence.
- **Data-Driven Academy Portal**: New `/dashboard/academy-portal` route with `AcademyPortal.jsx` — a reusable global course portal powered by `src/data/courses.js` catalog. Add new courses by extending the `COURSE_CATALOG` array; UI auto-generates tabs, lesson directory, reader, and PDF download.
- **Last Memory / Resume**: `useLastMemory.js` hook persists last active lesson + timestamp to localStorage. `LastMemory.jsx` widget shown on Profile and Enrolled Courses with Resume/Dismiss. `ContinueLearning.jsx` at `/dashboard/continue` redirects to saved lesson.
- **Account Deletion**: Self-service `DELETE /api/users/me` endpoint (auth required). Profile page shows red "Delete Account" button with SweetAlert confirmation requiring user to type `DELETE`.
- **CoursePlayer Crash Fix**: Removed fragile `resumeTargetId` state and `useLocation`-based resume path that caused a temporal dead zone (`Cannot access 'pe' before initialization`) on course open.

### Backend (creators-hub-academy-backend) — Pushed to `main`
- **Broadcast Model & Routes**: New `Broadcast` MongoDB schema + `broadcastController.js` with `createBroadcast`, `getActiveBroadcasts`, `getAllBroadcasts`, `updateBroadcast`, `deleteBroadcast`. Public `GET /api/broadcasts/active` and admin CRUD under `POST/GET/PATCH/DELETE /api/broadcasts` with `verifyRole(['admin'])`.
- **Account Deletion**: `deleteOwnAccount` controller + `DELETE /api/users/me` route protected by `verifyToken`. Deletes only the authenticated user's document.

---

## Environment Variables

### Backend (Render)
| Variable | Purpose |
|----------|---------|
| `PAYSTACK_SECRET_KEY` | Paystack live secret key |
| `PAYSTACK_PUBLIC_KEY` | Paystack live public key |
| `IMAGEKIT_ID` | ImageKit account ID |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit uploads |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit signature generation |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit CDN URL |
| `IMAGEKIT_ID` | ImageKit account ID required for initialization |
| `EMAIL_USER` | Gmail sender address |
| `EMAIL_PASS` | Gmail app password |
| `ADMIN_EMAIL` | Admin notification email |
| `ADMIN_WHATSAPP` | Admin WhatsApp number (E.164 format) |
| `TWILIO_ACCOUNT_SID` | Twilio WhatsApp (optional) |
| `TWILIO_AUTH_TOKEN` | Twilio auth (optional) |
| `TWILIO_WHATSAPP_FROM` | Twilio WhatsApp sender |
| `CRON_SECRET` | Secret for `/api/cron/daily-login-summary` endpoint |
| `FRONTEND_URL` | https://creators-hub-academy.vercel.app |

### Frontend (Vercel)
| Variable | Purpose |
|----------|---------|
| `VITE_BASE_URL` | https://creators-hub-academy-backend.onrender.com/api |

---

## Payment Architecture

### Course Enrollment (₦5,000)
- **Frontend**: Clicking "Enroll Now" redirects to fixed Paystack payment link `https://paystack.shop/pay/avbg0eyx6c`.
- **Handoff**: `sessionStorage` stores `enrollmentCourseId` and `enrollmentFormat`.
- **Return Flow**: Paystack redirects back to site with `?reference=...`. Frontend reads stored `courseId`/`format` and calls `GET /api/courses/verify-payment/:reference?courseId=...&format=...`.
- **Backend**: Verifies payment with Paystack, creates `Enrollment` with `enrolledFormat`, records `Transaction`, updates teacher earnings (90% / 10% commission).

### Certificate Payment (₦10,000)
- **Frontend**: `Certificate.jsx` calls `POST /api/certificates/paystack/initialize` → redirects to Paystack.
- **Return Flow**: `GET /api/certificates/paystack/verify/:reference` verifies and marks certificate approved.
- **Admin**: Receives WhatsApp + email notification on payment. Uploads certificate design via admin portal (`ManageCertificates`).

---

## Teacher Subscription Plans

| Plan | Price | Duration | Discount |
|------|-------|----------|----------|
| Monthly | ₦12,500 | 1 month | None |
| Quarterly | ₦33,750 | 3 months | 10% off ₦37,500 |
| Yearly | ₦135,000 | 12 months | 10% off ₦150,000 |

**Flow:** Teacher fills profile → chooses plan → pays via Paystack → account activated → admin approval → dashboard access.

---

## Commission & Payouts

- Platform takes **10% commission** on every course sale.
- Teacher receives **90%** directly to their bank account.
- Teachers request payout from available balance; admin processes from `/dashboard/payouts`.

**Backend endpoints:**
- `POST /api/payouts/request` — teacher requests payout
- `POST /api/payouts/:id/process` — admin approves/rejects
- `GET /api/earnings/my-earnings` — teacher earnings + transactions
- `GET /api/payouts/all` — admin lists all payouts

---

## Notification System

| Type | Trigger | Email to Admin |
|------|---------|----------------|
| `user_joined` | New student/teacher registration | Yes |
| `user_login` | User logged in | Yes |
| `user_logout` | User logged out | Yes |
| `course_joined` | Student enrolled in course | Yes |
| `exam_completed` | Student submitted exam | Yes |
| `certificate_payment` | Certificate payment received | Yes |
| `site_visit` | Page visit | Authenticated only |

---

## Admin Features

1. **Notifications** (`/dashboard/notifications`) — all system alerts with email/WhatsApp.
2. **Teacher Payouts** (`/dashboard/payouts`) — approve/reject payout requests.
3. **Daily Summary** (`/dashboard/daily-summary`) — manual trigger for daily login summary email.
4. **Visits** (`/dashboard/visits`) — site visit statistics.
5. **Certificates** (`/dashboard/certificates`) — upload certificate designs, approve payments.

---

## Frontend Pages Reference

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/courses` | All Courses | Public |
| `/courses/:id` | Course Details | Private |
| `/payment/:id` | Payment Checkout | Private |
| `/dashboard` | Student/Teacher Dashboard | Private |
| `/dashboard/learn/:courseId` | Course Player | Private |
| `/dashboard/exam/:courseId` | Exam | Private |
| `/dashboard/certificate/:courseId` | Certificate | Private |
| `/become-teacher` | Become a Teacher | Private |
| `/about` | About | Public |
| `/contact` | Contact | Public |
| `/privacy-policy` | Privacy Policy | Public |
| `/terms-of-service` | Terms of Service | Public |
| `/refund-policy` | Refund Policy | Public |
| `/faq` | FAQ | Public |

---

## Backend Models Reference

| Model | Purpose |
|-------|---------|
| `User` | Firebase UID, email, role, subscription, payoutInfo, earnings |
| `Course` | Title, description, image, instructor, price, category, status, rating |
| `Lesson` | Module, lesson, title, description, videoUrl, pdfUrl, duration, type |
| `Enrollment` | Student-course relationship with payment method, format, reference |
| `LessonProgress` | Per-student lesson completion and last-watched time |
| `Exam` | Course-linked questions and answers |
| `ExamAttempt` | Student attempt history with score and pass/fail |
| `Certificate` | Unique ID, student info, course info, payment status, verification status, certificateImage |
| `Subscription` | Teacher subscription plans and status |
| `Transaction` | Course sales, payouts, subscriptions |
| `Payout` | Teacher payout requests and processing |
| `Notification` | All notification types with meta data |
| `Visit` | Site visit tracking |

---

## Security & Trust Fixes Applied

1. **Removed exposed cron secret** from backend source code.
2. **Moved email from URL path to request body** in `POST /be-teacher`.
3. **Standardized support email** to `support@creatorshubacademy.com` across all pages.
4. **Removed all Gmail references** from frontend code.
5. **Removed placeholder social links** from footer and About page.
6. **Added operator identity** (Stanley Chukwunonso Okonkwo, Lagos, Nigeria) to Contact, Privacy, Terms, Refund, and Footer.
7. **Added governing law** (Federal Republic of Nigeria) to legal pages.
8. **Removed WhatsApp certificate payment text** — all certificate payments route through Paystack only.
9. **Soften certificate claims** — removed "recognized worldwide" language.
10. **Added OG tags, Twitter Cards, schema.org, robots.txt, sitemap.xml** for SEO.
11. **Added `site.webmanifest`** and Apple touch icon.
12. **Added `prefers-reduced-motion`** CSS support.

---

## 3D Visual Upgrades

1. **Hero Section** (`Hero3D.jsx`): React Three Fiber particle globe with 1,800 amber points, mouse-reactive rotation, additive blending.
2. **Course Cards** (`CourseCard.jsx`): Framer-motion 3D tilt (`rotateX`/`rotateY`) + glassmorphism (`backdrop-blur`, translucent zinc background).
3. **Certificate Preview** (`Certificate.jsx`): CSS 3D certificate mockup with hover `rotateY(12deg) rotateX(6deg)` animation.
4. **Dependencies**: `three`, `@react-three/fiber`, `@react-three/drei` installed.

---

## Deployment Checklist

- [x] Frontend pushed to `main` on GitHub
- [x] Backend pushed to `main` on GitHub
- [x] Vercel auto-deploys from `main`
- [x] Render auto-deploys from `main`
- [x] Environment variables set on Render
- [x] Environment variables set on Vercel
- [x] Paystack live keys configured on backend
- [x] Cron job configured at https://console.cron-job.org/jobs/8309933
- [x] `CRON_SECRET` added to Render environment variables
- [x] Teacher subscription flow tested and working
- [x] Payout request and approval flow tested and working

---

## Notes for Next Developer

1. **Teacher subscription is Paystack-based**, not Stripe. The old Stripe code still exists but course payments now use Paystack too.
2. **Payments are in LIVE mode.** Backend uses `sk_live_...` for Paystack secret and `pk_live_...` for public key. Do NOT use test keys.
3. **Commission is hardcoded at 10%** in `enrollmentController.js` (`PLATFORM_COMMISSION_RATE`).
4. **Daily summary cron** is configured at https://console.cron-job.org/jobs/8309933. The cron calls the backend `/api/cron/daily-login-summary` endpoint with the secret from Render env vars.
5. **Local development**: set `VITE_BASE_URL` in frontend `.env` to `https://creators-hub-academy-backend.onrender.com/api` to test against live backend, or `http://localhost:5000/api` for local backend.
6. **Visit tracking** is in `middlewares/trackVisit.js` — it tracks both authenticated and anonymous visits.
7. **Notifications** are stored in MongoDB `Notification` collection and also emailed to admin.
8. **Profile edit** updates MongoDB via `PATCH /api/users/:email` — frontend uses `encodeURIComponent` for email.
9. **ImageKit** is used for all image uploads — signature is generated server-side at `/api/get-ik-signature`.
10. **Firebase API key** should be restricted to `https://creators-hub-academy.vercel.app` in the Firebase console.
11. **3D libraries removed** (`three`, `@react-three/fiber`, `@react-three/drei`, `@splinetool/react-spline`) to reduce bundle size. Hero uses static image + CSS gradient. Course cards use CSS `preserve-3d` transforms only.
12. **Scalable course catalog** lives in `src/data/courses.js`. Add new courses by appending objects to `COURSE_CATALOG`; `AcademyPortal` auto-generates tabs, lessons, and PDF downloads.
13. **Broadcast/Ads admin** is at `/dashboard/broadcasts` (admin only). Public feed reads `GET /api/broadcasts/active`.
14. **Account deletion** is at `DELETE /api/users/me` (auth required). Frontend confirmation requires typing `DELETE`.
15. **Last memory resume** uses `localStorage` key `cha_last_memory`. `LastMemory` widget appears on Profile and Enrolled Courses. `/dashboard/continue` redirects to saved lesson.
16. **PDF reader components**: `PremiumCourseReader.jsx` is the main chapter-based reader; `CoursePdfViewer.jsx` is a standalone fullscreen PDF viewer with zoom/page controls.
17. **Course reassignment**: Admin can reassign all courses from one teacher email to another via `/dashboard/courses` → "Reassign Teacher" button, which calls `POST /api/courses/reassign-teacher` (admin only).

---

## Contact

- Support Email: support@creatorshubacademy.com
- WhatsApp: +234 813 443 8808
- Operator: Stanley Chukwunonso Okonkwo
- Location: Lagos, Nigeria
- GitHub: https://github.com/stanleyokonkwo282-eng
