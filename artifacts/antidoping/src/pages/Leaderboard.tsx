import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";
import { getLeaderboard } from "@/lib/api";

interface LeaderboardEntry {
  rank: number;
  id: number;
  name: string;
  role: string;
  completedCount: number;
  totalModules: number;
  complianceScore: number;
  isCurrentUser: boolean;
}

const roleColors: Record<string, string> = {
  athlete: "#DC2626",
  coach: "#1d4ed8",
  support: "#15803d",
  official: "#374151",
};

const roleLabels: Record<string, string> = {
  athlete: "Athlete",
  coach: "Coach",
  support: "Support Staff",
  official: "Official",
};

const MEDALS = [
  { bg: "bg-yellow-400", text: "text-yellow-900", label: "1st", icon: <Trophy className="h-5 w-5" /> },
  { bg: "bg-gray-300", text: "text-gray-800", label: "2nd", icon: <Medal className="h-5 w-5" /> },
  { bg: "bg-amber-600", text: "text-amber-100", label: "3rd", icon: <Medal className="h-5 w-5" /> },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const m = MEDALS[rank - 1];
    return (
      <div className={`flex items-center justify-center w-9 h-9 rounded-full ${m.bg} ${m.text} font-black text-sm shadow-md flex-shrink-0`}>
        {rank}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-700 text-slate-300 font-bold text-sm flex-shrink-0">
      {rank}
    </div>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [totalModules, setTotalModules] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLeaderboard()
      .then((data) => {
        setEntries(data.entries);
        setTotalModules(data.totalModules);
      })
      .catch(() => setError("Could not load leaderboard."))
      .finally(() => setLoading(false));
  }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const currentUserEntry = entries.find((e) => e.isCurrentUser);

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800 py-16">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, #DC2626 40px, #DC2626 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #DC2626 40px, #DC2626 41px)" }} />
        </div>
        <div className="container px-4 md:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              <Trophy className="h-3.5 w-3.5" /> Global Rankings
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-white uppercase tracking-tight mb-4">
              Compliance<br /><span className="text-red-500">Leaderboard</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">
              Athletes ranked by how many education modules they've completed. Train your mind as hard as your body.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-12 max-w-3xl mx-auto">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-slate-400 text-lg animate-pulse">Loading rankings…</div>
          </div>
        )}

        {error && (
          <div className="text-center py-24 text-red-400">{error}</div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-24">
            <Star className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No athletes on the board yet.</p>
            <p className="text-slate-600 text-sm mt-2">Sign in and complete modules to claim the top spot.</p>
          </div>
        )}

        {/* Current user callout */}
        {currentUserEntry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl border-2 border-red-600/50 bg-red-600/10 flex items-center gap-4"
          >
            <RankBadge rank={currentUserEntry.rank} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">Your Position</p>
              <p className="text-slate-400 text-xs">Rank #{currentUserEntry.rank} · {currentUserEntry.complianceScore}% compliance</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-red-400 font-black text-xl">{currentUserEntry.complianceScore}%</span>
            </div>
          </motion.div>
        )}

        {/* Podium (top 3) */}
        {top3.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Top Athletes</p>
            <div className="flex flex-col gap-3">
              {top3.map((entry, i) => {
                const roleColor = roleColors[entry.role] ?? "#374151";
                const medalBgs = ["bg-yellow-400/10 border-yellow-400/30", "bg-gray-400/10 border-gray-400/30", "bg-amber-700/10 border-amber-700/30"];
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${entry.isCurrentUser ? "border-red-500/60 bg-red-600/10" : medalBgs[i]} ${entry.isCurrentUser ? "" : ""}`}
                  >
                    <RankBadge rank={entry.rank} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-white font-bold truncate">
                          {entry.name}
                          {entry.isCurrentUser && <span className="ml-2 text-xs text-red-400 font-bold">(You)</span>}
                        </span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                          style={{ background: `${roleColor}22`, color: roleColor }}
                        >
                          {roleLabels[entry.role] ?? entry.role}
                        </span>
                      </div>
                      <ScoreBar score={entry.complianceScore} color={roleColor} />
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-white font-black text-xl">{entry.complianceScore}%</div>
                      <div className="text-slate-500 text-xs">{entry.completedCount}/{entry.totalModules} modules</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rest of the list */}
        {rest.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">All Rankings</p>
            <div className="flex flex-col gap-2">
              {rest.map((entry, i) => {
                const roleColor = roleColors[entry.role] ?? "#374151";
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                    className={`flex items-center gap-4 p-3 rounded-lg border ${
                      entry.isCurrentUser
                        ? "border-red-500/50 bg-red-600/10"
                        : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                    } transition-colors`}
                  >
                    <RankBadge rank={entry.rank} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-200 font-semibold text-sm truncate">
                          {entry.name}
                          {entry.isCurrentUser && <span className="ml-2 text-xs text-red-400 font-bold">(You)</span>}
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ background: `${roleColor}22`, color: roleColor }}
                        >
                          {roleLabels[entry.role] ?? entry.role}
                        </span>
                      </div>
                      <ScoreBar score={entry.complianceScore} color={roleColor} />
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="font-bold text-sm" style={{ color: roleColor }}>{entry.complianceScore}%</div>
                      <div className="text-slate-600 text-xs">{entry.completedCount}/{entry.totalModules}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
