import { useState, type ReactNode } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Info, Loader2, LockKeyhole } from "lucide-react";
import { Link } from "../../lib/router";
import { Logo } from "../navigation/Navbar";
import { Panel } from "../ui";
import { cn } from "../../utils/cn";

export const authInputClass = "mt-2 h-12 w-full rounded-lg border border-hairline-strong bg-white/[0.025] px-3.5 text-base text-ink placeholder:text-ink-faint focus:border-edge/60 disabled:opacity-60";

export function AuthLayout({ title, subtitle, children }: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10 sm:px-5 sm:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="absolute top-0 left-1/2 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(150,232,121,0.07),transparent)]" />
      </div>
      <div className="relative w-full max-w-[440px]">
        <div className="mb-8 flex justify-center">
          <Link to="/" ariaLabel="MYLO Edge home"><Logo /></Link>
        </div>
        <Panel className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between text-ink-muted">
            <span className="num text-[10px] tracking-[0.18em] uppercase">Your MYLO account</span>
            <LockKeyhole className="h-4 w-4 text-edge" aria-hidden />
          </div>
          <h1 className="text-2xl font-semibold leading-tight text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-7 border-t border-hairline pt-5">
            <p className="text-xs leading-relaxed text-ink-muted">
              Market intelligence, not financial advice. MYLO Edge does not automatically place live trades.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-muted">
              <Link to="/terms" className="underline underline-offset-4 hover:text-ink">Terms</Link>
              <Link to="/privacy" className="underline underline-offset-4 hover:text-ink">Privacy</Link>
              <Link to="/risk-disclosure" className="underline underline-offset-4 hover:text-ink">Risk Disclosure</Link>
            </div>
          </div>
        </Panel>
        <div className="mt-6 flex justify-center">
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-xs text-ink-muted hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AuthNotice({ children, tone = "info" }: {
  children: ReactNode;
  tone?: "error" | "success" | "info";
}) {
  const Icon = tone === "error" ? AlertCircle : tone === "success" ? CheckCircle2 : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-lg border p-3.5 text-[13px] leading-relaxed",
        tone === "error" ? "border-bear/30 bg-bear/[0.07] text-ink" : "border-edge/25 bg-edge/[0.055] text-ink-muted",
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", tone === "error" ? "text-bear" : "text-edge")} aria-hidden />
      <div className="min-w-0 break-words">{children}</div>
    </div>
  );
}

export function AuthProgress({ label = "Checking your session..." }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-7 text-sm text-ink-muted">
      <Loader2 className="h-4 w-4 animate-spin text-edge" aria-hidden />
      {label}
    </div>
  );
}

export function EmailField({ value, onChange, id = "auth-email" }: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-medium text-ink-muted">Email address</label>
      <input
        id={id}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="you@example.com"
        className={authInputClass}
      />
    </div>
  );
}

export function PasswordField({ value, onChange, id = "auth-password", label = "Password", newPassword = false, hint = false }: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
  newPassword?: boolean;
  hint?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-medium text-ink-muted">{label}</label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={newPassword ? "new-password" : "current-password"}
          required
          minLength={newPassword ? 8 : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={newPassword ? "At least 8 characters" : "Enter your password"}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={cn(authInputClass, "pr-12")}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute right-0 bottom-0 flex h-12 w-12 items-center justify-center rounded-r-lg text-ink-muted hover:text-ink"
        >
          {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
      </div>
      {hint && <p id={`${id}-hint`} className="mt-2 text-xs text-ink-muted">Use at least 8 characters. A longer, unique password is better.</p>}
    </div>
  );
}