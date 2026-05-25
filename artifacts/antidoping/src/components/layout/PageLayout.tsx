import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { UserResource } from "@clerk/types";
import type { UserProfile } from "@/lib/api";

interface PageLayoutProps {
  children: React.ReactNode;
  role: string;
  user: UserResource | null | undefined;
  profile: UserProfile | null;
  onSignOut: () => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, role, user, profile, onSignOut }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar role={role} user={user} profile={profile} onSignOut={onSignOut} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
