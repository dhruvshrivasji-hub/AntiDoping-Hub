import { useState } from "react";

async function register(name: string, email: string, password: string, role: string) {
  const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password, role }) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Registration failed");
  return data as { token: string; user: { id: number; name: string; email: string; role: string } };
}
async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Login failed");
  return data as { token: string; user: { id: number; name: string; email: string; role: string } };
}
function saveAuth(token: string, user: { id: number; name: string; email: string; role: string }) {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
}

interface Props {
  initialRole: string;
  onSuccess: (user: { id: number; name: string; email: string; role: string }) => void;
  onClose: () => void;
}

export default function AuthModal({ initialRole, onSuccess, onClose }: Props) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result;
      if (mode === "register") {
        result = await register(name, email, password, initialRole);
      } else {
        result = await login(email, password);
      }
      saveAuth(result.token, result.user);
      onSuccess(result.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: "420px", padding: "40px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#6B7280" }}>✕</button>

        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.6rem", textTransform: "uppercase", marginBottom: "6px" }}>
          {mode === "register" ? "Create Account" : "Sign In"}
        </h2>
        <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "28px" }}>
          {mode === "register" ? `Joining as ${initialRole}` : "Welcome back to CleanSport"}
        </p>

        {error && (
          <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", color: "#DC2626", padding: "12px 16px", fontSize: "0.875rem", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mode === "register" && (
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px", display: "block" }}>Full Name</label>
              <input
                value={name} onChange={e => setName(e.target.value)} required
                placeholder="e.g. Sarah Jenkins"
                style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", outline: "none", fontSize: "0.9375rem", fontFamily: "inherit" }}
              />
            </div>
          )}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px", display: "block" }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@example.com"
              style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", outline: "none", fontSize: "0.9375rem", fontFamily: "inherit" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px", display: "block" }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="Min. 6 characters"
              style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", outline: "none", fontSize: "0.9375rem", fontFamily: "inherit" }}
            />
          </div>
          <button
            type="submit" disabled={loading}
            style={{ background: "#DC2626", color: "#fff", border: "none", padding: "14px", fontFamily: "'Oswald', sans-serif", fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait..." : mode === "register" ? "Create Account →" : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "#6B7280" }}>
          {mode === "register" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }} style={{ color: "#DC2626", fontWeight: 700, cursor: "pointer" }}>
            {mode === "register" ? "Sign In" : "Create Account"}
          </span>
        </p>
      </div>
    </div>
  );
}
