import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Trophy, BookOpen, Target, MapPin, Dumbbell,
  Medal, Edit2, CheckCircle, Circle, Loader2, AlertCircle,
} from "lucide-react";
import { getPublicProfile, getMyProfile, type UserProfile } from "@/lib/api";
import { useUser } from "@clerk/react";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const roleLabels: Record<string, string> = {
  athlete: "Athlete",
  coach: "Coach",
  support: "Support Staff",
  official: "Official",
};

const MODULE_ORDER = [
  { slug: "intro-anti-doping", label: "Anti-Doping Basics" },
  { slug: "prohibited-substances", label: "Prohibited Substances" },
  { slug: "testing-procedures", label: "Testing Procedures" },
  { slug: "therapeutic-use-exemptions", label: "Therapeutic Use Exemptions" },
  { slug: "athlete-whereabouts", label: "Athlete Whereabouts" },
  { slug: "consequences-of-doping", label: "Consequences of Doping" },
];

function StatBubble({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4">
      <div className="text-red-500 mb-1">{icon}</div>
      <div className="text-2xl font-display font-black text-white">{value}</div>
      <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

interface ProfileData {
  name: string;
  username: string;
  role: string;
  bio: string;
  sport: string;
  country: string;
  avatarColor: string;
  completedCount: number;
  totalModules: number;
  avgScore: number;
  rank: number;
  modules: { slug: string; score: number; completed: boolean }[];
}

function ProfileView({ data, isOwn }: { data: ProfileData; isOwn: boolean }) {
  const [, setLocation] = useLocation();

  const compliancePct = Math.round((data.completedCount / data.totalModules) * 100);

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Header gradient */}
      <div
        className="h-40 w-full"
        style={{
          background: `linear-gradient(135deg, ${data.avatarColor}40 0%, #0a0f1e 100%)`,
          borderBottom: `1px solid ${data.avatarColor}30`,
        }}
      />

      <div className="max-w-2xl mx-auto px-4">
        {/* Avatar — overlaps header */}
        <div className="-mt-16 mb-4 flex justify-between items-end">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-black ring-4 ring-[#0a0f1e] shadow-2xl"
            style={{ backgroundColor: data.avatarColor }}
          >
            {getInitials(data.name)}
          </div>
          {isOwn && (
            <button
              onClick={() => setLocation("/profile/edit")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Name + username */}
        <div className="mb-4">
          <h1 className="text-2xl font-display font-black text-white tracking-tight">{data.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-slate-400">@{data.username}</span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600/20 text-red-400 border border-red-600/30">
              {roleLabels[data.role] ?? data.role}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-slate-400 flex-wrap">
            {data.sport && (
              <span className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" /> {data.sport}
              </span>
            )}
            {data.country && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {data.country}
              </span>
            )}
          </div>

          {data.bio && (
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">{data.bio}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 flex divide-x divide-slate-800 mb-6">
          <StatBubble icon={<BookOpen className="w-5 h-5" />} value={`${data.completedCount}/${data.totalModules}`} label="Modules" />
          <StatBubble icon={<Target className="w-5 h-5" />} value={`${compliancePct}%`} label="Compliance" />
          <StatBubble icon={<Trophy className="w-5 h-5" />} value={data.rank === 1 ? "🥇 #1" : `#${data.rank}`} label="Rank" />
          <StatBubble icon={<Medal className="w-5 h-5" />} value={`${data.avgScore}%`} label="Avg Score" />
        </div>

        {/* Module Progress */}
        <div className="mb-12">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Education Progress</h2>
          <div className="grid grid-cols-1 gap-3">
            {MODULE_ORDER.map((mod, i) => {
              const prog = data.modules.find((m) => m.slug === mod.slug);
              const done = prog?.completed ?? false;
              const score = prog?.score ?? 0;
              return (
                <motion.div
                  key={mod.slug}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
                    done
                      ? "bg-green-950/40 border-green-800/40"
                      : "bg-slate-900/40 border-slate-800"
                  }`}
                >
                  {done ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  )}
                  <span className={`flex-1 text-sm font-medium ${done ? "text-white" : "text-slate-500"}`}>
                    {mod.label}
                  </span>
                  {done && (
                    <span className="text-xs font-bold text-green-400 bg-green-900/40 px-2 py-0.5 rounded-full">
                      {score}%
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const params = useParams<{ username?: string }>();
  const { user } = useUser();
  const [, setLocation] = useLocation();

  const isOwnProfileRoute = !params.username;

  const ownProfileQuery = useQuery<UserProfile | null>({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
    enabled: isOwnProfileRoute,
  });

  const publicProfileQuery = useQuery({
    queryKey: ["public-profile", params.username],
    queryFn: () => getPublicProfile(params.username!),
    enabled: !isOwnProfileRoute,
  });

  const loading = isOwnProfileRoute ? ownProfileQuery.isLoading : publicProfileQuery.isLoading;
  const error = isOwnProfileRoute ? ownProfileQuery.error : publicProfileQuery.error;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error || (!isOwnProfileRoute && !publicProfileQuery.data)) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-white text-lg font-medium">Profile not found</p>
        <button onClick={() => setLocation("/")} className="text-red-400 hover:text-red-300 text-sm underline">
          Go home
        </button>
      </div>
    );
  }

  if (isOwnProfileRoute) {
    const profile = ownProfileQuery.data;
    if (!profile || !user) {
      return (
        <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-4">
          <p className="text-white text-lg">Please sign in to view your profile.</p>
          <button onClick={() => setLocation("/sign-in")} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
            Sign In
          </button>
        </div>
      );
    }
    if (!profile.username) {
      setLocation("/");
      return null;
    }
    return (
      <ProfileView
        data={{
          name: profile.name,
          username: profile.username,
          role: profile.role,
          bio: profile.bio,
          sport: profile.sport,
          country: profile.country,
          avatarColor: profile.avatarColor,
          completedCount: 0,
          totalModules: 6,
          avgScore: 0,
          rank: 0,
          modules: [],
        }}
        isOwn={true}
      />
    );
  }

  const pub = publicProfileQuery.data!;
  const isOwn = user != null && pub.username === ownProfileQuery.data?.username;

  return (
    <ProfileView
      data={{
        name: pub.name,
        username: pub.username,
        role: pub.role,
        bio: pub.bio,
        sport: pub.sport,
        country: pub.country,
        avatarColor: pub.avatarColor,
        completedCount: pub.completedCount,
        totalModules: pub.totalModules,
        avgScore: pub.avgScore,
        rank: pub.rank,
        modules: pub.modules,
      }}
      isOwn={isOwn}
    />
  );
}
