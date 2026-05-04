import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { UserResource } from "@clerk/types";

interface PageLayoutProps {
  children: React.ReactNode;
  role: string;
  user: UserResource | null | undefined;
  onSignOut: () => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, role, user, onSignOut }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar role={role} user={user} onSignOut={onSignOut} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
