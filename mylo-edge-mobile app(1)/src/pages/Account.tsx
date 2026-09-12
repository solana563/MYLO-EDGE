import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, Check, ExternalLink, Loader2, LogOut } from "lucide-react";
import { AuthLayout, AuthNotice, AuthProgress } from "../components/auth/AuthLayout";
import { Button } from "../components/ui";
import { useAuth } from "../lib/auth";
import { Link, useRouter } from "../lib/router";
import { authErrorMessage, getSupabase } from "../lib/supabase";
import { SITE } from "../lib/seo";

const MARKETS = ["Stocks", "Crypto", "Forex", "Commodities", "Indices"];
const EXPERIENCE = ["Learning", "Active", "Systematic"];

function terminalDestination(): string | null {
  if (!SITE.appUrl) return null;
  try {
    const url = new URL(SITE.appUrl, window.location.origin);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function OnboardingPage() {
  const { user, loading, passwordRecovery } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login", { replace: true });
    else if (passwordRecovery) navigate("/reset-password", { replace: true });
  }, [user, loading, passwordRecovery, navigate]);

  if (loading || !user || passwordRecovery) {
    return <AuthLayout title="Your MYLO Edge account" subtitle="Restoring your account session."><AuthProgress /></AuthLayout>;
  }
  return <AccountPreferences key={user.id} user={user} />;
}

function AccountPreferences({ user }: { user: User }) {
  const { signOut } = useAuth();
  const { navigate } = useRouter();
  const [markets, setMarkets] = useState<string[]>(() => {
    const stored: unknown = user.user_metadata.mylo_markets;
    return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string" && MARKETS.includes(item)) : [];
  });
  const [experience, setExperience] = useState<string>(() => {
    const stored: unknown = user.user_metadata.mylo_experience;
    return typeof stored === "string" && EXPERIENCE.includes(stored) ? stored : "";
  });
  const [busy, setBusy] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const destination = terminalDestination();
  const hasPreferences = Boolean(user.user_metadata.mylo_onboarding_completed_at);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || signingOut) return;
    if (!markets.length) {
      setError("Choose at least one market to follow.");
      document.getElementById("market-Stocks")?.focus();
      return;
    }
    setBusy(true);
    setSaved(false);
    setError(null);
    try {
      // These are user-editable preferences, never roles or authorization claims.
      const { error: updateError } = await getSupabase().auth.updateUser({
        data: {
          mylo_markets: markets,
          mylo_experience: experience,
          mylo_onboarding_completed_at: user.user_metadata.mylo_onboarding_completed_at || new Date().toISOString(),
        },
      });
      if (updateError) throw updateError;
      setSaved(true);
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    if (signingOut || busy) return;
    setSigningOut(true);
    setError(null);
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (cause) {
      setError(authErrorMessage(cause));
      setSigningOut(false);
    }
  };

  return (
    <AuthLayout title={hasPreferences ? "Your account. Your edge." : "Set up your workspace"} subtitle="Choose the markets and research approach that matter to you.">
      <div className="mb-6 flex items-start justify-between gap-3 border-b border-hairline pb-5">
        <div className="min-w-0">
          <p className="text-xs text-ink-muted">Signed in as</p>
          <p className="mt-1 break-all text-sm font-medium text-ink">{user.email}</p>
        </div>
        <button type="button" onClick={logout} disabled={signingOut || busy} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-2 text-xs text-ink-muted hover:bg-white/5 hover:text-ink disabled:opacity-50">
          {signingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <LogOut className="h-3.5 w-3.5" aria-hidden />}
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>

      <form onSubmit={save} aria-busy={busy} className="space-y-5">
        {error && <AuthNotice tone="error">{error}</AuthNotice>}
        {saved && <AuthNotice tone="success">Your preferences have been saved to your Supabase account.</AuthNotice>}
        <fieldset disabled={busy || signingOut} className="min-w-0 space-y-6">
          <legend className="sr-only">Research preferences</legend>
          <fieldset>
            <legend className="text-[13px] font-medium text-ink-muted">Markets you follow</legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {MARKETS.map((market) => (
                <label key={market} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-hairline-strong px-3 py-2.5 text-[13px] text-ink-muted transition-colors has-[:checked]:border-edge/50 has-[:checked]:bg-edge/[0.07] has-[:checked]:text-ink">
                  <input
                    id={`market-${market}`}
                    type="checkbox"
                    name="markets"
                    value={market}
                    checked={markets.includes(market)}
                    onChange={(event) => {
                      setSaved(false);
                      setMarkets((current) => event.target.checked ? [...current, market] : current.filter((item) => item !== market));
                    }}
                    className="h-4 w-4 accent-edge"
                  />
                  {market}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-[13px] font-medium text-ink-muted">Your research approach</legend>
            <div className="mt-3 space-y-2">
              {EXPERIENCE.map((level) => (
                <label key={level} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-hairline-strong px-3.5 py-2.5 text-[13px] text-ink-muted transition-colors has-[:checked]:border-edge/50 has-[:checked]:bg-edge/[0.07] has-[:checked]:text-ink">
                  <input type="radio" name="experience" value={level} checked={experience === level} onChange={() => { setExperience(level); setSaved(false); }} required className="h-4 w-4 accent-edge" />
                  {level} trader
                </label>
              ))}
            </div>
          </fieldset>
          <Button type="submit" size="lg" className="w-full" disabled={busy || signingOut}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
            {busy ? "Saving preferences..." : "Save preferences"}
          </Button>
        </fieldset>
      </form>

      <div className="mt-6 space-y-3 border-t border-hairline pt-5">
        {destination ? (
          <>
            <Button href={destination} variant="outline" className="w-full">Open MYLO Edge terminal <ExternalLink className="h-4 w-4" aria-hidden /></Button>
            <p className="text-xs leading-relaxed text-ink-muted">The terminal is a separate application. It may ask you to sign in again.</p>
          </>
        ) : (
          <>
            <Button to="/markets" variant="outline" className="w-full">Explore the product demo <ArrowRight className="h-4 w-4" aria-hidden /></Button>
            <p className="text-xs leading-relaxed text-ink-muted">Your account is connected. The trading terminal is a separate application and has not been linked to this website yet.</p>
          </>
        )}
        <Link to="/reset-password" className="inline-flex min-h-11 items-center text-[13px] text-edge hover:underline">Change your password</Link>
      </div>
    </AuthLayout>
  );
}