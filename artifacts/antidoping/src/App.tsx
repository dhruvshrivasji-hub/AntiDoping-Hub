import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import PageLayout from "./components/layout/PageLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Education from "./pages/Education";
import Substances from "./pages/Substances";
import Testing from "./pages/Testing";
import Resources from "./pages/Resources";
import Dashboard from "./pages/Dashboard";
import WelcomeScreen from "./components/WelcomeScreen";
import AuthModal from "./components/AuthModal";
import { getSavedUser, clearAuth } from "./lib/api";

const queryClient = new QueryClient();

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

function Router({ role, user, onSignIn, onSignOut }: {
  role: string;
  user: AuthUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  return (
    <PageLayout role={role} user={user} onSignIn={onSignIn} onSignOut={onSignOut}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/education" component={Education} />
        <Route path="/substances" component={Substances} />
        <Route path="/testing" component={Testing} />
        <Route path="/resources" component={Resources} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </PageLayout>
  );
}

function App() {
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const saved = getSavedUser();
    if (saved) {
      setUser(saved);
      setRole(saved.role);
    }
  }, []);

  function handleWelcomeComplete(selectedRole: string) {
    setRole(selectedRole);
  }

  function handleAuthSuccess(u: AuthUser) {
    setUser(u);
    setRole(u.role);
    setShowAuth(false);
  }

  function handleSignOut() {
    clearAuth();
    setUser(null);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {!role ? (
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        ) : (
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router
              role={role}
              user={user}
              onSignIn={() => setShowAuth(true)}
              onSignOut={handleSignOut}
            />
            {showAuth && (
              <AuthModal
                initialRole={role}
                onSuccess={handleAuthSuccess}
                onClose={() => setShowAuth(false)}
              />
            )}
          </WouterRouter>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
