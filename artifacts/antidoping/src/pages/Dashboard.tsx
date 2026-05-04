import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDashboard, completeModule } from "@/lib/api";

interface DashboardData {
  user: { id: number; name: string; email: string; role: string };
  stats: { modulesCompleted: number; totalModules: number; complianceScore: number; testsCount: number };
  modules: { slug: string; title: string; durationMinutes: number; completed: boolean; score: number }[];
  recentTests: { id: number; test_date: string; status: string; location: string }[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const MODULE_QUIZZES: Record<string, QuizQuestion> = {
  "intro-anti-doping": {
    question: "What does WADA stand for?",
    options: [
      "World Athletics Doping Authority",
      "World Anti-Doping Agency",
      "Worldwide Athletic Drug Administration",
      "World Association of Drug Athletes",
    ],
    correct: 1,
    explanation: "WADA — the World Anti-Doping Agency — sets global anti-doping standards.",
  },
  "prohibited-substances": {
    question: "Which of the following is ALWAYS prohibited, both in and out of competition?",
    options: [
      "Caffeine",
      "Ibuprofen",
      "Anabolic steroids",
      "Antihistamines",
    ],
    correct: 2,
    explanation: "Anabolic steroids are on the WADA prohibited list at all times, not just during competition.",
  },
  "testing-procedures": {
    question: "What must an athlete do when notified for a doping test?",
    options: [
      "Ask for a 48-hour delay",
      "Contact their coach before going",
      "Report immediately and remain under supervision until the sample is given",
      "Request a different testing officer",
    ],
    correct: 2,
    explanation: "Athletes must report immediately and stay under supervision to ensure sample integrity.",
  },
  "therapeutic-use-exemptions": {
    question: "What is a Therapeutic Use Exemption (TUE)?",
    options: [
      "A waiver allowing athletes to skip drug tests",
      "Permission to use a prohibited substance for a genuine medical need",
      "A certificate proving an athlete is drug-free",
      "An exemption from competition rules for injured athletes",
    ],
    correct: 1,
    explanation: "A TUE grants permission to use a prohibited substance when medically necessary — it must be approved in advance.",
  },
  "athlete-whereabouts": {
    question: "Why must top-level athletes submit their whereabouts information?",
    options: [
      "To track their travel for sponsorship purposes",
      "So they can receive prize money more easily",
      "To enable no-notice out-of-competition testing",
      "To confirm their competition schedule to federations",
    ],
    correct: 2,
    explanation: "Whereabouts information allows testing authorities to locate athletes for surprise out-of-competition tests.",
  },
  "consequences-of-doping": {
    question: "What is the standard sanction for a first anti-doping rule violation?",
    options: [
      "A warning and fine",
      "A 6-month ban",
      "A 4-year ban (or lifetime for serious violations)",
      "Mandatory retirement",
    ],
    correct: 2,
    explanation: "The standard sanction under the WADA Code is a 4-year ban for a first violation, with lifetime bans for the most serious cases.",
  },
};

function getQuizForModule(slug: string): QuizQuestion {
  return (
    MODULE_QUIZZES[slug] ?? {
      question: "What is the primary purpose of anti-doping programs in sport?",
      options: [
        "To reduce the cost of competitions",
        "To protect the health of athletes and the integrity of sport",
        "To increase media coverage",
        "To limit the number of competitors",
      ],
      correct: 1,
      explanation: "Anti-doping programs exist to protect athletes' health and ensure fair competition for everyone.",
    }
  );
}

interface QuizModalProps {
  module: { slug: string; title: string };
  roleColor: string;
  onSuccess: () => void;
  onClose: () => void;
}

function QuizModal({ module, roleColor, onSuccess, onClose }: QuizModalProps) {
  const quiz = getQuizForModule(module.slug);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const isCorrect = submitted && selected === quiz.correct;
  const isWrong = submitted && selected !== quiz.correct;

  async function handleConfirm() {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === quiz.correct) {
      setSaving(true);
      await onSuccess();
      setSaving(false);
    }
  }

  function handleRetry() {
    setSelected(null);
    setSubmitted(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <div
            className="inline-block text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-3"
            style={{ background: roleColor }}
          >
            Quick Check · {module.title}
          </div>
          <p className="text-gray-500 text-sm">
            Answer this question to confirm you've completed the module.
          </p>
        </div>

        {/* Question */}
        <p className="font-bold text-gray-900 text-lg mb-5 leading-snug">{quiz.question}</p>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-6">
          {quiz.options.map((opt, i) => {
            let bg = "bg-gray-50 border-gray-200 text-gray-800 hover:border-gray-400";
            if (submitted) {
              if (i === quiz.correct) bg = "bg-green-50 border-green-500 text-green-800";
              else if (i === selected) bg = "bg-red-50 border-red-400 text-red-800";
              else bg = "bg-gray-50 border-gray-200 text-gray-400";
            } else if (selected === i) {
              bg = "border-2 text-gray-900";
            }

            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  selected === i && !submitted
                    ? "border-2"
                    : ""
                } ${bg}`}
                style={selected === i && !submitted ? { borderColor: roleColor } : {}}
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={
                    selected === i && !submitted
                      ? { background: roleColor, color: "#fff" }
                      : { background: "#e5e7eb", color: "#6b7280" }
                  }
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg px-4 py-3 mb-5 text-sm font-medium ${
                isCorrect
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {isCorrect ? (
                <span>✅ Correct! {quiz.explanation}</span>
              ) : (
                <span>❌ Not quite. {quiz.explanation}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          {!submitted ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selected === null}
                className="flex-1 px-4 py-3 rounded-lg text-white font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: selected !== null ? roleColor : "#9ca3af" }}
              >
                Submit Answer
              </button>
            </>
          ) : isCorrect ? (
            <button
              disabled={saving}
              className="w-full px-4 py-3 rounded-lg text-white font-bold text-sm transition-colors"
              style={{ background: "#16a34a" }}
              onClick={onClose}
            >
              {saving ? "Saving…" : "✓ Module Marked Complete!"}
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 px-4 py-3 rounded-lg text-white font-bold text-sm transition-colors"
                style={{ background: roleColor }}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const roleColors: Record<string, string> = {
  athlete: "#DC2626",
  coach: "#1d4ed8",
  support: "#15803d",
  official: "#374151",
};

interface Props {
  role: string;
}

export default function Dashboard({ role }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizModule, setQuizModule] = useState<{ slug: string; title: string } | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  async function handleComplete(slug: string) {
    await completeModule(slug);
    const fresh = await getDashboard();
    setData(fresh);
    setQuizModule(null);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.2rem", color: "#6B7280" }}>
          Loading dashboard…
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <p style={{ color: "#DC2626", marginBottom: "16px" }}>{error || "No data available."}</p>
      </div>
    );
  }

  const { user, stats, modules, recentTests } = data;
  const roleColor = roleColors[user.role ?? role] ?? "#374151";

  return (
    <>
      <AnimatePresence>
        {quizModule && (
          <QuizModal
            module={quizModule}
            roleColor={roleColor}
            onSuccess={() => handleComplete(quizModule.slug)}
            onClose={() => setQuizModule(null)}
          />
        )}
      </AnimatePresence>

      <div style={{ background: "#F3F4F6", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: "#111827", padding: "32px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#fff", textTransform: "uppercase" }}>
                  Welcome back, {user.name.split(" ")[0]}
                </h1>
                <span style={{ background: roleColor, color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {user.role}
                </span>
              </div>
              <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>{user.email}</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
            {[
              { label: "Modules Completed", value: `${stats.modulesCompleted}/${stats.totalModules}`, color: roleColor },
              {
                label: "Compliance Score",
                value: `${stats.complianceScore}%`,
                color: stats.complianceScore >= 80 ? "#16a34a" : stats.complianceScore >= 50 ? "#ea580c" : "#DC2626",
              },
              { label: "Tests on Record", value: stats.testsCount.toString(), color: "#6B7280" },
              { label: "Account Status", value: "Active ✓", color: "#16a34a" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "24px" }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "2rem", color: stat.color, lineHeight: 1, marginBottom: "8px" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
            {/* Modules */}
            <div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.25rem", textTransform: "uppercase", marginBottom: "4px" }}>
                Education Progress
              </h2>
              <p style={{ color: "#6B7280", fontSize: "0.8rem", marginBottom: "16px" }}>
                Answer a short question to confirm you've completed each module.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {modules.map((mod) => (
                  <div
                    key={mod.slug}
                    style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{mod.title}</span>
                        {mod.completed && (
                          <span style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", textTransform: "uppercase" }}>
                            Done
                          </span>
                        )}
                      </div>
                      <div style={{ height: "4px", background: "#F3F4F6", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: mod.completed ? "100%" : "0%", background: roleColor, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{mod.durationMinutes} min</span>
                      {!mod.completed ? (
                        <button
                          onClick={() => setQuizModule({ slug: mod.slug, title: mod.title })}
                          style={{ background: roleColor, color: "#fff", border: "none", padding: "8px 16px", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
                        >
                          Take Quiz
                        </button>
                      ) : (
                        <span style={{ color: "#16a34a", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                          ✓ Complete
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.25rem", textTransform: "uppercase", marginBottom: "16px" }}>
                {user.role === "athlete" ? "My Test Record" : "Quick Info"}
              </h2>
              {recentTests.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {recentTests.map((test) => (
                    <div key={test.id} style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{test.test_date}</span>
                        <span style={{
                          fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", padding: "2px 8px",
                          background: test.status === "clean" ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                          color: test.status === "clean" ? "#16a34a" : "#DC2626",
                        }}>
                          {test.status}
                        </span>
                      </div>
                      {test.location && <div style={{ color: "#6B7280", fontSize: "0.8rem" }}>{test.location}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📋</div>
                  <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>No test records yet.</p>
                  <p style={{ color: "#9CA3AF", fontSize: "0.78rem", marginTop: "4px" }}>
                    Records will appear here after your first doping control.
                  </p>
                </div>
              )}

              {/* Compliance Ring */}
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "24px", marginTop: "16px", textAlign: "center" }}>
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ margin: "0 auto 16px" }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke={roleColor} strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.complianceScore / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                  <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
                    style={{ fontFamily: "'Oswald', sans-serif", fontSize: "18px", fontWeight: 700, fill: roleColor }}>
                    {stats.complianceScore}%
                  </text>
                </svg>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, color: "#374151" }}>
                  Compliance Score
                </div>
                <div style={{ color: "#9CA3AF", fontSize: "0.78rem", marginTop: "4px" }}>
                  Complete all modules to reach 100%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
