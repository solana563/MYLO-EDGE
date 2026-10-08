export const SITE = {
  name: "MYLO Edge",
  tagline: "Find your market edge.",
  origin: "https://myloedge.com",
  // A different origin must establish its own authenticated session.
  appUrl: import.meta.env.VITE_MYLO_APP_URL?.trim() || "",
  social: [
    { label: "X", href: "https://x.com/myloedge" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/myloedge" },
    { label: "GitHub", href: "https://github.com/myloedge" },
  ],
};

export type Meta = { title: string; description: string };

export const META: Record<string, Meta> = {
  "/": {
    title: "MYLO Edge | Find Your Market Edge",
    description:
      "Market intelligence, research consensus, risk analysis, backtesting and paper trading for traders who want a clearer view of the market.",
  },
  "/how-it-works": {
    title: "How It Works | MYLO Edge",
    description:
      "Observe, analyze, research and assess risk. See the four-step workflow behind MYLO Edge market intelligence.",
  },
  "/markets": {
    title: "Markets | MYLO Edge",
    description:
      "Explore instruments across equities, crypto, forex, commodities and indices with structured market context.",
  },
  "/signals": {
    title: "Signals & Signal Forensics | MYLO Edge",
    description:
      "Monitor structured signals and study historical outcomes by asset, timeframe, market regime and Edge Score range.",
  },
  "/research": {
    title: "Research Consensus | MYLO Edge",
    description:
      "Structured research reports covering technical, news, sentiment, fundamental and macro evidence — including the bear case.",
  },
  "/backtesting": {
    title: "Backtesting | MYLO Edge",
    description:
      "Test strategies against historical market data with an architecture designed to limit look-ahead bias and account for costs.",
  },
  "/paper-trading": {
    title: "Paper Trading | MYLO Edge",
    description:
      "Practice with simulated capital: simulated orders, positions, P&L, portfolio views, risk controls and trade history.",
  },
  "/pricing": {
    title: "Pricing | MYLO Edge",
    description:
      "Plans for learning, active and systematic traders. Start free with paper trading and basic market intelligence.",
  },
  "/about": {
    title: "About | MYLO Edge",
    description:
      "MYLO Edge exists to make market research more structured, transparent and accessible.",
  },
  "/resources": {
    title: "Resources | MYLO Edge",
    description:
      "Market guides, trading concepts, research methodology, backtesting and risk management guides, glossary and FAQ.",
  },
  "/contact": {
    title: "Contact | MYLO Edge",
    description:
      "Get in touch with the MYLO Edge team about support, partnerships, press or product feedback.",
  },
  "/login": {
    title: "Sign In | MYLO Edge",
    description: "Sign in to the MYLO Edge application.",
  },
  "/signup": {
    title: "Get Started | MYLO Edge",
    description: "Create a MYLO Edge account and start with paper trading.",
  },
  "/forgot-password": {
    title: "Reset Password | MYLO Edge",
    description: "Recover access to your MYLO Edge account.",
  },
  "/reset-password": {
    title: "Update Password | MYLO Edge",
    description: "Choose a new password for your MYLO Edge account.",
  },
  "/auth/callback": {
    title: "Confirm Account Access | MYLO Edge",
    description: "Complete your MYLO Edge email confirmation or account recovery.",
  },
  "/verify-email": {
    title: "Verify Email | MYLO Edge",
    description: "Confirm your email address to activate your MYLO Edge account.",
  },
  "/onboarding": {
    title: "Onboarding | MYLO Edge",
    description: "Set up your MYLO Edge workspace.",
  },
  "/terms": { title: "Terms of Use | MYLO Edge", description: "MYLO Edge terms of use." },
  "/privacy": { title: "Privacy Policy | MYLO Edge", description: "How MYLO Edge handles your data." },
  "/risk-disclosure": {
    title: "Trading Risk Disclosure | MYLO Edge",
    description: "Markets involve risk. Read the MYLO Edge trading risk disclosure.",
  },
  "/cookies": { title: "Cookie Policy | MYLO Edge", description: "How MYLO Edge uses cookies." },
};

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function applyMeta(path: string) {
  const meta =
    META[path] ?? {
      title: "Page not found | MYLO Edge",
      description: "Looks like this market moved.",
    };
  const url = `${SITE.origin}${path === "/" ? "" : path}`;

  document.title = meta.title;
  upsertMeta('meta[name="robots"]', {
    name: "robots",
    content: ["/login", "/signup", "/forgot-password", "/reset-password", "/auth/callback", "/verify-email", "/onboarding"].includes(path)
      ? "noindex, nofollow"
      : "index, follow",
  });
  upsertMeta('meta[name="description"]', { name: "description", content: meta.description });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: meta.title });
  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: meta.description,
  });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE.name });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: meta.title });
  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: meta.description,
  });
  upsertLink("canonical", url);
}

export function injectStructuredData() {
  const id = "mylo-jsonld";
  if (document.getElementById(id)) return;
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MYLO Edge",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: SITE.origin,
    description: META["/"].description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.id = id;
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}
