import { useState } from "react";

const roles = [
  {
    id: "athlete",
    icon: "🏃",
    title: "Athlete",
    desc: "I compete in organized sport",
  },
  {
    id: "coach",
    icon: "📋",
    title: "Coach",
    desc: "I train and guide athletes",
  },
  {
    id: "support",
    icon: "🩺",
    title: "Support Staff",
    desc: "Medical, physio, or team staff",
  },
  {
    id: "official",
    icon: "⚖️",
    title: "Official / Fan",
    desc: "Referee, administrator, or general public",
  },
];

interface Props {
  onComplete: (role: string) => void;
}

export default function WelcomeScreen({ onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  function handleContinue() {
    if (!selected) return;
    setLeaving(true);
    setTimeout(() => onComplete(selected), 500);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        transition: "opacity 0.5s ease",
        opacity: leaving ? 0 : 1,
      }}
    >
      <div style={{ width: "100%", maxWidth: "580px", textAlign: "center" }}>
        {/* Logo */}
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.06em",
            marginBottom: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span style={{ color: "#DC2626", fontSize: "1.6rem" }}>⚡</span>
          CLEANSPORT
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: "12px",
          }}
        >
          Welcome to<br />
          <span style={{ color: "#DC2626" }}>CleanSport</span>
        </h1>
        <p style={{ color: "#9CA3AF", fontSize: "1rem", marginBottom: "40px" }}>
          Tell us who you are so we can guide you to the right resources.
        </p>

        {/* Role Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
            marginBottom: "32px",
          }}
        >
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              style={{
                background: selected === role.id ? "rgba(220,38,38,0.12)" : "rgba(255,255,255,0.04)",
                border: `2px solid ${selected === role.id ? "#DC2626" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "8px",
                padding: "24px 16px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#fff",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{role.icon}</div>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "6px",
                  color: selected === role.id ? "#DC2626" : "#fff",
                }}
              >
                {role.title}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{role.desc}</div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          style={{
            width: "100%",
            padding: "16px",
            background: selected ? "#DC2626" : "rgba(255,255,255,0.08)",
            color: selected ? "#fff" : "#6B7280",
            border: "none",
            fontFamily: "'Oswald', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            cursor: selected ? "pointer" : "not-allowed",
            borderRadius: "6px",
            transition: "all 0.2s ease",
          }}
        >
          {selected ? `Continue as ${roles.find(r => r.id === selected)?.title} →` : "Select your role to continue"}
        </button>

        <p style={{ color: "#4B5563", fontSize: "0.75rem", marginTop: "20px" }}>
          Your choice helps us show you the most relevant information.
        </p>
      </div>
    </div>
  );
}
