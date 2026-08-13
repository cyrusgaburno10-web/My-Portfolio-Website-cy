import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE, checkPassword, createSessionToken } from '@/lib/adminAuth';

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return Response.json(
      { error: 'The admin panel is not set up yet. Add ADMIN_PASSWORD to your environment.' },
      { status: 500 },
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const password = (body.password || '').trim();
  if (!password || !checkPassword(password)) {
    return Response.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return Response.json({ ok: true });
}
