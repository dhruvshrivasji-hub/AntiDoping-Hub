import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, X, Clock, Youtube, Filter,
  BookOpen, FlaskConical, Stethoscope, MapPin, AlertTriangle, Trophy, Dumbbell, Shield,
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  channel: string;
  duration: string;
  topic: string;
  topicLabel: string;
  description: string;
  Icon: React.ElementType;
  accent: string;
}

const VIDEOS: Video[] = [
  {
    id: "Kl3o-gFE31E",
    title: "What Is Anti-Doping? A Complete Introduction",
    channel: "WADA — World Anti-Doping Agency",
    duration: "4:32",
    topic: "basics",
    topicLabel: "Basics",
    description:
      "An animated overview of why anti-doping exists, the core principles behind the World Anti-Doping Code, and what it means for athletes worldwide.",
    Icon: BookOpen,
    accent: "#2563EB",
  },
  {
    id: "pKJnYTHVqXo",
    title: "The World Anti-Doping Code Explained",
    channel: "WADA — World Anti-Doping Agency",
    duration: "3:48",
    topic: "basics",
    topicLabel: "Basics",
    description:
      "A breakdown of the legal framework behind anti-doping enforcement — who it applies to, how violations are determined, and what athlete rights exist under the code.",
    Icon: Shield,
    accent: "#2563EB",
  },
  {
    id: "VLvKW56BCTU",
    title: "The Prohibited List: What Every Athlete Must Know",
    channel: "USADA",
    duration: "5:47",
    topic: "substances",
    topicLabel: "Substances",
    description:
      "Breaks down the WADA Prohibited List — which substances and methods are banned, the difference between in- and out-of-competition rules, and how to check medications.",
    Icon: FlaskConical,
    accent: "#DC2626",
  },
  {
    id: "v5akCMX7QQE",
    title: "Blood Doping & EPO: The Science Explained",
    channel: "Global Cycling Network",
    duration: "9:45",
    topic: "substances",
    topicLabel: "Substances",
    description:
      "EPO and blood transfusions artificially boost red blood cells and oxygen delivery. This video explains the science, the history of abuse, and how testing catches it.",
    Icon: FlaskConical,
    accent: "#DC2626",
  },
  {
    id: "1i_MCBp0sVE",
    title: "Supplement Contamination: Hidden Dangers",
    channel: "USADA",
    duration: "5:28",
    topic: "substances",
    topicLabel: "Substances",
    description:
      "Many positive tests come from contaminated supplements. This video explains how to research supplements responsibly and use the Informed Sport database.",
    Icon: FlaskConical,
    accent: "#DC2626",
  },
  {
    id: "LcNiSfSlIKA",
    title: "How Drug Testing Works in Elite Sport",
    channel: "USADA",
    duration: "6:10",
    topic: "testing",
    topicLabel: "Testing",
    description:
      "From sample collection to laboratory analysis — a step-by-step walkthrough of exactly what happens during an anti-doping test and your rights as an athlete.",
    Icon: Stethoscope,
    accent: "#7c3aed",
  },
  {
    id: "rl_TNVj0ygU",
    title: "Therapeutic Use Exemptions (TUE) Explained",
    channel: "WADA — World Anti-Doping Agency",
    duration: "3:55",
    topic: "tue",
    topicLabel: "TUE",
    description:
      "If you need a prohibited substance for a genuine medical condition, a TUE allows you to compete without penalty. This video explains the application process clearly.",
    Icon: BookOpen,
    accent: "#0d9488",
  },
  {
    id: "mW9gZHp9U6c",
    title: "Athlete Whereabouts: Why Location Matters",
    channel: "WADA — World Anti-Doping Agency",
    duration: "4:18",
    topic: "whereabouts",
    topicLabel: "Whereabouts",
    description:
      "Top-level athletes in the Registered Testing Pool must file whereabouts quarterly. This video explains ADAMS, the 60-minute slot, and what counts as a failure.",
    Icon: MapPin,
    accent: "#ea580c",
  },
  {
    id: "bC1PRPJN1Vs",
    title: "Icarus — The Doping Scandal That Shook Sport",
    channel: "Netflix",
    duration: "2:34",
    topic: "cases",
    topicLabel: "Famous Cases",
    description:
      "The Oscar-winning documentary that exposed Russia's state-sponsored doping programme. This trailer provides a compelling entry point into one of sport's biggest scandals.",
    Icon: AlertTriangle,
    accent: "#ca8a04",
  },
  {
    id: "UMQzKb_4kCM",
    title: "Lance Armstrong: The Full Confession",
    channel: "ABC News",
    duration: "8:01",
    topic: "cases",
    topicLabel: "Famous Cases",
    description:
      "Lance Armstrong's admission of systematic doping across all seven Tour de France victories — a landmark moment in the history of anti-doping enforcement.",
    Icon: AlertTriangle,
    accent: "#ca8a04",
  },
  {
    id: "q_D4_cRfTqo",
    title: "Clean Sport: Why It Matters",
    channel: "USADA",
    duration: "3:12",
    topic: "clean",
    topicLabel: "Clean Sport",
    description:
      "Hear directly from elite athletes about what competing clean means to them — the sacrifices, the values, and the legacy they want to leave behind.",
    Icon: Trophy,
    accent: "#16a34a",
  },
  {
    id: "D_dRcAWsrq4",
    title: "The Consequences of a Doping Violation",
    channel: "WADA — World Anti-Doping Agency",
    duration: "4:50",
    topic: "consequences",
    topicLabel: "Consequences",
    description:
      "A doping violation doesn't just end careers — it affects teammates, sponsors, and the sport itself. This video walks through sanctions, appeals, and what comes after.",
    Icon: Dumbbell,
    accent: "#db2777",
  },
];

const TOPICS = [
  { id: "all", label: "All Videos" },
  { id: "basics", label: "Basics" },
  { id: "substances", label: "Substances" },
  { id: "testing", label: "Testing" },
  { id: "tue", label: "TUE" },
  { id: "whereabouts", label: "Whereabouts" },
  { id: "cases", label: "Famous Cases" },
  { id: "clean", label: "Clean Sport" },
  { id: "consequences", label: "Consequences" },
];

const TOPIC_BADGE: Record<string, string> = {
  basics: "bg-blue-900/50 text-blue-300 border-blue-700/50",
  substances: "bg-red-900/50 text-red-300 border-red-700/50",
  testing: "bg-purple-900/50 text-purple-300 border-purple-700/50",
  tue: "bg-teal-900/50 text-teal-300 border-teal-700/50",
  whereabouts: "bg-orange-900/50 text-orange-300 border-orange-700/50",
  cases: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50",
  clean: "bg-green-900/50 text-green-300 border-green-700/50",
  consequences: "bg-rose-900/50 text-rose-300 border-rose-700/50",
};

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        className="w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border mb-2 ${TOPIC_BADGE[video.topic]}`}>
              {video.topicLabel}
            </span>
            <h3 className="text-white font-bold text-lg leading-snug mb-1">{video.title}</h3>
            <p className="text-slate-400 text-sm mb-2">{video.channel}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{video.description}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VideoCard({ video, index, onPlay }: { video: Video; index: number; onPlay: () => void }) {
  const [hovered, setHovered] = useState(false);
  const Icon = video.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onPlay}
    >
      {/* Thumbnail area — gradient with icon */}
      <div
        className="relative aspect-video flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${video.accent}25 0%, #0f172a 100%)`,
          borderBottom: `1px solid ${video.accent}20`,
        }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 70% 30%, ${video.accent} 0%, transparent 60%)`,
          }}
        />

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 ${hovered ? "scale-110" : "scale-100"}`}
          style={{ backgroundColor: `${video.accent}20`, border: `1px solid ${video.accent}40` }}
        >
          <Icon className="w-7 h-7" style={{ color: video.accent }} />
        </div>

        {/* Play button overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl shadow-red-900/60">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Topic badge */}
        <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-bold border ${TOPIC_BADGE[video.topic]}`}>
          {video.topicLabel}
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {video.duration}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm leading-snug mb-1 group-hover:text-red-400 transition-colors line-clamp-2">
          {video.title}
        </h3>
        <p className="text-slate-500 text-xs mb-2 flex items-center gap-1">
          <Youtube className="w-3 h-3" />
          {video.channel}
        </p>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{video.description}</p>
      </div>
    </motion.div>
  );
}

export default function Lectures() {
  const [activeTopic, setActiveTopic] = useState("all");
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  const filtered = activeTopic === "all" ? VIDEOS : VIDEOS.filter((v) => v.topic === activeTopic);

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-[#0a0f1e] border-b border-slate-800">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ background: "radial-gradient(ellipse at 20% 50%, #DC2626 0%, transparent 60%)" }}
        />
        <div className="max-w-6xl mx-auto px-6 py-16 relative">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
            <Youtube className="w-3.5 h-3.5" />
            VIDEO LIBRARY
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-4">
            ANTI-DOPING <span className="text-red-500">LECTURES</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-6">
            Curated video lectures from WADA, USADA, and leading sports science experts.
            Watch and learn at your own pace — then test your knowledge in the Education modules.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 text-red-500" />
              {VIDEOS.length} videos
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              ~75 minutes of content
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0 mr-1" />
          {TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTopic === t.id
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTopic}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} onPlay={() => setPlayingVideo(v)} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">No videos in this category.</div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {playingVideo && (
          <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
