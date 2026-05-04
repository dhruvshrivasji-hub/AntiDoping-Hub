import { useEffect, useState } from "react";
import { getDashboard, completeModule, clearAuth } from "@/lib/api";
import { useLocation } from "wouter";

interface DashboardData {
  user: { id: number; name: string; email: string; role: string };
  stats: { modulesCompleted: number; totalModules: number; complianceScore: number; testsCount: number };
  modules: { slug: string; title: string; durationMinutes: number; completed: boolean; score: number }[];
  recentTests: { id: number; test_date: string; status: string; location: string }[];
}

const roleColors: Record<string, string> = { athlete: "#DC2626", coach: "#1d4ed8", support: "#15803d", official: "#374151" };

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError("Could not load dashboard. Please sign in again."))
      .finally(() => setLoading(false));
  }, []);

  async function handleComplete(slug: string) {
    try {
      await completeModule(slug);
      const fresh = await getDashboard();
      setData(fresh);
    } catch {}
  }

  function handleSignOut() {
    clearAuth();
    setLocation("/");
    window.location.reload();
  }

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.2rem", color: "#6B7280" }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <p style={{ color: "#DC2626", marginBottom: "16px" }}>{error}</p>
        <button onClick={() => setLocation("/")} style={{ background: "#DC2626", color: "#fff", border: "none", padding: "12px 24px", fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}>Go Home</button>
      </div>
    );
  }

  const { user, stats, modules, recentTests } = data;
  const roleColor = roleColors[user.role] ?? "#374151";

  return (
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
          <button onClick={handleSignOut} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", padding: "10px 20px", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "Modules Completed", value: `${stats.modulesCompleted}/${stats.totalModules}`, color: roleColor },
            { label: "Compliance Score", value: `${stats.complianceScore}%`, color: stats.complianceScore >= 80 ? "#16a34a" : stats.complianceScore >= 50 ? "#ea580c" : "#DC2626" },
            { label: "Tests on Record", value: stats.testsCount.toString(), color: "#6B7280" },
            { label: "Account Status", value: "Active ✓", color: "#16a34a" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "24px" }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "2rem", color: stat.color, lineHeight: 1, marginBottom: "8px" }}>{stat.value}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          {/* Modules */}
          <div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.25rem", textTransform: "uppercase", marginBottom: "16px" }}>
              Education Progress
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {modules.map(mod => (
                <div key={mod.slug} style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{mod.title}</span>
                      {mod.completed && <span style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", textTransform: "uppercase" }}>Done</span>}
                    </div>
                    <div style={{ height: "4px", background: "#F3F4F6", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: mod.completed ? "100%" : "0%", background: roleColor, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{mod.durationMinutes} min</span>
                    {!mod.completed ? (
                      <button
                        onClick={() => handleComplete(mod.slug)}
                        style={{ background: roleColor, color: "#fff", border: "none", padding: "8px 16px", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        Mark Done
                      </button>
                    ) : (
                      <span style={{ color: "#16a34a", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>✓ Complete</span>
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
                {recentTests.map(test => (
                  <div key={test.id} style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{test.test_date}</span>
                      <span style={{
                        fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", padding: "2px 8px",
                        background: test.status === "clean" ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                        color: test.status === "clean" ? "#16a34a" : "#DC2626",
                      }}>{test.status}</span>
                    </div>
                    {test.location && <div style={{ color: "#6B7280", fontSize: "0.8rem" }}>{test.location}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📋</div>
                <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>No test records yet.</p>
                <p style={{ color: "#9CA3AF", fontSize: "0.78rem", marginTop: "4px" }}>Records will appear here after your first doping control.</p>
              </div>
            )}

            {/* Progress Ring */}
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
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "18px", fontWeight: 700, fill: roleColor }}>
                  {stats.complianceScore}%
                </text>
              </svg>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, color: "#374151" }}>Compliance Score</div>
              <div style={{ color: "#9CA3AF", fontSize: "0.78rem", marginTop: "4px" }}>Complete all modules to reach 100%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
