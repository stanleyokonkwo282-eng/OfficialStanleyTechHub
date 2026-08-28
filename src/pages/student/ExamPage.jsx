import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ExamPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [examStarted, setExamStarted] = useState(false);

  const { data: examData, isLoading: examLoading } = useQuery({
    queryKey: ["exam", courseId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/exam/${courseId}`);
      return res.data;
    },
  });

  const { data: attemptsData, isLoading: attemptsLoading } = useQuery({
    queryKey: ["attempts", courseId, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/exam/attempts/${courseId}/${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedAnswer]) => ({ questionId, selectedAnswer })
      );
      const res = await axiosSecure.post("/exam/submit", {
        courseId,
        studentEmail: user?.email,
        studentName: user?.displayName || user?.email,
        answers: formattedAnswers,
      });
      return res.data;
    },
    onSuccess: async (data) => {
      setResult(data);
      try {
        await axiosSecure.post("/notifications/exam-completed", {
          courseId,
          courseTitle: examData?.exam?.courseTitle,
          studentEmail: user?.email,
          studentName: user?.displayName || user?.email,
          score: data?.score,
          passed: data?.passed,
        });
        toast.info("📧 Admin notified of your exam completion.", {
          autoClose: 4000,
        });
      } catch {
        toast.warn(
          "Exam saved, but the completion notification could not be sent to the admin.",
          { autoClose: 5000 }
        );
      }
    },
    onError: (err) =>
      alert(err?.response?.data?.message || "Submission failed."),
  });

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = () => {
    const totalQuestions = examData?.exam?.questions?.length || 20;
    if (Object.keys(answers).length < totalQuestions) {
      alert(
        `Please answer all ${totalQuestions} questions before submitting.`
      );
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to submit? You cannot change your answers after submission."
      )
    ) {
      submitMutation.mutate();
    }
  };

  if (examLoading || attemptsLoading) return <LoaderSpinner />;

  const exam = examData?.exam;
  const attempts = attemptsData?.attempts || [];
  const totalAttempts = attempts.length;
  const hasPassed = attempts.some((a) => a.passed);
  const isLocked = totalAttempts >= 2 && !hasPassed;

  // ── LOCKED SCREEN ──────────────────────────────────────────────
  if (isLocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-zinc-900 border border-red-500 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-400 mb-3">Exam Locked</h2>
          <p className="text-gray-300 mb-2">
            You have used both attempts and did not pass.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Your best score was{" "}
            <span className="text-white font-bold">
              {attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0}%
            </span>
            . Please contact admin to reset your exam.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-zinc-700 text-white px-6 py-3 rounded-lg hover:bg-zinc-600"
          >
            Go Back
          </button>
          <a
            href="https://wa.me/2348134438808"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 mt-3"
          >
            Contact Admin on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ──────────────────────────────────────────────
  if (result) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-3xl mx-auto">
          {/* Score Card */}
          <div
            className={`rounded-2xl p-8 text-center mb-8 border ${
              result.passed
                ? "bg-green-950 border-green-600"
                : "bg-red-950 border-red-600"
            }`}
          >
            <div className="text-7xl font-black mb-2">
              {result.score}%
            </div>
            <div
              className={`text-2xl font-bold mb-2 ${
                result.passed ? "text-green-400" : "text-red-400"
              }`}
            >
              {result.passed ? "Congratulations! You Passed!" : "Not Quite There"}
            </div>
            <p className="text-gray-300">
              You got {result.correctAnswers} out of {result.totalQuestions}{" "}
              questions correct
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Attempt {result.attemptNumber} of 2
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            {result.passed ? (
              <button
                onClick={() =>
                  navigate(`/dashboard/certificate/${courseId}`)
                }
                className="flex-1 bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-500"
              >
                Get My Certificate
              </button>
            ) : result.attemptsLeft > 0 ? (
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setExamStarted(false);
                }}
                className="flex-1 bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-500"
              >
                Retake Exam ({result.attemptsLeft} attempt left)
              </button>
            ) : null}
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-zinc-800 text-white py-3 rounded-lg hover:bg-zinc-700"
            >
              Back to Course
            </button>
          </div>

          {/* Answer Review */}
          <h3 className="text-xl font-bold mb-4 text-yellow-400">
            Answer Review
          </h3>
          <div className="space-y-4">
            {result.answers.map((ans, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 border ${
                  ans.isCorrect
                    ? "bg-green-950 border-green-700"
                    : "bg-red-950 border-red-700"
                }`}
              >
                <p className="text-white font-medium mb-2">
                  {i + 1}. {ans.question}
                </p>
                <p className="text-sm">
                  <span className="text-gray-400">Your answer: </span>
                  <span
                    className={
                      ans.isCorrect ? "text-green-400" : "text-red-400"
                    }
                  >
                    {ans.selectedAnswer || "No answer"}
                  </span>
                </p>
                {!ans.isCorrect && (
                  <p className="text-sm mt-1">
                    <span className="text-gray-400">Correct answer: </span>
                    <span className="text-green-400">{ans.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── INTRO SCREEN ───────────────────────────────────────────────
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-10 max-w-lg w-full text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-3xl font-bold text-white mb-2">Course Exam</h2>
          <p className="text-yellow-400 font-semibold mb-6">
            {exam?.courseTitle}
          </p>

          <div className="bg-zinc-900 rounded-xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Questions</span>
              <span className="text-white font-bold">
                {exam?.questions?.length || 20}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Pass Mark</span>
              <span className="text-white font-bold">{exam?.passMark || 60}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Max Attempts</span>
              <span className="text-white font-bold">2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Attempts Used</span>
              <span
                className={`font-bold ${
                  totalAttempts >= 1 ? "text-yellow-400" : "text-green-400"
                }`}
              >
                {totalAttempts} of 2
              </span>
            </div>
          </div>

          <div className="bg-yellow-950 border border-yellow-700 rounded-xl p-4 mb-6 text-left">
            <p className="text-yellow-400 font-bold text-sm mb-1">Important</p>
            <p className="text-gray-300 text-sm">
              Answer all questions before submitting. You cannot change answers
              after submission. Complete all lessons before taking the exam.
            </p>
          </div>

          <button
            onClick={() => setExamStarted(true)}
            className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition"
          >
            {totalAttempts === 0 ? "Start Exam" : "Retake Exam"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-gray-400 hover:text-white text-sm block w-full"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  // ── EXAM QUESTIONS SCREEN ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-white font-bold">{exam?.courseTitle} — Exam</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {Object.keys(answers).length} / {exam?.questions?.length || 20} answered
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {exam?.questions?.map((q, i) => (
          <div
            key={q._id}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-6"
          >
            <p className="text-white font-semibold mb-4">
              <span className="text-yellow-400 mr-2">{i + 1}.</span>
              {q.question}
            </p>
            <div role="radiogroup" aria-label={`Question ${i + 1}`}>
              {q.options.map((option, j) => (
                <button
                  key={j}
                  role="radio"
                  aria-checked={answers[q._id] === option}
                  onClick={() => handleAnswer(q._id, option)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                    answers[q._id] === option
                      ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                      : "bg-zinc-900 text-gray-300 border-zinc-700 hover:border-yellow-400 hover:text-white"
                  }`}
                >
                  <span className="mr-2 font-bold">
                    {["A", "B", "C", "D"][j]}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom Submit */}
        <div className="pb-10 text-center">
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="bg-yellow-400 text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 disabled:opacity-50 transition"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Exam"}
          </button>
          <p className="text-gray-500 text-sm mt-3">
            {Object.keys(answers).length} of {exam?.questions?.length || 20} questions answered
          </p>
        </div>
      </div>
    </div>
  );
}
