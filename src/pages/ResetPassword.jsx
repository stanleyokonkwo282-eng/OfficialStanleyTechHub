import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import HeadTag from "../components/common/HeadTag";
import LoaderSpinner from "../components/common/LoaderSpinner";
import useAuth from "../hooks/useAuth";

// Custom in-app password-reset handler. Reset emails link back here
// via actionCodeSettings (handleCodeInApp). Firebase's hosted __/auth/action
// page appends the oobCode to the continueUrl EITHER as a query string
// (?oobCode=...) OR as a URL fragment (#mode=resetPassword&oobCode=...)
// depending on the client — read BOTH so a valid link can never land on
// "No reset code found".
// Gmail/Outlook prefetchers + double-clicks burn the single-use oobCode —
// that is what produced Firebase's generic "expired or already used" page.
const readParam = (searchParams, name) => {
  const fromQuery = searchParams.get(name);
  if (fromQuery) return fromQuery;
  const rawHash = window.location.hash || "";
  if (!rawHash) return "";
  const hashParams = new URLSearchParams(
    rawHash.startsWith("#") ? rawHash.slice(1) : rawHash
  );
  return hashParams.get(name) || "";
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyResetCode, confirmReset, sendResetEmail } = useAuth();

  const oobCode = readParam(searchParams, "oobCode") || "";
  const emailHint = readParam(searchParams, "email") || "";
  const mode = readParam(searchParams, "mode") || "";

  const [status, setStatus] = useState(oobCode ? "verifying" : "missing");
  const [verifiedEmail, setVerifiedEmail] = useState(emailHint);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [resendEmail, setResendEmail] = useState(
    String(localStorage.getItem("chub_reset_email") || "") || emailHint
  );
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus("missing");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const email = await verifyResetCode(oobCode);
        if (cancelled) return;
        setVerifiedEmail(email || emailHint);
        setResendEmail(email || emailHint);
        setStatus("valid");
        // Strip the oobCode from the address bar so refresh/prefetch can't
        // accidentally re-submit (and burn) the single-use code again.
        try {
          const clean = `${window.location.pathname}?email=${encodeURIComponent(email || emailHint || "")}`;
          window.history.replaceState({}, "", clean);
        } catch {
          /* history API unavailable — non-blocking */
        }
      } catch (err) {
        if (cancelled) return;
        console.error("[Reset link invalid]", err?.code, err?.message);
        setStatus("invalid");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oobCode]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await confirmReset(oobCode, newPassword);
      setDone(true);
      toast.success("Password updated! Please log in.");
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      console.error("[Confirm reset failed]", err?.code, err?.message);
      if (err?.code === "auth/expired-action-code" || err?.code === "auth/invalid-action-code") {
        setStatus("invalid");
        toast.error("Link expired or already used. Request a fresh one below.");
      } else if (err?.code === "auth/weak-password") {
        toast.error("Password too weak — use at least 6 characters.");
      } else {
        toast.error("Could not reset password. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    const email = String(resendEmail || "").trim();
    if (!email) {
      toast.error("Enter your email to resend the link.");
      return;
    }
    setResending(true);
    try {
      await sendResetEmail(email);
      toast.success("Fresh email sent! Use the NEWEST link.", { autoClose: 7000 });
    } catch (err) {
      toast.error(err?.message || "Failed to resend.");
    } finally {
      setResending(false);
    }
  };

  const pwForm = (
    <form onSubmit={handleConfirm} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-300">New password</label>
        <div className="flex items-center rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2">
          <FaLock className="mr-2 text-yellow-400" />
          <input
            type={showPw ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 6 characters"
            autoComplete="new-password"
            className="w-full bg-transparent text-white placeholder-gray-500 outline-none"
          />
          <button type="button" onClick={() => setShowPw((v) => !v)} className="ml-2 text-gray-400 hover:text-yellow-400">
            {showPw ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-300">Confirm new password</label>
        <div className="flex items-center rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2">
          <FaLock className="mr-2 text-yellow-400" />
          <input
            type={showPw ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            autoComplete="new-password"
            className="w-full bg-transparent text-white placeholder-gray-500 outline-none"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-yellow-400 py-2 font-medium text-black hover:bg-yellow-500 disabled:opacity-50"
      >
        {submitting ? "Updating..." : "Set new password"}
      </button>
    </form>
  );

  const resendForm = (
    <form onSubmit={handleResend} className="mt-4 space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">Request a fresh link</label>
      <div className="flex gap-2">
        <input
          type="email"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-gray-500 outline-none"
        />
        <button
          type="submit"
          disabled={resending}
          className="shrink-0 rounded-md bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500 disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend"}
        </button>
      </div>
    </form>
  );

  return (
    <>
      <HeadTag title="Creators Hub Academy | Reset Password" />
      <div className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-8 shadow-lg"
        >
          <h2 className="mb-2 text-center text-2xl font-bold text-white">Reset your password</h2>
          <p className="mb-6 text-center text-sm text-gray-400">
            {verifiedEmail ? (<>for <span className="text-amber-300">{verifiedEmail}</span></>) : "Choose a new password."}
          </p>
          {status === "verifying" && <LoaderSpinner />}
          {status === "missing" && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
              <p className="font-semibold">
                {mode === "resetPassword"
                  ? "Reset link received — continue below."
                  : "No reset code found. Open the email link once."}
              </p>
              <p className="mt-2">
                {mode === "resetPassword"
                  ? "Use the NEWEST reset email, click its link ONCE, then finish here within 1 hour."
                  : "If you clicked a link and see this, your email client may have opened it in a preview — open the NEWEST email and click its link once."}
              </p>
              {resendForm}
            </div>
          )}
          {status === "invalid" && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              <p className="flex items-center gap-2 font-semibold"><FaExclamationTriangle /> Link expired or already used.</p>
              <p className="mt-2">Each email cancels older links — use the newest email, click once, finish in 1 hour.</p>
              {resendForm}
              <p className="mt-4 text-center">
                <Link to="/login" className="text-yellow-400 hover:underline">Back to Login</Link>
              </p>
            </div>
          )}
          {status === "valid" && !done && pwForm}
          {done && (
            <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4 text-center text-sm text-green-200">
              <FaCheckCircle className="mx-auto mb-2 text-2xl" />
              <p className="font-semibold">Password updated! Redirecting to login…</p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}