import { createClient } from "@supabase/supabase-js";

const projectUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

function configurationError(): string | null {
  if (!projectUrl || !publishableKey) {
    return "Account access is not configured. Please contact the MYLO Edge team.";
  }
  if (!publishableKey.startsWith("sb_publishable_")) {
    return "Account access requires a Supabase publishable key. Server secrets must not be used in this website.";
  }
  try {
    const url = new URL(projectUrl);
    if (url.protocol !== "https:" || url.username || url.password) {
      return "Account access requires a valid HTTPS Supabase project URL.";
    }
  } catch {
    return "The account service URL is not configured correctly.";
  }
  return null;
}

export const supabaseConfigurationError = configurationError();

// One client owns session persistence, token refresh and cross-tab auth updates.
// The dedicated callback page exchanges PKCE codes so URL fragments remain routes.
export const supabase = supabaseConfigurationError
  ? null
  : createClient(projectUrl!, publishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: "pkce",
      },
    });

export function getSupabase() {
  if (!supabase) {
    const error = new Error(supabaseConfigurationError ?? "Account access is not configured.");
    error.name = "AuthConfigurationError";
    throw error;
  }
  return supabase;
}

export function authErrorMessage(error: unknown): string {
  const details = error as { code?: string; status?: number; name?: string; message?: string } | null;
  const code = details?.code;

  if (details?.name === "AuthConfigurationError") return details.message!;
  if (details?.status === 429 || code?.startsWith("over_")) {
    return "Too many requests. Please wait a few minutes before trying again.";
  }
  if (code === "invalid_credentials") return "The email or password is incorrect. Please try again.";
  if (code === "email_not_confirmed") return "Please verify your email address before signing in.";
  if (code === "user_already_exists" || code === "email_exists") {
    return "Unable to create an account with these details. Try signing in or resetting your password.";
  }
  if (code === "weak_password") {
    return details?.message || "Choose a stronger password with at least 8 characters.";
  }
  if (code === "same_password") return "Choose a new password that is different from your current password.";
  if (code === "email_address_invalid" || code === "validation_failed") {
    return "Please check your email address and password and try again.";
  }
  if (code === "email_address_not_authorized" || code === "unexpected_failure") {
    return "The account service could not complete this request. Email delivery may need to be configured by the MYLO Edge team.";
  }
  if (code === "signup_disabled" || code === "email_provider_disabled") {
    return "Email registration is currently unavailable. Please try again later.";
  }
  if (code === "captcha_failed") return "The account service requires an additional security check. Please contact support.";
  if (
    details?.name === "AuthPKCECodeVerifierMissingError" ||
    code === "bad_code_verifier" ||
    code === "flow_state_not_found" ||
    code === "flow_state_expired"
  ) {
    return "This link cannot be completed in this browser. Open the newest link in the browser where you requested it. If your email is already verified, you can sign in instead.";
  }
  if (code === "otp_expired" || code === "access_denied") {
    return "This email link has expired or has already been used. Please request a new link.";
  }
  if (code === "reauthentication_needed" || code === "session_not_found" || code === "refresh_token_not_found") {
    return "Your session is no longer valid. Please sign in again or request a new recovery link.";
  }
  if (details?.name === "AuthRetryableFetchError" || error instanceof TypeError || details?.status === 0) {
    return "Unable to reach the account service. Check your connection and try again.";
  }
  return "We could not complete this request. Please try again. If it continues, contact support.";
}