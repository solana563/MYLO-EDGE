import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { authErrorMessage, getSupabase, supabase, supabaseConfigurationError } from "./supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  sessionError: string | null;
  passwordRecovery: boolean;
  finishPasswordRecovery: () => void;
  verificationEmail: string;
  verificationRequestedAt: number;
  setVerificationEmail: (email: string, requested?: boolean) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [sessionError, setSessionError] = useState<string | null>(supabaseConfigurationError);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [verificationEmail, updateVerificationEmail] = useState("");
  const [verificationRequestedAt, setVerificationRequestedAt] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let revision = 0;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active || event === "INITIAL_SESSION") return;
      revision += 1;
      setSession(nextSession);
      setSessionError(null);
      setLoading(false);
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      if (event === "SIGNED_OUT") {
        setPasswordRecovery(false);
        updateVerificationEmail("");
        setVerificationRequestedAt(0);
      }
    });

    // Keep the auth callback synchronous; awaited SDK calls can otherwise deadlock it.
    const initialRevision = revision;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || revision !== initialRevision) return;
      setSession(data.session);
      setSessionError(error ? authErrorMessage(error) : null);
      setLoading(false);
    }).catch((error: unknown) => {
      if (!active || revision !== initialRevision) return;
      setSessionError(authErrorMessage(error));
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await getSupabase().auth.signOut({ scope: "local" });
    if (error) throw error;
    setSession(null);
    setPasswordRecovery(false);
    updateVerificationEmail("");
    setVerificationRequestedAt(0);
  }, []);

  const setVerificationEmail = useCallback((email: string, requested = false) => {
    updateVerificationEmail(email);
    setVerificationRequestedAt(requested ? Date.now() : 0);
  }, []);
  const finishPasswordRecovery = useCallback(() => setPasswordRecovery(false), []);
  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    loading,
    sessionError,
    passwordRecovery,
    finishPasswordRecovery,
    verificationEmail,
    verificationRequestedAt,
    setVerificationEmail,
    signOut,
  }), [session, loading, sessionError, passwordRecovery, finishPasswordRecovery, verificationEmail, verificationRequestedAt, setVerificationEmail, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}