import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Check, X, Loader2 } from "lucide-react";
import { checkUsername, type UpdateProfilePayload } from "@/lib/api";

const AVATAR_COLORS = [
  { hex: "#DC2626", label: "Red" },
  { hex: "#2563EB", label: "Blue" },
  { hex: "#16a34a", label: "Green" },
  { hex: "#7c3aed", label: "Purple" },
  { hex: "#ea580c", label: "Orange" },
  { hex: "#db2777", label: "Pink" },
  { hex: "#0d9488", label: "Teal" },
  { hex: "#ca8a04", label: "Gold" },
];

const SPORTS = [
  "Athletics", "Swimming", "Cycling", "Football", "Basketball",
  "Tennis", "Rugby", "Boxing", "Wrestling", "Gymnastics",
  "Rowing", "Triathlon", "Weightlifting", "Volleyball", "Hockey",
  "Baseball", "Cricket", "Golf", "Martial Arts", "Other",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

interface Props {
  userName: string;
  onComplete: (payload: UpdateProfilePayload) => Promise<void>;
}

export default function ProfileSetup({ userName, onComplete }: Props) {
  const [avatarColor, setAvatarColor] = useState("#DC2626");
  const [username, setUsername] = useState(
    userName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9_.]/g, "").slice(0, 20)
  );
  const [bio, setBio] = useState("");
  const [sport, setSport] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  const checkAvailability = useCallback(async (val: string) => {
    if (val.length < 3) { setUsernameStatus("idle"); return; }
    setUsernameStatus("checking");
    try {
      const res = await checkUsername(val);
      setUsernameStatus(res.available ? "available" : "taken");
    } catch {
      setUsernameStatus("idle");
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => checkAvailability(username), 500);
    return () => clearTimeout(t);
  }, [username, checkAvailability]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (usernameStatus === "taken") { setError("That username is already taken."); return; }
    if (username.length < 3) { setError("Username must be at least 3 characters."); return; }
    if (!sport) { setError("Please choose your sport."); return; }
    setSaving(true);
    setError("");
    try {
      await onComplete({ username, bio, sport, country, avatarColor });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Activity className="h-7 w-7 text-red-500" />
          <span className="font-display font-black text-2xl text-white tracking-tight">CLEANSPORT</span>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-2 rounded-full bg-red-600" />
          <div className="w-8 h-2 rounded-full bg-red-600" />
          <div className="w-8 h-2 rounded-full bg-slate-700" />
          <span className="text-slate-400 text-sm ml-2">Step 2 of 2</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-black text-white tracking-tight mb-2">
            Set up your profile
          </h1>
          <p className="text-slate-400">Let other athletes know who you are.</p>
        </div>

        {/* Avatar preview + color picker */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            key={avatarColor}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-4 ring-4 ring-white/10"
            style={{ backgroundColor: avatarColor }}
          >
            {getInitials(userName)}
          </motion.div>

          <p className="text-slate-400 text-sm mb-3">Choose your colour</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setAvatarColor(c.hex)}
                title={c.label}
                className="w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none"
                style={{ backgroundColor: c.hex, boxShadow: avatarColor === c.hex ? `0 0 0 3px white, 0 0 0 5px ${c.hex}` : "none" }}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-medium select-none">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, 30);
                  setUsername(val);
                  setUsernameStatus("idle");
                }}
                placeholder="yourname"
                className="w-full pl-8 pr-10 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                autoComplete="off"
                spellCheck={false}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <AnimatePresence mode="wait">
                  {usernameStatus === "checking" && (
                    <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                    </motion.div>
                  )}
                  {usernameStatus === "available" && (
                    <motion.div key="ok" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <Check className="w-4 h-4 text-green-400" />
                    </motion.div>
                  )}
                  {usernameStatus === "taken" && (
                    <motion.div key="taken" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <X className="w-4 h-4 text-red-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <AnimatePresence>
              {usernameStatus === "taken" && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs mt-1">
                  @{username} is already taken.
                </motion.p>
              )}
              {usernameStatus === "available" && username.length >= 3 && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-green-400 text-xs mt-1">
                  @{username} is available!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Bio <span className="text-slate-500 font-normal">({bio.length}/160)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              rows={3}
              placeholder="Tell the community a little about yourself…"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
          </div>

          {/* Sport */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Your sport</label>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSport(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    sport === s
                      ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                      : "bg-slate-800 text-slate-300 border border-slate-600 hover:border-slate-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value.slice(0, 60))}
              placeholder="e.g. United States"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={saving || usernameStatus === "taken" || username.length < 3 || !sport}
            className={`w-full py-4 rounded-xl font-display font-bold text-lg tracking-widest transition-all mt-2 ${
              !saving && usernameStatus !== "taken" && username.length >= 3 && sport
                ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Setting up…
              </span>
            ) : (
              "FINISH SETUP →"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
