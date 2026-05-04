import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface PageLayoutProps {
  children: React.ReactNode;
  role: string;
  user: AuthUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, role, user, onSignIn, onSignOut }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar role={role} user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
