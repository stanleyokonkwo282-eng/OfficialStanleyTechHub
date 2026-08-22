# Creators Hub Academy — Handover Notes

**Last Updated:** 2026-08-22  
**Status:** Production Live  
**Frontend Repo:** https://github.com/stanleyokonkwo282-eng/OfficialStanleyTechHub  
**Backend Repo:** https://github.com/stanleyokonkwo282-eng/creators-hub-academy-backend  
**Live Frontend:** https://creators-hub-academy.vercel.app  
**Live Backend:** https://creators-hub-academy-backend.onrender.com  

---

## Recent Deployments

### Frontend (OfficialStanleyTechHub) — Pushed to `main`
- Teacher subscription plans (`/become-teacher`) with Paystack payment
- Teacher payout & earnings page (`/dashboard/teacher/payout`)
- Teacher subscription status page (`/dashboard/teacher/subscription`)
- Admin payout management page (`/dashboard/payouts`)
- Admin daily login summary trigger page (`/dashboard/daily-summary`)
- Profile edit page (`/dashboard/profile/edit`) — name, phone, profile picture
- Enhanced notification system with login/logout/site-visit tracking
- FAQ updated with current platform features
- YouTube video URLs updated across all course modules

### Backend (creators-hub-academy-backend) — Pushed to `main`
- Teacher subscription models: `Subscription`, `Transaction`, `Payout`
- Teacher subscription controller with Paystack integration
- User model extended with subscription, payout, and earnings fields
- Enrollment controller updated with commission tracking (10% platform fee)
- Notification endpoints: `user-login`, `user-logout`, `daily-summary`
- Email service extended with login/logout/daily-summary templates
- Site visit tracking enhanced with authenticated user details
- ImageKit signature error handling improved
- Profile update endpoint `PATCH /api/users/:email`

---

## New Environment Variables Required

### Backend (Render)
| Variable | Purpose |
|----------|---------|
| `PAYSTACK_SECRET_KEY` | Paystack payments for subscriptions and course enrollment |
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

## New Admin Features

1. **Notifications** (`/dashboard/notifications`)
   - User joined alerts with email/role
   - User login/logout alerts with email, phone, role, page
   - Course enrollment alerts
   - Exam completion alerts
   - Certificate payment alerts
   - Site visit alerts (authenticated & anonymous)

2. **Teacher Payouts** (`/dashboard/payouts`)
   - View all teacher payout requests
   - Approve/reject payouts
   - Automatic bank transfer via Paystack on approval

3. **Daily Summary** (`/dashboard/daily-summary`)
   - Manual trigger for daily login summary email
   - Shows cron endpoint for automation

4. **Visits** (`/dashboard/visits`)
   - Site visit statistics and tracking

---

## Teacher Subscription Plans

| Plan | Price | Duration | Discount |
|------|-------|----------|----------|
| Monthly | ₦12,500 | 1 month | None |
| Quarterly | ₦33,750 | 3 months | 10% off ₦37,500 |
| Yearly | ₦135,000 | 12 months | 10% off ₦150,000 |

**Flow:** Teacher fills profile → chooses plan → pays via Paystack → account activated → admin approval → dashboard access

---

## Payout System

- Platform takes **10% commission** on every course sale
- Teacher receives **90%** directly to their bank account
- Teachers add bank details in Payout & Earnings page
- Teachers request payout from available balance
- Admin processes payout from `/dashboard/payouts`

**Backend endpoints:**
- `POST /api/payouts/request` — teacher requests payout
- `POST /api/payouts/:id/process` — admin approves/rejects
- `GET /api/earnings/my-earnings` — teacher earnings + transactions
- `GET /api/payouts/all` — admin lists all payouts

---

## Notification System

**New notification types:**
- `user_joined` — new student/teacher registration
- `user_login` — user logged in (with email, phone, role, page)
- `user_logout` — user logged out
- `course_joined` — student enrolled in course
- `exam_completed` — student submitted exam
- `certificate_payment` — certificate payment received
- `site_visit` — page visit (authenticated or anonymous)

**Notification endpoints:**
- `POST /api/notifications/user-joined`
- `POST /api/notifications/user-login`
- `POST /api/notifications/user-logout`
- `POST /api/notifications/course-joined`
- `POST /api/notifications/exam-completed`
- `GET /api/notifications` — fetch all notifications
- `GET /api/cron/daily-login-summary` — daily summary email

---

## Email Notifications Sent to Admin

1. New user joined (student/teacher)
2. User login alert (with email, phone, role, page)
3. User logout alert (with email, phone, role)
4. Course enrollment alert
5. Exam completion alert
6. Certificate payment received
7. Daily login summary (last 24 hours)

---

## Course Video URLs

- Updated `src/data/coursesFallback.js` with 53 YouTube URLs
- 8 new lessons added to Video Editing course module
- All URLs are unique, no duplicates
- Courses: Graphic Design (32 lessons), AI Productivity (13 lessons), Video Editing (8 lessons)

---

## Frontend Pages Reference

| Route | Page | Access |
|-------|------|--------|
| `/become-teacher` | Become a Teacher | Private |
| `/dashboard/teacher/payout` | Payout & Earnings | Teacher |
| `/dashboard/teacher/subscription` | My Subscription | Teacher |
| `/dashboard/payouts` | Teacher Payouts | Admin |
| `/dashboard/daily-summary` | Daily Summary | Admin |
| `/dashboard/notifications` | Notifications | Admin |
| `/dashboard/profile/edit` | Edit Profile | Private |

---

## Backend Models Reference

| Model | Purpose |
|-------|---------|
| `User` | Extended with subscription, payoutInfo, earnings fields |
| `Subscription` | Teacher subscription plans and status |
| `Transaction` | Course sales, payouts, subscriptions |
| `Payout` | Teacher payout requests and processing |
| `Notification` | All notification types with meta data |

---

## Deployment Checklist

- [x] Frontend pushed to `main` on GitHub
- [x] Backend pushed to `main` on GitHub
- [x] Vercel auto-deploys from `main`
- [x] Render auto-deploys from `main`
- [x] Environment variables set on Render
- [x] Environment variables set on Vercel
- [ ] Set up cron job for daily summary (cron-job.org or Render cron)
- [ ] Add `CRON_SECRET` to Render environment variables
- [ ] Test teacher subscription flow end-to-end
- [ ] Test payout request and approval flow

---

## Notes for Next Developer

1. **Teacher subscription is Paystack-based**, not Stripe. The old Stripe code still exists but course payments now use Paystack too.
2. **Commission is hardcoded at 10%** in `enrollmentController.js` (`PLATFORM_COMMISSION_RATE`).
3. **Daily summary cron** requires a secret. Set `CRON_SECRET` in Render env and call `/api/cron/daily-login-summary?secret=YOUR_SECRET`.
4. **Visit tracking** is in `middlewares/trackVisit.js` — it tracks both authenticated and anonymous visits.
5. **Notifications** are stored in MongoDB `Notification` collection and also emailed to admin.
6. **Profile edit** updates MongoDB via `PATCH /api/users/:email` — frontend uses `encodeURIComponent` for email.
7. **ImageKit** is used for all image uploads — signature is generated server-side at `/api/get-ik-signature`.

---

## Contact

- Admin Email: creatorshubacademy3@gmail.com
- WhatsApp: +234 813 443 8808
- GitHub: https://github.com/stanleyokonkwo282-eng
