/**
 * Shared auth for cron + sync endpoints. Vercel Cron sends
 * `Authorization: Bearer <CRON_SECRET>` automatically. Manual/webhook callers
 * may pass `?secret=`. If CRON_SECRET is unset (local dev), allow so routes are
 * testable — but it should always be set in deployed environments.
 */
export function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}
