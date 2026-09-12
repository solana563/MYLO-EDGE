import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Calendar, ShieldCheck } from "lucide-react";
import { useMobileApp } from "../MobileAppContext";
import { EVENTS } from "../../../data/demo";

export function NotificationsSheet() {
  const { isNotificationsOpen, setIsNotificationsOpen } = useMobileApp();

  if (!isNotificationsOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsNotificationsOpen(false)}
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
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-edge/10 text-edge">
                <Bell className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">Market Radar & Alerts</h3>
            </div>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-ink-muted hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-[10px] font-bold tracking-widest text-ink-faint uppercase">
              Upcoming Macro Catalysts
            </p>

            {EVENTS.map((event) => (
              <div
                key={event.title}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/30 p-3.5 transition-all hover:border-white/10"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-edge">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{event.title}</span>
                    <span className="num text-[11px] font-bold text-edge">{event.time}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-ink-muted">Affected: {event.markets}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        event.importance === "HIGH"
                          ? "bg-bear/20 text-bear"
                          : "bg-caution/20 text-caution"
                      }`}
                    >
                      {event.importance} Volatility
                    </span>
                    <span className="text-[10px] text-ink-faint">Expected: {event.vol}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4 rounded-xl border border-edge/20 bg-edge/[0.04] p-3 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-edge">
                <ShieldCheck className="h-4 w-4" />
                <span>Catalyst Risk Engine</span>
              </div>
              <p className="mt-1 text-[11px] text-ink-muted">
                MYLO automatically factors upcoming scheduled volatility events into position invalidation profiles.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
