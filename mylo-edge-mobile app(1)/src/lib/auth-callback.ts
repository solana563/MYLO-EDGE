import type { Session } from "@supabase/supabase-js";
import type { AuthCallbackDetails, AuthFlow } from "./auth-links";
import { getSupabase } from "./supabase";

type CallbackResult = { session: Session; flow: AuthFlow };
let attempt: { signature: string; result: Promise<CallbackResult> } | null = null;

async function exchangeCallback(details: AuthCallbackDetails): Promise<CallbackResult> {
  if (details.error) throw { code: details.error };
  const client = getSupabase();
  let session: Session | null = null;
  let flow = details.flow;

  if (details.code) {
    const { data, error } = await client.auth.exchangeCodeForSession(details.code);
    if (error) throw error;
    session = data.session;
    if ("redirectType" in data && data.redirectType === "recovery") flow = "recovery";
  } else if (details.tokenHash) {
    const { data, error } = await client.auth.verifyOtp({
      token_hash: details.tokenHash,
      type: flow === "recovery" ? "recovery" : "email",
    });
    if (error) throw error;
    session = data.session;
  } else if (details.accessToken && details.refreshToken) {
    // Accept existing Supabase implicit email links without letting the router log tokens.
    const { data, error } = await client.auth.setSession({
      access_token: details.accessToken,
      refresh_token: details.refreshToken,
    });
    if (error) throw error;
    session = data.session;
  }

  if (!session) throw { code: "otp_expired" };
  const { error } = await client.auth.getUser();
  if (error) throw error;
  return { session, flow };
}

export function completeAuthCallback(details: AuthCallbackDetails): Promise<CallbackResult> {
  const signature = [details.code, details.tokenHash, details.accessToken, details.refreshToken, details.error, details.flow].join("|");
  // An email code is single-use. React StrictMode must not exchange it twice.
  if (!attempt || attempt.signature !== signature) {
    attempt = { signature, result: exchangeCallback(details) };
  }
  return attempt.result;
}