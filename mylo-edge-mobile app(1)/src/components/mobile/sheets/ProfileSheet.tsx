import { motion, AnimatePresence } from "framer-motion";
import { X, User, LogOut, CheckCircle2, ArrowRight } from "lucide-react";
import { useMobileApp } from "../MobileAppContext";
import { useAuth } from "../../../lib/auth";
import { useRouter } from "../../../lib/router";

export function ProfileSheet() {
  const { isProfileSheetOpen, setIsProfileSheetOpen } = useMobileApp();
  const { user, signOut } = useAuth();
  const { navigate } = useRouter();

  if (!isProfileSheetOpen) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileSheetOpen(false);
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsProfileSheetOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal / Bottom Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] border-t border-white/10 bg-[#121513] p-5 pb-8 shadow-2xl sm:rounded-[24px] sm:border"
        >
          {/* Sheet Handle */}
          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/20 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white">Account & Preferences</h3>
            <button
              onClick={() => setIsProfileSheetOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-ink-muted hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {/* User State */}
            {user ? (
              <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-edge/10 text-edge">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-bold text-white">{user.email}</span>
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-edge" />
                    </div>
                    <p className="text-xs text-ink-muted">MYLO Edge Pro Trader</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-ink-muted">
                  <span>Authentication</span>
                  <span className="font-semibold text-edge">Supabase Verified</span>
                </div>

                <div className="mt-3">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/5 bg-black/40 p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-edge/10 text-edge">
                  <User className="h-6 w-6" />
                </div>
                <h4 className="mt-3 text-base font-semibold text-white">Guest Mode · Paper Trader</h4>
                <p className="mt-1 text-xs text-ink-muted">
                  Sign in or create an account with Supabase to sync your paper trading portfolio and watchlists across devices.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsProfileSheetOpen(false);
                      navigate("/login");
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileSheetOpen(false);
                      navigate("/signup");
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-edge py-2.5 text-xs font-bold text-black hover:bg-edge-soft"
                  >
                    <span>Sign Up</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Platform Settings */}
            <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <p className="text-[10px] font-bold tracking-widest text-ink-faint uppercase">
                App Preferences
              </p>

              <div className="mt-3 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Execution Mode</span>
                  <span className="rounded bg-edge/10 px-2 py-0.5 font-bold text-edge">
                    Paper Trading (Simulated)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Default Leverage</span>
                  <span className="text-white">1x - 10x Available</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Risk Invalidation Engine</span>
                  <span className="text-edge">Active (Strict)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Database & Auth</span>
                  <span className="text-white">Supabase Cloud</span>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex justify-center gap-4 text-xs text-ink-faint">
              <button
                onClick={() => {
                  setIsProfileSheetOpen(false);
                  navigate("/risk-disclosure");
                }}
                className="hover:text-white"
              >
                Risk Disclosure
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setIsProfileSheetOpen(false);
                  navigate("/privacy");
                }}
                className="hover:text-white"
              >
                Privacy
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setIsProfileSheetOpen(false);
                  navigate("/terms");
                }}
                className="hover:text-white"
              >
                Terms
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
