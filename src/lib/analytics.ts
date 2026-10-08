/**
 * Privacy-conscious analytics abstraction.
 *
 * No provider is wired by default. Set an adapter via `configureAnalytics()`
 * at app bootstrap (e.g. Plausible, Fathom, Umami, PostHog EU). Only
 * high-level, non-personal product events are emitted.
 */

export type AnalyticsEvent =
  | "page_view"
  | "cta_clicked"
  | "signup_started"
  | "signup_completed"
  | "product_demo_used"
  | "pricing_viewed"
  | "faq_opened"
  | "nav_opened";

export type AnalyticsProps = Record<string, string | number | boolean>;

export type AnalyticsAdapter = {
  name: string;
  send: (event: AnalyticsEvent, props?: AnalyticsProps) => void;
};

let adapter: AnalyticsAdapter | null = null;
const DEBUG = false;

export function configureAnalytics(next: AnalyticsAdapter | null) {
  adapter = next;
}

export function track(event: AnalyticsEvent, props?: AnalyticsProps) {
  try {
    adapter?.send(event, props);
    if (DEBUG) console.info("[analytics]", event, props ?? {});
  } catch {
    /* analytics must never break the UI */
  }
}
