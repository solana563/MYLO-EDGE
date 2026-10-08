/**
 * Pricing is configuration-driven. Commercial terms are not finalised, so no
 * prices are hard-coded. Set `price` on a tier once it is approved.
 */
export type Tier = {
  id: string;
  name: string;
  kicker: string;
  price?: string;
  period?: string;
  note: string;
  cta: { label: string; to: string };
  featured?: boolean;
  features: string[];
};

export const PRICING_STATUS: "coming-soon" | "live" = "coming-soon";

export const TIERS: Tier[] = [
  {
    id: "free",
    name: "FREE",
    kicker: "Start researching",
    note: "Available at launch",
    cta: { label: "Get Started", to: "/signup" },
    features: [
      "Basic market intelligence",
      "Watchlists",
      "Limited research reports",
      "Basic charts",
      "Paper trading",
    ],
  },
  {
    id: "pro",
    name: "PRO",
    kicker: "The full research workflow",
    note: "Pricing coming soon",
    featured: true,
    cta: { label: "Join the waitlist", to: "/contact" },
    features: [
      "Advanced research consensus",
      "Advanced scanner",
      "Full Edge Score breakdown",
      "Backtesting",
      "Advanced alerts",
      "Expanded paper trading",
    ],
  },
  {
    id: "custom",
    name: "FUTURE / CUSTOM",
    kicker: "Advanced and professional workflows",
    note: "Talk to us",
    cta: { label: "Contact us", to: "/contact" },
    features: [
      "Higher data and compute limits",
      "Custom research configurations",
      "Workflow and API integration",
      "Team workspaces",
      "Priority support",
    ],
  },
];
