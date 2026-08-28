# Creators Hub Academy — Handover Notes

**Last Updated:** 2026-08-28  
**Status:** Production Live  
**Frontend Repo:** https://github.com/stanleyokonkwo282-eng/OfficialStanleyTechHub  
**Backend Repo:** https://github.com/stanleyokonkwo282-eng/creators-hub-academy-backend  
**Live Frontend:** https://creators-hub-academy.vercel.app  
**Live Backend:** https://creators-hub-academy-backend.onrender.com  

---

## Recent Deployments

### Frontend (OfficialStanleyTechHub) — Pushed to `main`
- **3D Hero Upgrade**: Replaced 2D animated hero with React Three Fiber particle globe (1,800 points) that responds to mouse movement.
- **3D Course Cards**: Added framer-motion tilt effect (`rotateX`/`rotateY`) + glassmorphism styling on `CourseCard`.
- **3D Certificate Preview**: Added hover-rotate certificate mockup in `Certificate.jsx` with `preserve-3d` transforms.
- **Legal Pages**: Added `PrivacyPolicy`, `TermsOfService`, `RefundPolicy`, `Contact` with operator identity and Nigerian governing law.
- **SEO/Meta**: Added Open Graph tags, Twitter Cards, canonical URL, Organization JSON-LD schema, `robots.txt`, `sitemap.xml`.
- **Favicon/Manifest**: Added `site.webmanifest`, `apple-touch-icon`, and theme color.
- **Trust Fixes**: Removed all placeholder social links, standardized support email to `support@creatorshubacademy.com`, added physical address/operator to footer, softened certificate claims.
- **Accessibility**: Added `prefers-reduced-motion` CSS override.
- **Payment Flow**: Switched course enrollment to fixed Paystack payment link (`https://paystack.shop/pay/avbg0eyx6c`) with `sessionStorage` handoff for `courseId` and `format`.
- **Exam UX**: Added WhatsApp contact button for locked exam state.

### Backend (creators-hub-academy-backend) — Pushed to `main`
- **Security**: Removed hardcoded cron secret from source; endpoint validates `process.env.CRON_SECRET` only.
- **Route Hardening**: `POST /be-teacher` now accepts email from request body instead of URL path.
- **Payment Verification**: `verifyPaystackPayment` accepts `courseId` and `format` from query params and uses `req.user.email` (from auth token) as primary identity.
- **Webhook Resilience**: `paystackWebhook` no longer fails hard when Paystack metadata is missing; acknowledges event and defers enrollment to frontend verify flow.
- **Syntax Fix**: Corrected arrow-function syntax error in `userController.js` (`createNewTeacher`).

---

## Environment Variables

### Backend (Render)
| Variable | Purpose |
|----------|---------|
| `PAYSTACK_SECRET_KEY` | Paystack live secret key |
| `PAYSTACK_PUBLIC_KEY` | Paystack live public key |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit uploads |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit signature generation |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit CDN URL |
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
11. **3D dependencies** (`three`, `@react-three/fiber`, `@react-three/drei`) are installed. Bundle size is ~3MB; consider route-based code splitting if performance becomes an issue.

---

## Contact

- Support Email: support@creatorshubacademy.com
- WhatsApp: +234 813 443 8808
- Operator: Stanley Chukwunonso Okonkwo
- Location: Lagos, Nigeria
- GitHub: https://github.com/stanleyokonkwo282-eng
