import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from '@/lib/adminAuth';

interface SettingsPayload {
  calendlyUrl?: string;
  contactDestinationEmail?: string;
  aiProvider?: string;
  aiModel?: string;
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const token = process.env.VERCEL_API_TOKEN;
  const configId = process.env.GLOBAL_CONFIG_ID;
  if (!token || !configId) {
    return Response.json(
      {
        error:
          'Saving is not set up yet. Add VERCEL_API_TOKEN and GLOBAL_CONFIG_ID to your environment.',
      },
      { status: 500 },
    );
  }

  let body: SettingsPayload;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const calendlyUrl = (body.calendlyUrl || '').trim();
  const contactDestinationEmail = (body.contactDestinationEmail || '').trim();
  const aiProvider = (body.aiProvider || '').trim();
  const aiModel = (body.aiModel || '').trim();

  if (calendlyUrl) {
    try {
      new URL(calendlyUrl);
    } catch {
      return Response.json({ error: 'That Calendly link doesn’t look like a valid URL.' }, { status: 400 });
    }
  }
  if (contactDestinationEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDestinationEmail)) {
    return Response.json({ error: 'That contact email doesn’t look valid.' }, { status: 400 });
  }
  if (aiProvider && aiProvider !== 'groq' && aiProvider !== 'openai') {
    return Response.json({ error: 'AI provider must be "groq" or "openai".' }, { status: 400 });
  }

  const items = [
    { operation: 'upsert', key: 'calendlyUrl', value: calendlyUrl },
    { operation: 'upsert', key: 'contactDestinationEmail', value: contactDestinationEmail },
    { operation: 'upsert', key: 'aiProvider', value: aiProvider },
    { operation: 'upsert', key: 'aiModel', value: aiModel },
  ];

  try {
    const res = await fetch(`https://api.vercel.com/v1/global-config/${configId}/items`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return Response.json(
        { error: data?.error?.message || 'Vercel rejected the update. Double-check your API token and config ID.' },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Could not reach Vercel to save the changes. Please try again.' }, { status: 500 });
  }
}
