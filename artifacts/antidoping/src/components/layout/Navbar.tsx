import { Link, useLocation } from "wouter";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/react";
import type { UserResource } from "@clerk/types";

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

interface NavbarProps {
  role: string;
  user: UserResource | null | undefined;
  onSignOut: () => void;
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Navbar({ role, user, onSignOut }: NavbarProps) {
  const [location] = useLocation();
  const { signOut } = useClerk();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/education", label: "Education" },
    { href: "/substances", label: "Prohibited List" },
    { href: "/testing", label: "Testing" },
    { href: "/resources", label: "Resources" },
  ];

  async function handleSignOut() {
    await signOut();
    onSignOut();
  }

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
          <span className={cn(
            "hidden md:inline-flex items-center px-3 py-1 rounded text-xs font-bold tracking-wide",
            roleColors[role] ?? "bg-gray-700 text-white"
          )}>
            {roleLabels[role] ?? role}
          </span>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  "hidden md:inline-flex items-center justify-center whitespace-nowrap rounded border border-primary text-primary h-9 px-4 py-2 text-sm font-medium hover:bg-primary hover:text-white transition-colors",
                  location === "/dashboard" && "bg-primary text-white"
                )}
              >
                My Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="hidden md:inline-flex items-center justify-center whitespace-nowrap rounded bg-muted text-muted-foreground h-9 px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Sign Out
              </button>
            </>
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
