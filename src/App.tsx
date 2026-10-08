import { useEffect } from "react";
import { RouterProvider, useRouter } from "./lib/router";
import { AuthProvider } from "./lib/auth";
import { applyMeta, injectStructuredData } from "./lib/seo";
import { LEGAL_DOCS, LegalPage } from "./pages/Legal";
import { AuthCallbackPage, AuthPage, ResetPasswordPage, VerifyEmailPage } from "./pages/Auth";
import { OnboardingPage } from "./pages/Account";
import { NotFoundPage, OfflinePage, ServerErrorPage } from "./pages/Errors";
import { InstallPage } from "./pages/Install";
import { InstallBanner, OfflineNotice, UpdateToast } from "./components/app/NativeApp";
import { useServiceWorkerRegistration } from "./lib/pwa";
import { MobileAppProvider } from "./components/mobile/MobileAppContext";
import { MobileAppShell } from "./components/mobile/MobileAppShell";

const KNOWN = new Set([
  "/",
  "/app",
  "/markets",
  "/terminal",
  "/signals",
  "/portfolio",
  "/install",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/verify-email",
  "/onboarding",
  "/500",
  "/offline",
]);

function renderRoute(path: string) {
  switch (path) {
    case "/":
    case "/app":
    case "/terminal":
      return <MobileAppShell />;
    case "/markets":
    case "/signals":
    case "/portfolio":
      return <MobileAppShell />;
    case "/install":
      return <InstallPage />;
    case "/login":
      return <AuthPage key="login" mode="login" />;
    case "/signup":
      return <AuthPage key="signup" mode="signup" />;
    case "/forgot-password":
      return <AuthPage key="forgot" mode="forgot" />;
    case "/reset-password":
      return <ResetPasswordPage />;
    case "/auth/callback":
      return <AuthCallbackPage />;
    case "/verify-email":
      return <VerifyEmailPage />;
    case "/onboarding":
      return <OnboardingPage />;
    case "/500":
      return <ServerErrorPage />;
    case "/offline":
      return <OfflinePage />;
    default:
      if (LEGAL_DOCS[path]) return <LegalPage path={path} />;
      return <NotFoundPage />;
  }
}

/**
 * App-wide native runtime. Mounted on every route — including auth and error
 * screens — so the service worker registers no matter which URL a user lands
 * on (an email confirmation link, for example, opens an auth route directly).
 */
function AppRuntime() {
  useServiceWorkerRegistration();
  return (
    <>
      <OfflineNotice />
      <UpdateToast />
      <InstallBanner />
    </>
  );
}

function Shell() {
  const { path } = useRouter();

  useEffect(() => {
    applyMeta(path);
  }, [path]);

  useEffect(() => {
    injectStructuredData();
  }, []);

  return (
    <>
      <main id="main">{renderRoute(path)}</main>
      <AppRuntime />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MobileAppProvider>
        <RouterProvider>
          <Shell />
        </RouterProvider>
      </MobileAppProvider>
    </AuthProvider>
  );
}
