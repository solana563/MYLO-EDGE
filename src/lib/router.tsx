import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { track } from "./analytics";
import { readAuthCallback } from "./auth-links";

/**
 * Lightweight hash-based router.
 *
 * The production MYLO Edge site is intended to run on Next.js App Router with
 * the route map below. This SPA build mirrors the same route contract so the
 * marketing pages can be lifted into /app/(marketing)/... without rewrites.
 */
export type RouteContext = {
  path: string;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
};

const Ctx = createContext<RouteContext>({ path: "/", navigate: () => {} });

export function readRoute(url = new URL(window.location.href)): string {
  // Supabase error/token fragments are not routes and must never enter analytics.
  if (readAuthCallback(url).isCallback) return "/auth/callback";
  if (url.hash.startsWith("#/")) {
    return url.hash.slice(1).split("?")[0].replace(/\/$/, "") || "/";
  }
  const pathname = url.pathname.replace(/\/$/, "") || "/";
  return pathname === "/index.html" ? "/" : pathname;
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() =>
    typeof window === "undefined" ? "/" : readRoute(),
  );

  useEffect(() => {
    const onHash = () => setPath(readRoute());
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, []);

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    const target = to.startsWith("/") ? to : `/${to}`;
    if (opts?.replace) {
      window.history.replaceState(window.history.state, "", `#${target}`);
      setPath(readRoute());
    } else {
      window.location.hash = target;
    }
  }, []);

  useEffect(() => {
    const [base, hashPart] = path.split("#");
    void base;
    if (!hashPart) window.scrollTo({ top: 0, behavior: "auto" });
    track("page_view", { path });
  }, [path]);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRouter() {
  return useContext(Ctx);
}

type LinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function Link({ to, children, className, onClick, ariaLabel }: LinkProps) {
  const { navigate } = useRouter();
  const isAnchor = to.startsWith("#");
  return (
    <a
      href={isAnchor ? to : `#${to}`}
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (isAnchor) {
          e.preventDefault();
          const el = document.querySelector(to);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
          onClick?.();
          return;
        }
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
