import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  role: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, role }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar role={role} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
