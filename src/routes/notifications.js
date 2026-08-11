const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const Notification = require("../models/Notification");

/*
 |--------------------------------------------------------------------------
 | Admin notifications
 |--------------------------------------------------------------------------
 | Drop this router into your Render/Express backend:
 |
 |   const notificationsRouter = require("./routes/notifications");
 |   app.use("/api/notifications", notificationsRouter);
 |
 | Required Env Vars:
 |   ADMIN_EMAIL        – recipient email address (e.g. yours)
 |
 |   SMTP_HOST          – SMTP server host
 |   SMTP_PORT          – SMTP port (587 for STARTTLS)
 |   SMTP_USER          – SMTP account user
 |   SMTP_PASS          – SMTP account password / app password
 |
 |   TWILIO_ACCOUNT_SID – Twilio account SID
 |   TWILIO_AUTH_TOKEN  – Twilio auth token
 |   TWILIO_WHATSAPP_FROM – Twilio WhatsApp sender (e.g. 'whatsapp:+14155238886')
 |   ADMIN_WHATSAPP     – recipient WhatsApp number in E.164 (e.g. 'whatsapp:+2348134438808')
 |
 | Install deps in the server project:
 |   npm i nodemailer twilio mongoose
 */

const mailTransport =
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const formatMessage = ({ studentName, studentEmail, score, passed, courseTitle }) => {
  const status = passed ? "✅ PASSED" : "❌ NOT PASSED";
  return [
    `New Exam Completion Notification`,
    ``,
    `👤 Student: ${studentName || studentEmail}`,
    `📧 Email: ${studentEmail}`,
    `📚 Course: ${courseTitle || "N/A"}`,
    `📊 Score: ${score ?? "—"}%`,
    `📋 Result: ${status}`,
    ``,
    `Review this learner's progress in the Creators Hub Academy admin panel.`,
  ].join("\n");
};

const sendEmail = async (payload) => {
  if (!mailTransport) throw new Error("SMTP transport not configured");
  await mailTransport.sendMail({
    from: `"Creators Hub Academy" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🎓 New Exam Completion — Creators Hub Academy",
    text: formatMessage(payload),
  });
};

const sendWhatsApp = async (payload) => {
  if (!twilioClient) throw new Error("Twilio not configured");
  if (!process.env.ADMIN_WHATSAPP) throw new Error("ADMIN_WHATSAPP not set");
  const status = payload.passed ? "✅ PASSED" : "❌ NOT PASSED";
  const body = `🎓 New exam completion!\n` +
    `Student: ${payload.studentName || payload.studentEmail}\n` +
    `Course: ${payload.courseTitle || "N/A"}\n` +
    `Score: ${payload.score ?? "—"}%\n` +
    `Result: ${status}`;
  await twilioClient.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: process.env.ADMIN_WHATSAPP,
    body,
  });
};

// POST /api/notifications/exam-completed
// Auth-gated: a student reaching this endpoint is already authenticated.
router.post("/exam-completed", async (req, res) => {
  const {
    courseId,
    courseTitle,
    studentEmail,
    studentName,
    score,
    passed,
  } = req.body;

  if (!courseId || !studentEmail) {
    return res.status(400).json({ message: "courseId and studentEmail are required" });
  }

  const payload = {
    courseId,
    courseTitle,
    studentEmail,
    studentName: studentName || studentEmail,
    score: score ?? null,
    passed: passed ?? null,
  };

  const delivered = {};
  const channels = [];

  // Email
  try {
    await sendEmail(payload);
    delivered.email = true;
    channels.push("email");
  } catch (err) {
    console.error("Email notification failed:", err.message);
    delivered.email = false;
  }

  // WhatsApp
  try {
    await sendWhatsApp(payload);
    delivered.whatsapp = true;
    channels.push("whatsapp");
  } catch (err) {
    console.error("WhatsApp notification failed:", err.message);
    delivered.whatsapp = false;
  }

  // Persist a record for the admin log (best-effort)
  try {
    await Notification.create({ ...payload, channels, delivered });
  } catch (err) {
    console.error("Failed to persist notification record:", err.message);
  }

  return res.json({
    message: "Exam completion notifications processed",
    delivered,
    channels,
  });
});

module.exports = router;
