import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import { Button } from "../components/ui";
import { AuthLayout, AuthNotice, AuthProgress, EmailField, PasswordField } from "../components/auth/AuthLayout";
import { Link, useRouter } from "../lib/router";
import { useAuth } from "../lib/auth";
import { authErrorMessage, getSupabase, supabaseConfigurationError } from "../lib/supabase";
import { clearAuthCallbackUrl, getAuthRedirectUrl, readAuthCallback } from "../lib/auth-links";
import { completeAuthCallback } from "../lib/auth-callback";
import { track } from "../lib/analytics";

type Mode = "login" | "signup" | "forgot";

const COPY = {
  login: {
    title: "Sign in to MYLO Edge",
    subtitle: "Your research. Your perspective. Your market edge.",
    cta: "Sign in",
  },
  signup: {
    title: "Create your MYLO Edge account",
    subtitle: "Bring more structure to your market research. Start with an account of your own.",
    cta: "Create account",
  },
  forgot: {
    title: "Forgot your password?",
    subtitle: "Enter your account email and we will request a password recovery link.",
    cta: "Send recovery link",
  },
} satisfies Record<Mode, { title: string; subtitle: string; cta: string }>;

function useEmailCooldown(initial = 0) {
  const [seconds, setSeconds] = useState(initial);
  useEffect(() => {
    if (seconds <= 0) return;
    const timeout = window.setTimeout(() => setSeconds((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => window.clearTimeout(timeout);
  }, [seconds]);
  return { seconds, startCooldown: () => setSeconds(60) };
}

export function AuthPage({ mode }: { mode: Mode }) {
  const { user, loading, passwordRecovery, sessionError, setVerificationEmail } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const { seconds, startCooldown } = useEmailCooldown();
  const copy = COPY[mode];
  const redirecting = Boolean(user && mode !== "forgot");

  useEffect(() => {
    if (!loading && !busy && redirecting) {
      navigate(passwordRecovery ? "/reset-password" : "/onboarding", { replace: true });
    }
  }, [loading, busy, redirecting, passwordRecovery, navigate]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || loading || seconds > 0 || supabaseConfigurationError) return;
    setBusy(true);
    setError(null);
    setNeedsVerification(false);
    const address = email.trim();

    try {
      const client = getSupabase();
      if (mode === "signup") {
        track("signup_started");
        const { data, error: signupError } = await client.auth.signUp({
          email: address,
          password,
          options: { emailRedirectTo: getAuthRedirectUrl("signup") },
        });
        if (signupError) throw signupError;
        setPassword("");
        if (data.session) {
          track("signup_completed");
          navigate("/onboarding", { replace: true });
        } else {
          // A user object alone is not a session when email confirmation is enabled.
          setVerificationEmail(address, true);
          navigate("/verify-email", { replace: true });
        }
      } else if (mode === "login") {
        const { data, error: loginError } = await client.auth.signInWithPassword({ email: address, password });
        if (loginError) throw loginError;
        if (!data.session) throw { code: "invalid_credentials" };
        setPassword("");
        navigate("/onboarding", { replace: true });
      } else {
        const { error: recoveryError } = await client.auth.resetPasswordForEmail(address, {
          redirectTo: getAuthRedirectUrl("recovery"),
        });
        if (recoveryError) throw recoveryError;
        setRecoverySent(true);
        startCooldown();
      }
    } catch (cause) {
      setError(authErrorMessage(cause));
      if ((cause as { code?: string })?.code === "email_not_confirmed") {
        setVerificationEmail(address);
        setNeedsVerification(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title={copy.title} subtitle={copy.subtitle}>
      {loading || redirecting ? <AuthProgress /> : (
        <div className="space-y-5">
          {(error || sessionError) && <AuthNotice tone="error">{error || sessionError}</AuthNotice>}
          {needsVerification && (
            <Link to="/verify-email" className="inline-flex min-h-11 items-center text-sm text-edge underline underline-offset-4">
              Resend confirmation email
            </Link>
          )}
          {recoverySent && !error && (
            <AuthNotice tone="success">
              If an account exists for this address, you will receive a password recovery link.
              Check your spam folder too, and open the latest link in this browser.
            </AuthNotice>
          )}

          <form onSubmit={submit} aria-busy={busy} className="space-y-5">
            <fieldset disabled={busy} className="min-w-0 space-y-4">
              <legend className="sr-only">{copy.title}</legend>
              <EmailField value={email} onChange={(value) => { setEmail(value); setRecoverySent(false); }} />
              {mode !== "forgot" && (
                <PasswordField value={password} onChange={setPassword} newPassword={mode === "signup"} hint={mode === "signup"} />
              )}
              {mode === "login" && (
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="inline-flex min-h-9 items-center text-[13px] text-ink-muted hover:text-ink">
                    Forgot password?
                  </Link>
                </div>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={busy || seconds > 0 || Boolean(supabaseConfigurationError)}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
                {busy ? "Please wait..." : seconds > 0 ? `Send again in ${seconds}s` : recoverySent ? "Resend recovery link" : copy.cta}
              </Button>
            </fieldset>
          </form>

          <div className="border-t border-hairline pt-5 text-center text-[13px] text-ink-muted">
            {mode === "login" ? (
              <p>New to MYLO Edge? <Link to="/signup" className="text-edge hover:underline">Create an account</Link></p>
            ) : (
              <p>{mode === "signup" ? "Already have an account? " : "Remember your password? "}<Link to="/login" className="text-edge hover:underline">Sign in</Link></p>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

export function VerifyEmailPage() {
  const { user, loading, sessionError, verificationEmail, verificationRequestedAt, setVerificationEmail } = useAuth();
  const [email, setEmail] = useState(verificationEmail);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(verificationRequestedAt > 0);
  const [error, setError] = useState<string | null>(null);
  const { seconds, startCooldown } = useEmailCooldown(Math.max(0, Math.ceil((verificationRequestedAt + 60_000 - Date.now()) / 1000)));

  const resend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || seconds > 0 || supabaseConfigurationError) return;
    setBusy(true);
    setError(null);
    try {
      const { error: resendError } = await getSupabase().auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: getAuthRedirectUrl("signup") },
      });
      if (resendError) throw resendError;
      setVerificationEmail(email.trim(), true);
      setSent(true);
      startCooldown();
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title={user ? "You're signed in" : "Check your email"} subtitle={user ? "Your MYLO Edge account is connected." : "A clearer view of the market starts with a verified account."}>
      {loading ? <AuthProgress /> : user ? (
        <div className="space-y-5">
          <AuthNotice tone="success">Signed in as <span className="font-medium text-ink">{user.email}</span>.</AuthNotice>
          <Button to="/onboarding" size="lg" className="w-full">Continue to your account <ArrowRight className="h-4 w-4" aria-hidden /></Button>
        </div>
      ) : (
        <div className="space-y-5">
          <MailCheck className="h-8 w-8 text-edge" aria-hidden />
          {sent && !error && (
            <AuthNotice>
              If this address is eligible for registration or needs confirmation, a verification link has been requested.
              Already registered? You can sign in below.
            </AuthNotice>
          )}
          <p className="text-[13px] leading-relaxed text-ink-muted">
            Follow the latest confirmation link in the same browser where you requested it.
            If you confirmed on another device, return here and sign in with your password.
          </p>
          {(error || sessionError) && <AuthNotice tone="error">{error || sessionError}</AuthNotice>}
          <form onSubmit={resend} aria-busy={busy}>
            <fieldset disabled={busy} className="min-w-0 space-y-4">
              <legend className="sr-only">Resend email verification</legend>
              <EmailField value={email} onChange={(value) => { setEmail(value); setSent(false); }} id="verify-email" />
              <Button type="submit" variant="outline" size="lg" className="w-full" disabled={busy || seconds > 0 || Boolean(supabaseConfigurationError)}>
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {busy ? "Requesting email..." : seconds > 0 ? `Resend in ${seconds}s` : "Resend confirmation email"}
              </Button>
            </fieldset>
          </form>
          <Link to="/login" className="flex min-h-11 items-center justify-center text-sm text-edge hover:underline">Back to sign in</Link>
        </div>
      )}
    </AuthLayout>
  );
}

export function AuthCallbackPage() {
  const { navigate } = useRouter();
  const [details] = useState(() => readAuthCallback());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    completeAuthCallback(details).then(({ flow }) => {
      if (!active) return;
      clearAuthCallbackUrl();
      if (flow === "signup") track("signup_completed");
      navigate(flow === "recovery" ? "/reset-password" : "/onboarding", { replace: true });
    }).catch((cause: unknown) => {
      if (!active) return;
      clearAuthCallbackUrl();
      setError(authErrorMessage(cause));
    });
    return () => { active = false; };
  }, [details, navigate]);

  return (
    <AuthLayout title={error ? "Let's get you back on track" : "Completing your sign-in"} subtitle={error ? "Your email link could not be completed." : "Checking your email link with Supabase."}>
      {error ? (
        <div className="space-y-4">
          <AuthNotice tone="error">{error}</AuthNotice>
          <Button to={details.flow === "recovery" ? "/forgot-password" : "/verify-email"} size="lg" className="w-full">Request a new link</Button>
          <Button to="/login" variant="outline" className="w-full">Return to sign in</Button>
        </div>
      ) : <AuthProgress label="Verifying your link..." />}
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const { user, loading, sessionError, finishPasswordRecovery, signOut } = useAuth();
  const { navigate } = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelRecovery = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || !user) return;
    if (password !== confirmation) {
      setError("Your passwords do not match. Please enter the same password in both fields.");
      document.getElementById("confirm-password")?.focus();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error: updateError } = await getSupabase().auth.updateUser({ password });
      if (updateError) throw updateError;
      finishPasswordRecovery();
      setPassword("");
      setConfirmation("");
      setDone(true);
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title={done ? "Password updated" : "Choose a new password"} subtitle={done ? "Your new password is ready to use." : "Use a unique password that you do not use for other accounts."}>
      {loading ? <AuthProgress /> : !user ? (
        <div className="space-y-5">
          <AuthNotice tone={sessionError ? "error" : "info"}>{sessionError || "Open the latest recovery link from your email to set a new password. You can also sign in to update your password."}</AuthNotice>
          <Button to="/forgot-password" size="lg" className="w-full">Request a recovery link</Button>
          <Button to="/login" variant="outline" className="w-full">Sign in</Button>
        </div>
      ) : done ? (
        <div className="space-y-5">
          <AuthNotice tone="success">Your password has been updated with Supabase. You remain signed in on this browser.</AuthNotice>
          <Button to="/onboarding" size="lg" className="w-full">Continue to your account <ArrowRight className="h-4 w-4" aria-hidden /></Button>
        </div>
      ) : (
        <form onSubmit={updatePassword} aria-busy={busy} className="space-y-5">
          {error && <AuthNotice tone="error">{error}</AuthNotice>}
          <fieldset disabled={busy} className="min-w-0 space-y-4">
            <legend className="sr-only">Set a new password</legend>
            <PasswordField value={password} onChange={setPassword} label="New password" newPassword hint />
            <PasswordField value={confirmation} onChange={setConfirmation} id="confirm-password" label="Confirm new password" newPassword />
            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
              {busy ? "Updating password..." : "Update password"}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={cancelRecovery} disabled={busy}>Cancel and sign out</Button>
          </fieldset>
        </form>
      )}
    </AuthLayout>
  );
}