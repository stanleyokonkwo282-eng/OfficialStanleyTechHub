# Creators Hub Academy — LMS Handover Document

## 1. About The Platform

Creators Hub Academy is a fully functional Learning Management System (LMS) built to democratize digital skills education. The platform provides free, high-quality courses in graphic design, video editing, affiliate marketing, social media strategy, AI productivity, and more. Students can enroll for free using the coupon code `CREATOR`, track lesson progress, take exams, and earn professionally designed certificates upon completion.

The mission is simple: **to bless lives and transform society** by making practical digital skills accessible to everyone—regardless of background or financial status. Education should not be a privilege; it should be a tool for empowerment, economic growth, and creative expression.

---

## 2. The Creator’s Vision

This platform was born from a deep belief that **skills today build success tomorrow**.

The founder, **Stanley Okonkwo**, envisioned a space where:
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
- **Course Discovery**: Browse new, popular, and categorized courses
- **Free Enrollment**: Use coupon `CREATOR` for 100% free access
- **Video Player**: YouTube-powered player with resume-from-last-watched, progress tracking, and forward-seek lock
- **PDF Document Summary**: Switch between video lecture and PDF reading mode with loading states and error fallbacks
- **AI Course Assistant**: Context-aware chatbot powered by Gemini Flash for lesson-specific help
- **Progress Tracking**: Auto-saved last-watched time, completion percentage, and lesson checkmarks
- **Exams**: Multiple-choice exams with 2-attempt limit and pass/fail tracking
- **Certificates**: Professional printable certificates with unique IDs, issued after exam pass and ₦10,000 verification
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

---

## 6. Architecture Overview

### Frontend Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components (CourseCard, Loaders, Sidebar, etc.)
│   └── home/            # Homepage sections (Banner, Stats, Courses, etc.)
├── pages/
│   ├── student/         # Student dashboard, CoursePlayer, Exam, Certificate
│   ├── teacher/         # Teacher course management
│   ├── admin/           # Admin panels (courses, teachers, certificates)
│   └── common/          # Shared pages (Dashboard, Login, Signup)
├── routes/              # Route guards and models
├── hooks/               # Custom hooks (useAuth, useAxiosSecure)
├── utils/               # Helpers (renderStars, ImageUploadApi)
├── data/                # Fallback/cache data
├── providers/           # Context providers (Auth)
└── styles/              # Global styles
```

### Backend Structure
```
server/
├── controllers/         # Route handlers (lessons, courses, exams, certificates, AI chat)
├── models/              # Mongoose schemas (User, Course, Lesson, Enrollment, Exam, Certificate, etc.)
├── routes/              # Express routers
├── middlewares/          # Auth, role verification, visit tracking
├── config/              # Database connection
└── index.js             # App entry, AI chat endpoint, Sentry, keep-alive
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

## 7. Important Environment Variables

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

## 8. Deployment URLs

| Environment | URL |
|-------------|-----|
| **Frontend (Production)** | https://creators-hub-academy.vercel.app |
| **Backend (Production)** | https://creators-hub-academy-backend.onrender.com |
| **Frontend (Local)** | http://localhost:5173 |
| **Backend (Local)** | http://localhost:5000 |

---

## 9. Payment Gateway

**Paystack** is integrated for certificate fee payments.

- **Live Secret Key**: Configured in Render environment variables
- **Frontend calls**: `/api/certificates/paystack/initialize` and `/api/certificates/paystack/verify/:reference`
- **Amount**: ₦10,000 per certificate
- **Flow**: Student pays → Paystack redirects with reference → Backend verifies → Certificate marked approved

**Manual Bank Transfer Option**:
- **Opay**: 8134438808 (Nonso Stanley Okonkwo)
- **Polaris Bank**: 3046748449 (Nonso Stanley Okonkwo)

---

## 10. AI Chatbot

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

## 11. Certificate System

### How It Works
1. Student completes all lessons (100% progress)
2. Student takes exam (2 attempts max)
3. If passed, student can request certificate
4. Student pays ₦10,000 via Paystack or bank transfer
5. Admin verifies payment
6. Certificate is generated with:
   - Unique certificate ID
   - Student name and course name
   - Issue date
   - Professional printable design
   - Verification status

### Certificate Features
- Premium dark navy frame with gold accents
- Ivory card with watermark and corner ornaments
- Professional typography (Playfair Display, Cormorant Garamond)
- Signature area (text fallback or `/signature.png` image)
- Official seal
- Print-ready for PDF download
- Public verification page

---

## 12. Image Handling

### Upload Flow
1. Teacher selects image in UpdateCourse form
2. Frontend requests ImageKit signature from `/get-ik-signature`
3. Frontend uploads directly to ImageKit CDN
4. ImageKit URL is saved to MongoDB `Course.image` field

### Display
- All course images use `course.image` with fallback to `course.thumbnail` (legacy) and `/logo.png`
- `onError` handlers prevent broken image icons
- Images use `loading="lazy"` and `decoding="async"` for performance

---

## 13. YouTube Video Integration

- Lessons use YouTube video URLs
- Custom player with resume-from-last-watched
- Forward seek is locked to ensure students watch full content
- Auto-completion at 90% watch time
- Supports standard YouTube URLs, embed URLs, Shorts, and youtu.be links

---

## 14. Important Code Conventions

- **State Management**: React Query for server state, React useState for UI state
- **Authentication**: Firebase Auth with custom hook `useAuth`
- **API Calls**: Always use `useAxiosSecure` hook (attaches Firebase token)
- **Error Handling**: React Query `onError` callbacks + toast notifications
- **Loading States**: `LoaderSpinner` for full-page loading, `LoaderDotted` for content areas
- **Route Protection**: `PrivateRoute` component wraps authenticated pages
- **Forms**: DaisyUI form components with validation

---

## 15. Known Limitations & Future Improvements

### Current Limitations
1. **PDF Documents**: The PDF reading feature requires actual PDF files hosted on the server. Currently, lessons without PDFs show a text summary instead.
2. **Image Input in AI**: The AI chatbot is text-only. Do not attempt to send images to Gemini Flash as it does not support multimodal input.
3. **Certificate Signature**: Currently uses a text-based "Great Vibes" font signature. To use an actual signature image, place it at `public/signature.png`.

### Recommended Improvements
1. **PDF Upload**: Add backend endpoint for teachers to upload PDF documents linked to lessons
2. **Video Upload**: Consider direct video upload or Vimeo/Wistia integration instead of YouTube-only
3. **Notification System**: Add email/in-app notifications for enrollment, exam results, certificate issuance
4. **Mobile App**: Build React Native or Flutter mobile app for better mobile experience
5. **Analytics Dashboard**: Add detailed analytics for teachers (watch time, drop-off points, quiz performance)
6. **Discussion Forum**: Add Q&A or discussion board per course/lesson
7. **Certificate Verification API**: Public API endpoint for third-party verification
8. **Bulk Course Import**: Allow teachers to import courses from CSV/JSON
9. **Multi-language Support**: i18n for international users
10. **Dark Mode Toggle**: Currently dark-only, but could add theme switcher

---

## 16. Maintenance Notes

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
| **YouTube player not loading** | Ensure `window.YT` is available. Check video URL format |
| **Certificate not generating** | Check `certificate.paymentStatus === "approved"` and `isVerified === true` |

### Git Workflow
- **Frontend Repo**: `https://github.com/stanleyokonkwo282-eng/OfficialStanleyTechHub`
- **Backend Repo**: `https://github.com/stanleyokonkwo282-eng/creators-hub-academy-backend`
- **Main Branch**: `main`
- **Deployment**: Auto-deploys on push to `main` via Vercel/Render

---

## 17. Creator & Developer Information

**Project Creator & Visionary**:  
Stanley Okonkwo  
Founder, Creators Hub Academy  
Mission: To bless lives and transform society through accessible digital education.

**Platform Purpose**:  
Creators Hub Academy exists to ensure that no talented individual is held back by lack of access to quality education. Every course is free. Every certificate is verified. Every student has the potential to change their life and contribute meaningfully to society.

**Built With**:  
React, Node.js, MongoDB, Firebase, ImageKit, Gemini AI, Paystack, Tailwind CSS, and a deep commitment to empowering the next generation of digital creators.

---

*This LMS is more than code—it is a tool for transformation. Use it well, bless many, and never stop improving.*

**— Creators Hub Academy Team**
