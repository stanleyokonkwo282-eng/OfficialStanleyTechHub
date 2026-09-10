# Creators Hub Academy — Handover Notes

**Last Updated:** 2026-09-10  
**Status:** Production Live and Verified  
**Frontend Repo:** https://github.com/stanleyokonkwo282-eng/OfficialStanleyTechHub  
**Backend Repo:** https://github.com/stanleyokonkwo282-eng/creators-hub-academy-backend  
**Live Frontend:** https://creators-hub-academy.vercel.app  
**Live Backend:** https://creators-hub-academy-backend.onrender.com  

## Final Production Verification (2026-09-09)

- Frontend homepage loads successfully on the active Vercel deployment.
- Student referral rewards and signup attribution fully unified with backend points engine.
- Student Chat Forum enabled with live peer chatting, audio mic recording, camera video calls, and automated per-minute point deductions (`/forum/call/deduct`).
- PDF and hybrid course routing enabled with dedicated reader (`/dashboard/learn-pdf/:courseId`).
- Production frontend build passes with `npm run build` (2,537 modules transformed).
- All changes pushed and synchronized to GitHub `main`.

---

## Recent Bug Fixes (2026-09-10)

### Frontend (OfficialStanleyTechHub) — Pushed to `main`

| Commit | Fix | Files |
|--------|-----|-------|
| `fdb8370` | **Logout button hang fix** — Admin notification POST now capped at 4s timeout so signOut always runs instantly. Previously hung 10-60s waiting for slow Gmail SMTP. | `src/providers/AuthProvider.jsx` |
| `d97686e` | **Chat message delivery fix** — Added 5s polling on `/forum/history` so both parties see new messages in near-real-time. Added smart auto-scroll (only scrolls when user is near bottom) + "jump to bottom" button for unread messages. Fixed `isAtBottomRef` tracking via `onScroll` on messages container. | `src/pages/student/StudentChatForum.jsx` |
| `50194fb` | **PDF course player crash fix** — Backend `getCourseById` returns `{ success, message, course }` but frontend was reading `res.data?.data` (which doesn't exist), falling through to the entire response envelope as the course object. This left `course` missing all fields (`title`, `hasPdf`, etc.), causing render errors that triggered the ErrorBoundary "Something went wrong" screen. Fixed to `res.data?.course`. Also fixed `persistLesson` to match by `_id` instead of `resolvedId` (sidebar lessons don't have `resolvedId`), and guarded against division-by-zero in progress calculation. | `src/pages/student/PdfCoursePlayer.jsx` |

### Backend (creators-hub-academy-backend) — Already deployed
- No backend changes required for these fixes. All three were frontend-only bugs.
- Backend SMTP timeout fix (`b5b6153`) was deployed earlier to prevent email blocking.

---

## Recent Deployments

### Frontend (OfficialStanleyTechHub) — Pushed to `main`
- **Student Chat & Call Hub**: Added `StudentChatForum.jsx` at `/dashboard/chat-forum`. Supports real-time text chat, audio recording preview/playback, peer video calling with camera controls, and automatic balance check (min 20 points) with live points deduction upon call termination.
- **PDF & Hybrid Learn Route**: Added dedicated `/dashboard/learn-pdf/:courseId` route and format switcher in `CourseDetails.jsx` so students enrolling in PDF or hybrid formats get directed straight to the PDF handbook viewer.
- **Referral Flow Optimization**: Refactored `Signup.jsx` to pass `referralCode` directly to the `POST /users` payload, ensuring immediate student sign-up points bonuses.
- **Vite Rollup Chunking & White Screen Fix**: Grouped `react`, `react-dom`, `react-router`, and `framer-motion` together into the `vendor-react-core` chunk in `vite.config.js`. This resolves the `Uncaught TypeError: Cannot read properties of undefined (reading 'createContext')` error caused by `framer-motion` initializing before React core.
- **Ads & Broadcast Hub**: `AdsNotificationCenter` now fetches live announcements from backend `GET /api/broadcasts/active` via TanStack Query, with static fallback if API is empty. Includes unread counter, mark-as-read persistence in `localStorage`, and prev/next navigation.
- **Admin Broadcast Manager**: New `/dashboard/broadcasts` page for admins to create, activate/deactivate, and delete sponsored campaigns. Uses existing backend admin auth (`verifyRole(['admin'])`).
- **Data-Driven Academy Portal**: New `/dashboard/academy-portal` route with `AcademyPortal.jsx` — a reusable global course portal powered by `src/data/courses.js` catalog.
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
| `GEMINI_API_KEY` | Google Gemini API key for AI Course Assistant |
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
- **Frontend**: Clicking "Enroll Now" redirects to `VITE_PAYSTACK_COURSE_URL` (default: `https://paystack.shop/pay/CreatorsHubAcademy`).
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
2. **Payments are in LIVE mode.** Backend uses the live Paystack secret in the deployment environment and `pk_live_15b415df90f55aed4082c964b0fcb61daa642d41` for the public key. Do NOT use test keys.
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
18. **AI Course Assistant**: `POST /api/ai/chat` uses Google Gemini (`gemini-flash-latest`). Requires `GEMINI_API_KEY` env var on Render. Frontend now surfaces backend AI errors instead of generic fallback.
19. **Backend response field mismatch**: The backend `getCourseById` returns `{ success, message, course }` — NOT `{ data }`. Several frontend components use `res.data?.data` (which is correct for their endpoints like `/forum/search` returning `{ success, data: [...] }`), but `PdfCoursePlayer.jsx` was incorrectly using `res.data?.data` for the course endpoint. Always verify the backend response format when adding new API calls. The correct pattern for each endpoint:
   - `/courses/:id` → `res.data.course`
   - `/forum/search`, `/forum/history` → `res.data.data`
   - `/users/profile/:id` → `res.data.data`
   - `/broadcasts`, `/broadcasts/active` → `res.data.data`
20. **Chat polling trade-off**: The 5-second polling interval in `StudentChatForum.jsx` balances real-time feel vs. server load. For Render free tier, do not reduce below 3s to avoid cold-start timeouts. If upgrading to WebSockets in future, remove the `setInterval` in the `loadConversation` useEffect.
21. **Logout notification is best-effort**: The admin notification POST in `userLogout` has a 4s timeout and is wrapped in try/catch. Email failures never block logout. This is intentional.

---

## Contact

- Support Email: support@creatorshubacademy.com
- WhatsApp: +234 813 443 8808
- Operator: Stanley Chukwunonso Okonkwo
- Location: Lagos, Nigeria
- GitHub: https://github.com/stanleyokonkwo282-eng
