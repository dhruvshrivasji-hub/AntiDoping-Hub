import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Activity, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/react";
import type { UserResource } from "@clerk/types";
import type { UserProfile } from "@/lib/api";

const roleColors: Record<string, string> = {
  athlete: "bg-red-600 text-white",
  coach: "bg-blue-700 text-white",
  support: "bg-green-700 text-white",
  official: "bg-gray-700 text-white",
};

const roleLabels: Record<string, string> = {
  athlete: "🏃 Athlete",
  coach: "📋 Coach",
  support: "🩺 Support Staff",
  official: "⚖️ Official",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

interface NavbarProps {
  role: string;
  user: UserResource | null | undefined;
  profile: UserProfile | null;
  onSignOut: () => void;
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Navbar({ role, user, profile, onSignOut }: NavbarProps) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/education", label: "Education" },
    { href: "/substances", label: "Prohibited List" },
    { href: "/testing", label: "Testing" },
    { href: "/resources", label: "Resources" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  async function handleSignOut() {
    setDropdownOpen(false);
    await signOut();
    onSignOut();
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const avatarColor = profile?.avatarColor ?? "#DC2626";
  const initials = profile ? getInitials(profile.name) : "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-xl tracking-tight">CLEANSPORT</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                location === link.href ? "text-primary font-bold" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <span className={cn(
              "hidden md:inline-flex items-center px-3 py-1 rounded text-xs font-bold tracking-wide",
              roleColors[role] ?? "bg-gray-700 text-white"
            )}>
              {roleLabels[role] ?? role}
            </span>
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/50 group"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black ring-2 ring-white/10 group-hover:ring-white/30 transition-all shadow-lg"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 hidden md:block transition-transform", dropdownOpen && "rotate-180")} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden z-50">
                  {/* Profile header in dropdown */}
                  <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{profile?.name ?? user.firstName}</p>
                      {profile?.username && (
                        <p className="text-slate-400 text-xs truncate">@{profile.username}</p>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    {profile?.username && (
                      <Link
                        href={`/profile/${profile.username}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        View Profile
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      My Dashboard
                    </Link>
                    <div className="border-t border-slate-700 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden md:inline-flex items-center justify-center whitespace-nowrap rounded border border-primary text-primary h-9 px-4 py-2 text-sm font-medium hover:bg-primary hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="hidden md:inline-flex items-center justify-center whitespace-nowrap rounded bg-primary text-primary-foreground h-9 px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
