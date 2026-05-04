import { useState } from "react";
import { motion } from "framer-motion";

const roles = [
  { id: "athlete", label: "Athlete", emoji: "🏃", desc: "I compete in organized sport" },
  { id: "coach", label: "Coach", emoji: "📋", desc: "I train and guide athletes" },
  { id: "support", label: "Support Staff", emoji: "🩺", desc: "Medical, physio, or team staff" },
  { id: "official", label: "Official / Fan", emoji: "⚖️", desc: "Referee, administrator, or general public" },
];

interface Props {
  onComplete: (role: string) => void;
  userName: string;
}

export default function RoleSelection({ onComplete, userName }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (!selected) return;
    setSaving(true);
    await onComplete(selected);
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <div className="text-4xl font-display font-black text-white tracking-tight mb-2">
            Welcome, <span className="text-red-500">{userName}</span>!
          </div>
          <p className="text-slate-400 text-lg">Tell us who you are so we can personalise your experience.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {roles.map((r) => (
            <motion.button
              key={r.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(r.id)}
              className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all text-left
                ${selected === r.id
                  ? "border-red-600 bg-red-600/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                }`}
            >
              <span className="text-4xl">{r.emoji}</span>
              <span className="font-display font-bold text-white text-lg tracking-wide">{r.label.toUpperCase()}</span>
              <span className="text-slate-400 text-xs text-center">{r.desc}</span>
            </motion.button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected || saving}
          className={`w-full py-4 rounded-xl font-display font-bold text-lg tracking-widest transition-all
            ${selected && !saving
              ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
        >
          {saving ? "SAVING…" : selected ? "CONTINUE" : "SELECT YOUR ROLE TO CONTINUE"}
        </button>
      </motion.div>
    </div>
  );
}
