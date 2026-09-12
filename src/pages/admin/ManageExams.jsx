import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";

export default function ManageExams() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [passMark, setPassMark] = useState(60);
  const [maxAttempts, setMaxAttempts] = useState(2);
  const [savedExam, setSavedExam] = useState(null);

  const { data: coursesData } = useQuery({
    queryKey: ["exam-courses", user?.email, user?.role],
    queryFn: async () => {
      // Teachers: use their dedicated endpoint; admins: fetch all approved
      const url =
        user?.role === "teacher"
          ? "/courses/teacher/" + encodeURIComponent(user.email)
          : "/courses?limit=100";
      const res = await axiosSecure.get(url);
      return res.data?.courses || res.data?.data || [];
    },
  });

  const coursesRaw = Array.isArray(coursesData) ? coursesData : [];
  // Teachers see only their own courses; admins see all
  const courses =
    user?.role === "teacher"
      ? coursesRaw.filter(
          (c) =>
            c.instructorEmail === user.email ||
            c.teacherEmail === user.email ||
            c.createdBy === user.email
        )
      : coursesRaw;

  useEffect(() => {
    if (!selectedCourseId) {
      setQuestions([]);
      setSavedExam(null);
      return;
    }
    const loadExam = async () => {
      try {
        const res = await axiosSecure.get(`/exam/${selectedCourseId}`);
        const exam = res.data?.exam;
        if (exam) {
          setQuestions(
            exam.questions.map((q) => ({
              _id: q._id,
              question: q.question,
              options: q.options.length >= 4 ? q.options : [...q.options, "", "", "", ""].slice(0, 4),
              correctAnswer: q.correctAnswer || q.options[0] || "",
            }))
          );
          setPassMark(exam.passMark || 60);
          setMaxAttempts(exam.maxAttempts || 2);
          setSavedExam(exam);
        } else {
          setQuestions([createEmptyQuestion()]);
          setPassMark(60);
          setMaxAttempts(2);
          setSavedExam(null);
        }
      } catch {
        setQuestions([createEmptyQuestion()]);
        setPassMark(60);
        setMaxAttempts(2);
        setSavedExam(null);
      }
    };
    loadExam();
  }, [selectedCourseId, axiosSecure]);

  function createEmptyQuestion() {
    return {
      _id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    };
  }

  const addQuestion = () => setQuestions([...questions, createEmptyQuestion()]);

  const removeQuestion = (id) => {
    if (questions.length <= 1) {
      toast.warn("At least one question is required.");
      return;
    }
    setQuestions(questions.filter((q) => q._id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map((q) => (q._id === id ? { ...q, [field]: value } : q)));
  };

  const updateOption = (qId, optIndex, value) => {
    setQuestions(
      questions.map((q) => {
        if (q._id !== qId) return q;
        const newOpts = [...q.options];
        newOpts[optIndex] = value;
        return { ...q, options: newOpts };
      })
    );
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const validQuestions = questions
        .filter((q) => q.question.trim())
        .map((q) => {
          const filledOpts = q.options.map((o, i) => o?.trim() || `Option ${i + 1}`);
          return {
            question: q.question.trim(),
            options: filledOpts,
            correctAnswer: q.correctAnswer || filledOpts[0],
          };
        });
      if (validQuestions.length === 0) throw new Error("Add at least one question.");
      const res = await axiosSecure.post("/exam/create", {
        courseId: selectedCourseId,
        questions: validQuestions,
        passMark: Number(passMark) || 60,
        maxAttempts: Number(maxAttempts) || 2,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Exam saved!");
      queryClient.invalidateQueries({ queryKey: ["exam"] });
      axiosSecure.get(`/exam/${selectedCourseId}`).then((res) => {
        if (res.data?.exam) setSavedExam(res.data.exam);
      }).catch(() => {});
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "Failed to save.");
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Exam Management</h1>
          <p className="text-zinc-400 text-sm">Create and edit multiple-choice exams for your courses.</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 mb-6">
          <label className="block text-sm font-bold text-amber-400 uppercase tracking-wide mb-3">Select Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
          >
            <option value="">-- Choose a course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
        </div>

        {selectedCourseId && (
          <>
            {savedExam && (
              <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 mb-6 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <div>
                  <p className="text-green-300 text-sm font-semibold">Exam already exists for this course</p>
                  <p className="text-green-400/70 text-xs">
                    {savedExam.questions?.length || 0} questions . {savedExam.passMark}% pass mark . {savedExam.maxAttempts} max attempts
                  </p>
                </div>
              </div>
            )}

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-amber-400 uppercase tracking-wide mb-2">Pass Mark (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={passMark}
                  onChange={(e) => setPassMark(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-400 uppercase tracking-wide mb-2">Max Attempts</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Questions ({questions.length})</h2>
                <button
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition"
                >
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </div>

              {questions.map((q, qIdx) => (
                <div key={q._id} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 relative">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-amber-400 font-bold text-sm">Question {qIdx + 1}</span>
                    <button
                      onClick={() => removeQuestion(q._id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(q._id, "question", e.target.value)}
                    placeholder="Enter your question..."
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition mb-3"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="relative">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(q._id, optIdx, e.target.value)}
                          placeholder={`Option ${["A", "B", "C", "D"][optIdx]}`}
                          className={`w-full px-4 py-2.5 bg-zinc-800 border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none transition ${
                            q.correctAnswer === opt && opt ? "border-green-500" : "border-zinc-700 focus:border-amber-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => updateQuestion(q._id, "correctAnswer", opt)}
                          className={`absolute top-1/2 -translate-y-1/2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition ${
                            q.correctAnswer === opt && opt
                              ? "bg-green-500 text-white"
                              : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                          }`}
                        >
                          {["A", "B", "C", "D"][optIdx]}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-zinc-500 text-xs mt-2">Click a letter button to mark the correct answer.</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black rounded-xl text-lg transition transform hover:scale-[1.01] shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saveMutation.isPending ? "Saving..." : "Save Exam"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
