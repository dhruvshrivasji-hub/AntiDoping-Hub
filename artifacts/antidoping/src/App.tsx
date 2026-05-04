import { useState } from "react";
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
import WelcomeScreen from "./components/WelcomeScreen";

const queryClient = new QueryClient();

function Router({ role }: { role: string }) {
  return (
    <PageLayout role={role}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/education" component={Education} />
        <Route path="/substances" component={Substances} />
        <Route path="/testing" component={Testing} />
        <Route path="/resources" component={Resources} />
        <Route component={NotFound} />
      </Switch>
    </PageLayout>
  );
}

function App() {
  const [role, setRole] = useState<string | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {!role ? (
          <WelcomeScreen onComplete={setRole} />
        ) : (
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router role={role} />
          </WouterRouter>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
