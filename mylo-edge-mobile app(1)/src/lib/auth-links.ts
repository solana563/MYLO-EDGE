export type AuthFlow = "signup" | "recovery";

export function readAuthCallback(url = new URL(window.location.href)) {
  const hash = new URLSearchParams(url.hash.startsWith("#/") ? "" : url.hash.slice(1));
  const get = (name: string) => url.searchParams.get(name) ?? hash.get(name);
  const flow: AuthFlow = get("auth") === "recovery" || get("type") === "recovery" ? "recovery" : "signup";
  const error = get("error_code") ?? get("error");
  const code = get("code");
  const tokenHash = get("token_hash");
  const accessToken = get("access_token");
  const refreshToken = get("refresh_token");

  return {
    flow,
    error,
    code,
    tokenHash,
    accessToken,
    refreshToken,
    isCallback: Boolean(
      code || tokenHash || accessToken || refreshToken || error || get("error_description") ||
      get("auth") === "signup" || get("auth") === "recovery",
    ),
  };
}

export type AuthCallbackDetails = ReturnType<typeof readAuthCallback>;

export function getAuthRedirectUrl(flow: AuthFlow): string {
  const url = new URL(import.meta.env.BASE_URL, window.location.origin);
  url.searchParams.set("auth", flow);
  url.hash = "/auth/callback";
  return url.toString();
}

export function clearAuthCallbackUrl() {
  const url = new URL(window.location.href);
  for (const key of [
    "auth", "code", "token_hash", "type", "access_token", "refresh_token",
    "expires_in", "expires_at", "token_type", "provider_token", "provider_refresh_token",
    "error", "error_code", "error_description", "sb_flow_id",
  ]) {
    url.searchParams.delete(key);
  }
  url.hash = "/auth/callback";
  window.history.replaceState(window.history.state, "", url.toString());
}