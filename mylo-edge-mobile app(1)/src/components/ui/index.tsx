import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { Link } from "../../lib/router";
import { track } from "../../lib/analytics";

/* ---------------- Reveal ---------------- */

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Use "li" when the reveal wraps a list item, so list markup stays valid. */
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -8% 0px" });
  const reduce = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      ref={ref as never}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/* ---------------- Buttons ---------------- */

type BtnProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  event?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants = {
  primary:
    "border border-edge/70 bg-edge text-void hover:bg-edge-soft shadow-[0_10px_30px_-14px_rgba(150,232,121,0.65)] active:translate-y-px",
  outline:
    "border border-hairline-strong bg-white/[0.02] text-ink hover:bg-white/[0.06] hover:border-white/20",
  ghost: "text-ink-muted hover:text-ink hover:bg-white/[0.05]",
};

const sizes = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function Button({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  className,
  event,
  ...rest
}: BtnProps) {
  const cls = cn(btnBase, variants[variant], sizes[size], className);
  const onFire = () => event && track("cta_clicked", { cta: event });

  if (to)
    return (
      <Link to={to} className={cls} onClick={onFire}>
        {children}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls} onClick={onFire} rel="noreferrer">
        {children}
      </a>
    );
  return (
    <button className={cls} onClick={onFire} {...rest}>
      {children}
    </button>
  );
}

/* ---------------- Panel ---------------- */

export function Panel({
  children,
  className,
  hover = false,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <As
      className={cn(
        "glass rounded-panel",
        hover &&
          "transition-all duration-300 hover:border-white/12 hover:bg-white/[0.045] hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </As>
  );
}

/* ---------------- Section shell ---------------- */

export function Section({
  children,
  className,
  id,
  tight = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto w-full max-w-[1200px] px-5 sm:px-7",
        tight ? "py-10 sm:py-16" : "py-14 sm:py-20 lg:py-28",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="h-px w-6 bg-edge/50" aria-hidden />
      <span className="num text-[10.5px] font-medium tracking-[0.22em] text-edge uppercase">
        {children}
      </span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div className={cn(align === "center" && "flex justify-center")}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className="text-[26px] leading-[1.12] font-semibold sm:text-[36px] lg:text-[42px]">
        <span className="text-gradient">{title}</span>
      </h2>
      {sub && (
        <p className="mt-4 text-[15px] leading-relaxed text-ink-muted sm:text-base">
          {sub}
        </p>
      )}
    </div>
  );
}

/* ---------------- Tags ---------------- */

export function DemoTag({
  label = "DEMO DATA",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "num inline-flex items-center gap-1.5 rounded border border-caution/30 bg-caution/10 px-1.5 py-0.5 text-[9.5px] font-semibold tracking-[0.16em] text-caution uppercase",
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-caution" aria-hidden />
      {label}
    </span>
  );
}

export function Badge({
  children,
  tone = "info",
  className,
}: {
  children: ReactNode;
  tone?: "bull" | "bear" | "warn" | "info" | "neutral";
  className?: string;
}) {
  const tones = {
    bull: "text-bull border-bull/30 bg-bull/10",
    bear: "text-bear border-bear/30 bg-bear/10",
    warn: "text-caution border-caution/30 bg-caution/10",
    info: "text-info border-info/30 bg-info/10",
    neutral: "text-ink-muted border-hairline-strong bg-white/[0.04]",
  };
  return (
    <span
      className={cn(
        "num inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Disclosure / note ---------------- */

export function Disclosure({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-faint",
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function Accordion({
  items,
  onOpen,
}: {
  items: { q: string; a: string }[];
  onOpen?: (q: string) => void;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-hairline overflow-hidden rounded-panel border border-hairline">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="bg-white/[0.015]">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => {
                  setOpen(isOpen ? null : i);
                  if (!isOpen) onOpen?.(it.q);
                }}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[0.03] sm:px-6"
              >
                <span className="text-[14.5px] font-medium text-ink">{it.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-ink-faint transition-transform duration-300",
                    isOpen && "rotate-180 text-edge",
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-5 text-[14px] leading-relaxed text-ink-muted sm:px-6">
                  {it.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Animated number ---------------- */

export function CountUp({
  to,
  duration = 1100,
  className,
  suffix = "",
}: {
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={cn("num", className)}>
      {Math.round(val)}
      {suffix}
    </span>
  );
}

/* ---------------- Meter ---------------- */

export function Meter({
  label,
  value,
  tone = "edge",
  compact = false,
}: {
  label: string;
  value: number;
  tone?: "edge" | "bull" | "bear" | "warn";
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const colors = {
    edge: "bg-edge",
    bull: "bg-bull",
    bear: "bg-bear",
    warn: "bg-caution",
  };
  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={cn(
            "num tracking-[0.1em] text-ink-muted uppercase",
            compact ? "text-[10px]" : "text-[10.5px]",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "num font-semibold text-ink",
            compact ? "text-[12px]" : "text-[13px]",
          )}
        >
          {value}
        </span>
      </div>
      <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={cn("h-full rounded-full transition-[width] duration-[900ms] ease-out", colors[tone])}
          style={{ width: inView ? `${value}%` : "0%" }}
        />
      </div>
    </div>
  );
}
