# Supabase Authentication

## Project Configuration

The site uses `@supabase/supabase-js` with the supplied project:

`https://lwcypxiwkgphuekygrps.supabase.co`

The `.env` file contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. These values are intentionally public and included in the browser build. They identify the project; they do not provide administrator privileges.

Use an ignored `.env.local` file or your deployment environment to override them. Vite reads these variables at build time, so rebuild after changing them. Never put `service_role`, `sb_secret_`, SMTP passwords, or other server credentials in any `VITE_*` variable or frontend source file.

## Dashboard Setup

1. Open the project's Authentication settings and confirm that the Email provider is enabled. Keep email confirmation enabled for production.
2. In Authentication > URL Configuration, set Site URL to the deployed website origin, for example `https://myloedge.com`.
3. Add the two exact callback URLs below to Redirect URLs. Add the equivalent pair for each development, preview, or production origin that will initiate authentication.
4. Configure custom SMTP in Authentication > Email settings for delivery to public users. Supabase's built-in sender is restricted to authorized project-team addresses and has low rate limits; a publishable key does not configure email delivery.
5. Keep the confirmation and recovery templates linked to `{{ .ConfirmationURL }}`. A template that links only to the site homepage will not exchange the email token. Review any customized templates before testing.

Production callback URLs:

- `https://myloedge.com/?auth=signup#/auth/callback`
- `https://myloedge.com/?auth=recovery#/auth/callback`

Local Vite callback URLs, when running on port 5173:

- `http://localhost:5173/?auth=signup#/auth/callback`
- `http://localhost:5173/?auth=recovery#/auth/callback`

Use the actual address shown by your dev server or preview environment if it differs. If the public site uses `www`, add that exact origin too. Prefer exact production URLs over broad wildcard allowlists. The application constructs callbacks from the current origin and Vite base path; it never trusts a caller-supplied redirect destination.

Dashboard settings cannot be changed using a publishable key and were not modified as part of this frontend integration.

## Implemented Flows

| Route | Behavior |
| --- | --- |
| `/#/signup` | Calls `auth.signUp` with email and password. If confirmation is required, shows verification instructions instead of pretending the user is signed in. If Supabase returns a session, proceeds to the account page. |
| `/#/login` | Calls `auth.signInWithPassword`. Invalid credentials, unconfirmed email, network failures, and rate limits produce inline feedback. |
| `/#/verify-email` | Requests another signup email using `auth.resend`, with a cooldown after a successful request. Users can correct the email address. |
| `/?auth=signup#/auth/callback` | Exchanges the one-use PKCE code, validates the user with Supabase, removes auth parameters, and opens the account page. |
| `/#/forgot-password` | Calls `auth.resetPasswordForEmail`. The response does not reveal whether an email address belongs to an account. |
| `/?auth=recovery#/auth/callback` | Completes the recovery session and opens the password update form. |
| `/#/reset-password` | Requires an authenticated session. Calls `auth.updateUser` after checking that the two password entries match. Can also be used by an already signed-in user. |
| `/#/onboarding` | Requires a session. Saves real research preferences with `auth.updateUser`, offers password changes, and signs out using `auth.signOut({ scope: "local" })`. |

The shared session provider subscribes to Supabase auth events, restores a stored session, and updates the desktop/mobile navigation. The SDK manages token refresh and cross-tab events. No passwords are stored or logged by application code. The SDK persists session credentials in browser storage, as appropriate for this client-side SPA.

PKCE links should be opened in the same browser and origin where the request started, because that browser holds the code verifier. Always use the newest email link. If email confirmation occurs in another browser but the local session cannot be established, sign in with email/password afterward. Recovery links that fail in another browser should be requested again from that browser.

The callback also accepts Supabase's legacy implicit email-link fragments and token-hash email callbacks. All callback credentials are excluded from route analytics and removed from the URL after processing. React StrictMode cannot exchange the same one-use code twice.

## Preferences And Authorization

Onboarding saves these fields in `user.user_metadata`:

- `mylo_markets`: selected asset classes.
- `mylo_experience`: Learning, Active, or Systematic.
- `mylo_onboarding_completed_at`: first completion timestamp.

These are user-editable preferences, not permissions or entitlements. Do not use them to authorize paid features, private data access, or administrative actions.

This integration does not create or query public database tables. When connecting the private terminal, protect every table and storage bucket with appropriate Row Level Security policies, and validate sessions on server/API boundaries. A React route guard is a UI convenience, not a database security boundary.

## Separate Terminal

`VITE_MYLO_APP_URL` is optional and currently empty. Set it to the real terminal's HTTPS URL to show an account-page link. The marketing site does not invent a terminal session or pass access/refresh tokens in a URL.

Browser storage is origin-scoped. A separate app, including one at `app.myloedge.com`, must authenticate against the same Supabase project or implement an appropriate server-managed session handoff. An ordinary link alone does not provide cross-domain single sign-on.

## Verification Checklist

The production bundle has been built successfully. Live user registration, inbox delivery, confirmation redirects, and password recovery still need to be exercised with a controlled test account and the dashboard configuration above. No test user was created and no email was sent during implementation.

1. Open sign-up and submit a new address you control. Confirm that the user appears in Supabase Authentication > Users.
2. With email confirmation enabled, confirm that no account session is shown before verification. Test resend and its cooldown.
3. Open the newest confirmation link in the same browser. Confirm that the account page appears, not a 404, and that callback parameters are removed from the URL.
4. Save preferences, refresh, and confirm that the values remain. Sign out and verify that opening onboarding returns to sign-in.
5. Sign in with correct credentials. Test an incorrect password and an unconfirmed address without exposing account information in the generic failure case.
6. Request a recovery email. Test a mismatched password confirmation, then update successfully. Sign out and confirm the new password works and the old one does not.
7. Test an expired/reused email link, a link opened in another browser, missing environment configuration, and a network failure. No failed response should be presented as success.
8. Verify navigation and auth state in a second browser tab, and check the forms on mobile with keyboard navigation and password managers.

No test or lint scripts are configured in the repository. Vite builds the app but does not perform a standalone TypeScript check; run `npx tsc --noEmit` separately in development/CI. Review the dependency audit and Supabase security settings before a public launch.

## References

- [Password-based authentication](https://supabase.com/docs/guides/auth/passwords)
- [Redirect URL configuration](https://supabase.com/docs/guides/auth/redirect-urls)
- [PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow)
- [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)