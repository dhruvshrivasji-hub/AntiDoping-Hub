import { useEffect, useRef, useState } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { dark } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import PageLayout from "./components/layout/PageLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Education from "./pages/Education";
import Substances from "./pages/Substances";
import Testing from "./pages/Testing";
import Resources from "./pages/Resources";
import Dashboard from "./pages/Dashboard";
import RoleSelection from "./components/RoleSelection";
import { syncUser, getUserRole } from "./lib/api";

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  baseTheme: dark,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsVariant: "blockButton" as const,
    socialButtonsPlacement: "top" as const,
  },
  variables: {
    colorPrimary: "#DC2626",
    colorForeground: "#f1f5f9",
    colorMutedForeground: "#94a3b8",
    colorDanger: "#f87171",
    colorBackground: "#0f172a",
    colorInput: "#1e293b",
    colorInputForeground: "#f1f5f9",
    colorNeutral: "#334155",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#0f172a] border border-[#1e293b] rounded-2xl w-[440px] max-w-full overflow-hidden shadow-2xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-white font-bold text-2xl",
    headerSubtitle: "text-slate-400",
    socialButtonsBlockButtonText: "text-white font-medium",
    formFieldLabel: "text-slate-300 font-medium",
    footerActionLink: "text-red-500 hover:text-red-400",
    footerActionText: "text-slate-400",
    dividerText: "text-slate-500",
    identityPreviewEditButton: "text-red-500",
    formFieldSuccessText: "text-green-400",
    alertText: "text-slate-200",
    logoBox: "flex justify-center py-2",
    logoImage: "h-10",
    socialButtonsBlockButton: "!border-slate-700 !bg-slate-800 hover:!bg-slate-700 transition-colors",
    formButtonPrimary: "!bg-red-600 hover:!bg-red-700 transition-colors font-bold",
    formFieldInput: "!bg-slate-800 !border-slate-600 !text-white",
    footerAction: "!bg-transparent",
    dividerLine: "!bg-slate-700",
    alert: "!bg-slate-800 !border-slate-600",
    otpCodeFieldInput: "!bg-slate-800 !border-slate-600 !text-white",
    formFieldRow: "gap-2",
    main: "gap-4",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-4">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        appearance={clerkAppearance}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-4">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        appearance={clerkAppearance}
      />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function AppRoutes() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setRoleLoading(false);
      return;
    }
    // Load role from DB for this Clerk user
    getUserRole()
      .then((data) => {
        if (data?.role) setRole(data.role);
      })
      .catch(() => {})
      .finally(() => setRoleLoading(false));
  }, [user, isLoaded]);

  async function handleRoleSelected(selectedRole: string) {
    if (!user) return;
    await syncUser({
      clerkId: user.id,
      name: user.fullName ?? user.firstName ?? "User",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      role: selectedRole,
    });
    setRole(selectedRole);
  }

  // Not loaded yet
  if (!isLoaded || (user && roleLoading)) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-white text-lg font-medium animate-pulse">Loading CleanSport…</div>
      </div>
    );
  }

  // Signed in but no role yet
  if (user && !role) {
    return <RoleSelection onComplete={handleRoleSelected} userName={user.firstName ?? "Athlete"} />;
  }

  const effectiveRole = role ?? "athlete";

  return (
    <PageLayout role={effectiveRole} user={user} onSignOut={() => setLocation("/")}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/education" component={Education} />
        <Route path="/substances" component={Substances} />
        <Route path="/testing" component={Testing} />
        <Route path="/resources" component={Resources} />
        <Route path="/dashboard">
          <Show when="signed-in">
            <Dashboard role={effectiveRole} />
          </Show>
          <Show when="signed-out">
            <Redirect to="/sign-in" />
          </Show>
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </PageLayout>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey!}
      proxyUrl={clerkProxyUrl}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route component={AppRoutes} />
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
