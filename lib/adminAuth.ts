import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'cg-admin-session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function signingKey(): string {
  // Derived from the admin password so no extra secret needs configuring.
  // Anyone who already knows the password can access the panel anyway.
  return createHash('sha256').update(process.env.ADMIN_PASSWORD || '').digest('hex');
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const signature = createHmac('sha256', signingKey()).update(String(expires)).digest('hex');
  return `${expires}.${signature}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const [expiresStr, signature] = token.split('.');
  if (!expiresStr || !signature) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  const expected = createHmac('sha256', signingKey()).update(expiresStr).digest('hex');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const SESSION_COOKIE_MAX_AGE = SESSION_MAX_AGE_SECONDS;

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
