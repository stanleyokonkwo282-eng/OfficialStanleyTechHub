# Creators Hub Academy — LMS Handover Document

## 1. About The Platform

Creators Hub Academy is a fully functional Learning Management System (LMS) built to democratize digital skills education. The platform provides free, high-quality courses in graphic design, video editing, affiliate marketing, social media strategy, AI productivity, data science, cybersecurity, theology, and more. Students can enroll for free using the coupon code `CREATOR`, track lesson progress, take exams, and earn professionally designed certificates upon completion.

The mission is simple: **to bless lives and transform society** by making practical digital skills accessible to everyone—regardless of background or financial status. Education should not be a privilege; it should be a tool for empowerment, economic growth, and creative expression.

**Current Course Catalog**: 23+ courses across 15+ categories including Design, Video Production, Artificial Intelligence, Marketing, Business, Social Media, Data Science, Cybersecurity, Finance, Communication, Blockchain, Wellness, Theology, and more.

---

## 2. The Creator’s Vision

This platform was born from a deep belief that **skills today build success tomorrow**.

The founder, **Stanley Chukwunonso Okonkwo**, envisioned a space where:
- A young creator in Lagos can learn professional video editing without paying expensive tuition.
- A student in a rural community can master graphic design and start earning online.
- Anyone, anywhere, can access world-class digital education 100% free.

The certificate is not just a piece of paper—it is a **verified, globally recognized credential** that proves real learning. It opens doors to jobs, freelance gigs, and entrepreneurial opportunities. The LMS was designed to be a blessing pipeline: knowledge → skill → certificate → opportunity → transformed life → stronger society.

---

## 3. Target Users

| Role | Access |
|------|--------|
| **Student** | Browse courses, enroll for free, watch lessons, track progress, take exams, request/verify certificates |
| **Teacher** | Create courses, upload thumbnails via ImageKit, manage lessons, view enrollments |
| **Admin** | Approve/reject courses, manage users, verify certificates, view platform statistics |
| **Visitor** | Browse public courses, verify certificate authenticity |

---

## 4. Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **React Router v7** | Client-side routing |
| **TanStack Query (React Query)** | Server state management, caching, background refetching |
| **Axios** | HTTP client |
| **Tailwind CSS + DaisyUI** | Styling and component library |
| **Framer Motion** | Animations |
| **React Icons** | Icon library |
| **React Slick** | Course carousels |
| **React Toastify** | Toast notifications |
| **SweetAlert2** | Confirmation dialogs |
| **Vite** | Build tool and dev server |
| **Framer Motion** | Professional animations and motion UI |
| **React-to-print** | Certificate PDF printing |
| **Lottie Web** | Animations |
| **Google Fonts** | Typography (Playfair Display, Great Vibes, Cormorant Garamond, Inter) |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js + Express.js** | Server framework |
| **MongoDB + Mongoose** | Database and ODM |
| **Firebase Admin SDK** | Authentication and user management |
| **ImageKit** | Image upload, transformation, and CDN |
| **Google GenAI (Gemini Flash)** | AI course assistant chatbot |
| **Paystack** | Payment gateway for certificate fees |
| **Sentry** | Error tracking and monitoring |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment configuration |

### Hosting & Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting (`creators-hub-academy.vercel.app`) |
| **Render** | Backend hosting (`creators-hub-academy-backend.onrender.com`) |
| **MongoDB Atlas** | Cloud database |
| **ImageKit** | Image CDN and optimization |
| **GitHub** | Version control |

---

## 5. Key Features

### Student Features
- **Course Discovery**: Browse new, popular, and categorized courses (23+ courses)
- **Free Enrollment**: Use coupon `CREATOR` for 100% free access
- **Video Player**: YouTube-powered player with resume-from-last-watched, progress tracking, and forward-seek lock
- **YouTube Player (Updated)**: Removed beforeunload warning, removed context menu/keyboard restrictions, removed sandbox/iframe restrictions. Player uses standard YouTube embed with clean UI. Loading spinner overlay removed for smoother playback.
- **PDF Document Summary**: Switch between video lecture and PDF reading mode with loading states and error fallbacks
- **AI Course Assistant**: Context-aware chatbot powered by Gemini Flash for lesson-specific help
- **Progress Tracking**: Auto-saved last-watched time, completion percentage, and lesson checkmarks
- **Exams**: Multiple-choice exams with 2-attempt limit and pass/fail tracking
- **Certificates**: Admin-designed certificates uploaded manually through admin portal. Student receives certificate image after admin uploads custom design. Admin notified via WhatsApp and email on every payment.
- **Payment Integration**: Paystack card payment or manual bank transfer (Opay: 8134438808, Polaris: 3046748449)
- **Certificate Verification**: Public verification page for employers and institutions

### Teacher Features
- Course creation and management
- Image upload via ImageKit
- Lesson organization with modules
- View enrolled students and progress

### Admin Features
- Course approval/rejection workflow
- User management
- Certificate verification and issuance
- Platform statistics dashboard
- Payment proof review
- Certificate design upload — admin can upload custom certificate image for each approved certificate

---

## 6. Architecture Overview

### Frontend Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components (CourseCard, Loaders, Sidebar, ErrorBoundary, etc.)
│   └── home/            # Homepage sections (Banner, Stats, Courses, TrustedClients, Feedback, WhyChoose, CallToAction, JoinAsTeacher)
├── pages/
│   ├── student/         # Student dashboard, CoursePlayer, Exam, Certificate, EnrolledCourses, CourseDetails
│   ├── teacher/         # Teacher course management (TeachersCourses, UpdateCourse)
│   ├── admin/           # Admin panels (ManageCourses, ManageTeachers, ManageCertificates)
│   └── common/          # Shared pages (Dashboard, Login, Signup, About, VerifyCertificate)
├── routes/              # Route guards and models (PrivateRoute, router)
├── hooks/               # Custom hooks (useAuth, useAxiosSecure)
├── utils/               # Helpers (renderStars, ImageUploadApi)
├── data/                # Fallback/cache data (coursesFallback)
├── providers/           # Context providers (Auth)
└── styles/              # Global styles
```

### Backend Structure
```
server/
├── controllers/         # Route handlers (lessons, courses, exams, certificates, AI chat, utils)
├── models/              # Mongoose schemas (User, Course, Lesson, Enrollment, Exam, Certificate, etc.)
├── routes/              # Express routers
├── middlewares/          # Auth, role verification, visit tracking
├── config/              # Database connection
├── index.js             # App entry, AI chat endpoint, Sentry, keep-alive
├── download-all-videos.js   # Bulk download all course videos via yt-dlp
└── export-video-urls.js     # Export all video URLs to JSON/TXT
```

### Database Models
- **User**: Firebase UID, email, role (student/teacher/admin), status
- **Course**: Title, description, image, instructor, price, category, status, rating, enrollments
- **Lesson**: Module number, lesson number, title, description, videoUrl, pdfUrl, duration
- **Enrollment**: Student-course relationship with coupon/payment tracking
- **LessonProgress**: Per-student lesson completion and last-watched time
- **Exam**: Course-linked questions and answers
- **ExamAttempt**: Student attempt history with score and pass/fail
- **Certificate**: Unique ID, student info, course info, payment status, verification status
- **AiChatHistory**: Saved AI conversation per lesson per student
- **Feedback**: Course reviews and ratings
- **Assignment**: Teacher-assigned tasks
- **Submission**: Student assignment submissions

---

## 7. Course Catalog (23+ Courses)

### Design & Creative
1. **Graphic Design Masterclass** — Foundations of design, branding, visual storytelling
2. **Canva for Beginners to Pro** — Social media graphics, presentations, marketing materials
3. **Adobe Photoshop Complete Course** — Photo editing, retouching, digital art
4. **Video Editing for Creators** — Short-form and social media editing workflows
5. **Motion Graphics & Animation** — After Effects, kinetic typography, visual effects
6. **Photography & Lightroom Editing** — Composition, lighting, professional editing
7. **UI/UX Design Fundamentals** — Figma, wireframing, prototyping, design systems

### AI & Technology
8. **AI Productivity Toolkit** — Prompt engineering, LLM models, automation
9. **AI Automation for Beginners** — No-code automation, chatbots, workflow optimization
10. **Data Science & Analytics with Python** — Python, Pandas, SQL, visualization
11. **Cybersecurity Fundamentals** — Network security, ethical hacking, SOC operations
12. **Mobile App Development (Flutter + React Native)** — Cross-platform app development
13. **Blockchain & Web3 Fundamentals** — Wallets, DeFi basics, emerging tech

### Marketing & Business
14. **Digital Marketing Masterclass** — SEO, email marketing, paid ads, analytics
15. **Social Media Marketing Agency** — Content strategy, paid ads, client acquisition
16. **SEO & Organic Traffic Mastery** — Keyword research, technical SEO, link building
17. **E-commerce & Dropshipping Mastery** — Shopify, suppliers, Facebook ads, Nigerian market
18. **Freelancing Blueprint: From Zero to $5K/Month** — Upwork, Fiverr, LinkedIn, proposals
19. **Copywriting & Sales Psychology** — Direct response copy, email funnels, landing pages
20. **YouTube Channel Growth & Monetization** — Niche selection, AdSense, sponsorships
21. **Content Creation & Influencer Marketing** — Short-form video, storytelling, monetization
22. **Personal Branding & CV Mastery** — LinkedIn optimization, CV writing, interview skills
23. **Entrepreneurship & Startup Basics** — Idea validation, pitching, minimal capital launch
24. **Financial Literacy & Online Trading** — Forex, crypto, stock basics for Africans

### Personal Development
25. **Public Speaking & Communication** — Confidence building, presentations, leadership
26. **Critical Thinking & Problem Solving** — Analysis frameworks, decision-making
27. **Digital Literacy & Internet Safety** — Privacy, security, digital citizenship
28. **Mental Health & Productivity Systems** — Burnout prevention, time management, focus
29. **Theology & Christian Living** — Biblical studies, Christian doctrine, spiritual growth

---

## 8. Important Environment Variables

### Frontend (.env.local / .env.development)
```
VITE_BASE_URL=https://creators-hub-academy-backend.onrender.com
VITE_IMAGEKIT_PUBLIC_KEY=public_D8Ael8MK3U2LxGKzmYwsvaOPzuQ=
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
FIREBASE_SERVICE_ACCOUNT={...}
GEMINI_API_KEY=AIzaSy...
IMAGEKIT_PUBLIC_KEY=public_D8Ael8MK3U2LxGKzmYwsvaOPzuQ=
IMAGEKIT_PRIVATE_KEY=private_MCqXuUTgOP9SwUnQsJZu5HNRat8=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/jakariya
PAYSTACK_SECRET_KEY=sk_live_...
SENTRY_DSN=https://...
```

> **Note**: The actual values are stored securely in the deployment platforms (Vercel and Render). The `.env` files in the repo contain placeholder values for local development.

---

## 9. Deployment URLs

| Environment | URL |
|-------------|-----|
| **Frontend (Production)** | https://creators-hub-academy.vercel.app |
| **Backend (Production)** | https://creators-hub-academy-backend.onrender.com |
| **Frontend (Local)** | http://localhost:5173 |
| **Backend (Local)** | http://localhost:5000 |

---

## 10. Payment Gateway

**Paystack** is integrated for certificate fee payments.

- **Live Secret Key**: Configured in Render environment variables
- **Frontend calls**: `/api/certificates/paystack/initialize` and `/api/certificates/paystack/verify/:reference`
- **Amount**: ₦10,000 per certificate
- **Flow**: Student pays → Paystack redirects with reference → Backend verifies → Certificate marked approved

**Manual Bank Transfer Option**:
- **Opay**: 8134438808 (Nonso Stanley Okonkwo)
- **Polaris Bank**: 3046748449 (Nonso Stanley Okonkwo)

---

## 11. AI Chatbot

The AI Course Assistant uses **Google Gemini Flash** (`gemini-flash-latest`) via the backend `/api/ai/chat` endpoint.

**How it works**:
1. Student asks a question in the CoursePlayer AI drawer
2. Frontend sends `prompt`, `lessonTitle`, `lessonDescription`, `courseId`, `lessonId`, `studentEmail`
3. Backend sanitizes input (validates string, truncates to 2000 chars, strips non-text fields)
4. Backend constructs a system instruction with lesson context
5. Gemini Flash generates a response
6. Response is saved to `AiChatHistory` and returned to frontend

**Important**: The backend strictly validates that only text is sent to Gemini. Image/file uploads are blocked to prevent the "model does not support image input" error.

---

## 12. Certificate System

### How It Works
1. Student completes all lessons (100% progress)
2. Student takes exam (2 attempts max)
3. If passed, student can request certificate
4. Student pays ₦10,000 via Paystack or bank transfer
5. **Admin receives instant WhatsApp and email notification** with student details, course name, and certificate ID
6. Admin designs the certificate in Canva/Photoshop
7. Admin uploads the certificate design through the admin portal (`ManageCertificates` → "Upload Design" button)
8. Student sees the uploaded certificate image in their dashboard

### Certificate Features
- Admin-designed custom certificate image (uploaded via ImageKit)
- Simple image viewer with download/print option
- Fallback "Certificate Pending" placeholder while admin designs
- Unique certificate ID (`CHA-YYYY-NNNNN`)
- Public verification page

### Certificate Model Fields
- `certificateId` — unique ID (e.g., `CHA-2026-12345`)
- `studentEmail` / `studentName`
- `courseId` / `courseName`
- `paymentStatus` — `pending` | `approved` | `rejected`
- `isVerified` — boolean
- `paymentMethod` — `bank_transfer` | `paystack`
- `paystackReference` — Paystack transaction reference
- `certificateImage` — ImageKit URL of uploaded certificate design
- `paymentProof` — URL of student's payment proof screenshot

### Admin Notification
When a student pays for a certificate, the admin receives:
- **WhatsApp message** to `08134438808` with student name, email, course, certificate ID, and payment method
- **Email** to `creatorshubacademy3@gmail.com` with full details and direct links to WhatsApp/email the student

### Certificate Assets
- `public/logo.png` — Academy logo
- `public/signature.png` — Founder's signature (fallback in certificate design)

---

## 13. Image Handling

### Upload Flow
1. Teacher selects image in UpdateCourse form
2. Frontend requests ImageKit signature from `/get-ik-signature`
3. Frontend uploads directly to ImageKit CDN
4. ImageKit URL is saved to MongoDB `Course.image` field

### Display
- All course images use `course.image` with fallback to `course.thumbnail` (legacy) and `/logo.png`
- `onError` handlers prevent broken image icons
- Images use `loading="lazy"` and `decoding="async"` for performance
- Homepage banner uses `public/banner-hero.jpg`
- Founder photo in "Share Your Knowledge" section uses direct postimg.cc URL
- Profile pictures fallback to `/logo.png` instead of `/default-avatar.png`

---

## 14. YouTube Video Integration

- Lessons use YouTube video URLs via IFrame API
- Player initialization includes proper cleanup and error handling
- Standard YouTube embed (`youtube.com/embed`) — no `youtube-nocookie` restriction
- **No iframe sandbox restrictions** — full YouTube player controls enabled
- **No keyboard control blocks** — students can use spacebar, arrow keys, etc.
- **No context menu block** — right-click enabled on video player
- **No beforeunload warning** — no browser prompt when leaving page
- Forward seek is locked to ensure students watch full content
- Auto-completion at 90% watch time
- Supports standard YouTube URLs, embed URLs, Shorts, and youtu.be links
- Resume memory: Watch position is saved before switching lessons and on pause/end
- Clean fallback UI with "Watch on YouTube" button if embed fails

---

## 15. PDF Document Summary

The PDF summary view provides a professional lesson brief when no actual PDF is available:
- Gradient header with lesson title and module info
- "About This Lesson" brief using `lessonDescription`
- Core Principles and Practice Guide cards
- Lesson metadata grid (Module, Lesson, Duration, Format)
- Print and AI Tutor actions in footer
- If a real PDF URL exists (`/uploads/` or HTTP), it loads in an iframe with loading/error states

## 15. Important Code Conventions

- **State Management**: React Query for server state, React useState for UI state
- **Authentication**: Firebase Auth with custom hook `useAuth`
- **API Calls**: Always use `useAxiosSecure` hook (attaches Firebase token)
- **Error Handling**: React Query `onError` callbacks + toast notifications
- **Loading States**: `LoaderSpinner` for full-page loading, `LoaderDotted` for content areas
- **Route Protection**: `PrivateRoute` component wraps authenticated pages
- **Forms**: DaisyUI form components with validation
- **Error Boundary**: Global `ErrorBoundary` component catches UI errors gracefully

---

## 16. Recent Implementations & Fixes

### Frontend Improvements
1. **Critical Bug Fixes**:
   - Fixed `setIsChatOpen` undefined crash in CoursePlayer (`setAiDrawerOpen`)
   - Fixed `Math.max()` empty array crash in ExamPage
   - Fixed `NaN.toFixed()` crash in CourseCard and renderStars
   - Fixed direct DOM manipulation in Certificate.jsx
   - Fixed YouTube playback errors by removing invalid API parameters and adding proper error handling
   - Fixed unused `useRef` import in ManageCertificates.jsx (lint fix)

2. **Auth & Security**:
   - Replaced raw `axios` with `useAxiosSecure` in VerifyCertificate, PlatformStats, CourseDetails
   - Added input sanitization to AI chat endpoint
   - Added URL validation and domain allowlist for payment proof uploads

3. **UI/UX Improvements**:
   - Redesigned About page with professional founder section
   - Added Stanley Chukwunonso Okonkwo biography and contact cards
   - Updated home screen with new banner image in TrustedClients section
   - Updated "Share Your Knowledge" section with new founder photo
   - Simplified certificate design — admin uploads custom image via admin portal
   - Added certificate image upload button in ManageCertificates admin page
   - Added ErrorBoundary for graceful error handling
   - Improved PDF loading with spinner, error state, and fallback UI
   - Added ARIA labels and roles for accessibility
   - Fixed all course images with fallbacks and error handlers
    - Redesigned PDF summary with professional lesson brief UI
    - **Removed beforeunload warning** when video is playing
    - **Removed YouTube iframe sandbox restrictions** for full player controls
    - **Removed keyboard control blocks** for natural video interaction
    - **Removed context menu block** for better UX
    - **Added professional Framer Motion animations** across homepage, course cards, navbar, login/signup forms, and dashboard components
    - **Banner**: Staggered entrance animations, floating background blobs, animated stat cards with hover scale
    - **TrustedClients**: Staggered skill tag animations with hover scale
    - **PlatformStats**: Animated number counters with eased counting, staggered card entrances, hover lift effects
    - **WhyChoose**: Staggered feature card animations with scale/lift on hover
    - **Feedback**: Staggered testimonial cards with hover scale and lift
    - **CallToAction**: Fade-in overlay animation, animated CTA button with scale on hover/tap
    - **CourseCard**: Entrance animations, hover scale and lift effects
    - **Navbar**: Scroll-based background blur and opacity transition
    - **Login/Signup**: Form entrance animations with scale and fade

4. **Certificate Workflow (New)**:
   - Admin receives WhatsApp + email notification when student pays for certificate
   - Admin designs certificate externally (Canva/Photoshop)
   - Admin uploads certificate image through admin portal (`ManageCertificates` → "Upload Design")
   - Student sees uploaded certificate image with download option
   - Fallback "Certificate Pending" placeholder shown while admin designs
   - Backend route `PATCH /certificates/:id/upload-image` added
   - Certificate model updated with `certificateImage` field

5. **Performance**:
   - Memoized module computation and event handlers in CoursePlayer
   - Stabilized useEffect dependencies with useRef
   - Added `loading="lazy"` and `decoding="async"` to images
   - Memoized slider settings in NewCourses and PopularCourses

6. **Course Data**:
   - Added 10 new high-income courses for 2026
   - Added 10 youth-focused courses (Personal Branding, AI Automation, etc.)
   - Added Theology & Christian Living course
   - Removed duplicate courses from backend seed data
   - Total: 23+ unique courses across 15+ categories

### Backend Improvements
1. **Schema Updates**:
   - Added `pdfUrl` field to Lesson model for PDF document support
   - Renamed `Course.thumbnail` to `Course.image` for frontend consistency
   - Added `certificateImage` field to Certificate model for admin-uploaded designs

2. **AI Chat Upgrade**:
   - Added comprehensive platform knowledge to system prompt
   - Includes all 23+ courses with categories
   - Includes navigation map, payment info, certificate flow
   - Includes founder biography and contact information
   - AI can now answer platform questions and guide students accurately

3. **AI Chat Fix**:
   - Added input sanitization to `/api/ai/chat`
   - Validates prompt is non-empty string
   - Truncates long inputs
   - Strips non-text fields to prevent Gemini errors

4. **Certificate Admin Notification**:
   - New `sendAdminCertificateNotification` function in `emailService.js`
   - Sends WhatsApp message to `08134438808` on every certificate payment
   - Sends email to `creatorshubacademy3@gmail.com` with student details
   - Triggered on both bank transfer and Paystack payments
   - Includes student name, email, course, certificate ID, payment method, and action buttons

5. **Seed Data**:
   - Updated `seedCourses.js` with all 23+ courses
   - Includes duplicate prevention logic

---

## 17. Known Limitations & Future Improvements

### Current Limitations
1. **PDF Documents**: The PDF reading feature requires actual PDF files hosted on the server. Currently, lessons without PDFs show a text summary instead.
2. **Image Input in AI**: The AI chatbot is text-only. Do not attempt to send images to Gemini Flash as it does not support multimodal input.
3. **Course Images**: Some older MongoDB documents may still use `thumbnail` instead of `image`. Run `fixCourseImages.js` to migrate.
4. **Certificate Design**: Certificates are now manually designed by admin and uploaded via admin portal. There is no auto-generated certificate design anymore.

### Recommended Improvements
1. **PDF Upload**: Add backend endpoint for teachers to upload PDF documents linked to lessons
2. **Video Upload**: Consider direct video upload or Vimeo/Wistia integration instead of YouTube-only
3. **Certificate Template Gallery**: Add pre-made certificate templates in admin portal for faster design
4. **Bulk Certificate Generation**: Allow admin to generate multiple certificates at once from approved list
5. **Mobile App**: Build React Native or Flutter mobile app for better mobile experience
6. **Analytics Dashboard**: Add detailed analytics for teachers (watch time, drop-off points, quiz performance)
7. **Discussion Forum**: Add Q&A or discussion board per course/lesson
8. **Certificate Verification API**: Public API endpoint for third-party verification
9. **Bulk Course Import**: Allow teachers to import courses from CSV/JSON
10. **Multi-language Support**: i18n for international users
11. **Dark Mode Toggle**: Currently dark-only, but could add theme switcher

---

## 18. Maintenance Notes

### Regular Tasks
- Monitor Render backend logs for errors
- Check Sentry dashboard for frontend/backend exceptions
- Verify Paystack transactions and certificate approvals weekly
- Keep dependencies updated (`npm audit`, `npm update`)
- Backup MongoDB Atlas database regularly
- Monitor ImageKit usage and bandwidth

### Common Issues
| Issue | Solution |
|-------|----------|
| **"Model does not support image input"** | Backend sanitization already fixed this. Ensure `/api/ai/chat` only receives text prompts |
| **PDF not loading** | Check `lesson.pdfUrl` in database. Must be valid HTTP(S) URL or `/uploads/` path |
| **Course images broken** | Run `node fixCourseImages.js` to migrate old `thumbnail` field to `image` |
| **YouTube player not loading** | Ensure `window.YT` is available. Check video URL format. Player uses standard YouTube embed without sandbox restrictions |
| **Certificate not generating** | Check `certificate.paymentStatus === "approved"` and `isVerified === true`. Admin must upload certificate design via `ManageCertificates` → "Upload Design" |
| **Certificate image not showing** | Admin must upload certificate design via admin portal. Check `certificate.certificateImage` field in database |
| **New courses not appearing** | Run `node seedCourses.js` to insert new courses into MongoDB |
| **Video download needed** | Use `download-all-videos.js` or `export-video-urls.js` in backend folder. Requires `yt-dlp` installed. Backend endpoint `GET /lessons/all-with-videos` returns all lessons with video URLs. |

### Git Workflow
- **Frontend Repo**: `https://github.com/stanleyokonkwo282-eng/OfficialStanleyTechHub`
- **Backend Repo**: `https://github.com/stanleyokonkwo282-eng/creators-hub-academy-backend`
- **Main Branch**: `main`
- **Deployment**: Auto-deploys on push to `main` via Vercel/Render

---

## 19. Creator & Developer Information

**Project Creator & Visionary**:  
Stanley Chukwunonso Okonkwo  
Founder, Creators Hub Academy  
Mission: To bless lives and transform society through accessible digital education.

**Founder Profile**:
- Visionary technologist and multimedia expert
- Diploma in Computer Science
- 8+ years cross-industry experience in ICT, administration, and financial management
- Expertise: MERN stack, database engineering, AI prompt engineering, livestreaming, multimedia production
- Philosophy: Technology is a profound tool for service and human empowerment

**Platform Purpose**:  
Creators Hub Academy exists to ensure that no talented individual is held back by lack of access to quality education. Every course is free. Every certificate is verified. Every student has the potential to change their life and contribute meaningfully to society.

**Built With**:  
React, Node.js, MongoDB, Firebase, ImageKit, Gemini AI, Paystack, Tailwind CSS, and a deep commitment to empowering the next generation of digital creators.

---

## 20. Contact Information

**Founder**: Stanley Chukwunonso Okonkwo
- **WhatsApp**: +234 813 443 8808
- **Email**: hello@creatorshubacademy.com
- **Admin WhatsApp (Certificate Payments)**: 08134438808
- **Admin Email (Certificate Payments)**: creatorshubacademy3@gmail.com
- **Opay**: 8134438808 (Nonso Stanley Okonkwo)
- **Polaris Bank**: 3046748449 (Nonso Stanley Okonkwo)
- **Support Hours**: 9AM to 6PM WAT

---

*This LMS is more than code—it is a tool for transformation. Use it well, bless many, and never stop improving.*

**— Creators Hub Academy Team**
