import { isAdminAuthenticated } from '@/lib/adminAuth';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';

interface SettingsPayload {
  calendlyUrl?: string;
  contactDestinationEmail?: string;
  aiProvider?: string;
  aiModel?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactLinkedinUrl?: string;
  contactUpworkUrl?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
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
  const contactEmail = (body.contactEmail || '').trim();
  const contactPhone = (body.contactPhone || '').trim();
  const contactLinkedinUrl = (body.contactLinkedinUrl || '').trim();
  const contactUpworkUrl = (body.contactUpworkUrl || '').trim();

  if (calendlyUrl) {
    try {
      new URL(calendlyUrl);
    } catch {
      return Response.json({ error: 'That Calendly link doesn’t look like a valid URL.' }, { status: 400 });
    }
  }
  if (contactDestinationEmail && !EMAIL_RE.test(contactDestinationEmail)) {
    return Response.json({ error: 'That contact form email doesn’t look valid.' }, { status: 400 });
  }
  if (aiProvider && aiProvider !== 'groq' && aiProvider !== 'openai') {
    return Response.json({ error: 'AI provider must be "groq" or "openai".' }, { status: 400 });
  }
  if (contactEmail && !EMAIL_RE.test(contactEmail)) {
    return Response.json({ error: 'That public email doesn’t look valid.' }, { status: 400 });
  }
  if (contactLinkedinUrl) {
    try {
      new URL(contactLinkedinUrl);
    } catch {
      return Response.json({ error: 'That LinkedIn link doesn’t look like a valid URL.' }, { status: 400 });
    }
  }
  if (contactUpworkUrl) {
    try {
      new URL(contactUpworkUrl);
    } catch {
      return Response.json({ error: 'That Upwork link doesn’t look like a valid URL.' }, { status: 400 });
    }
  }

  const result = await writeGlobalConfigItems([
    { operation: 'upsert', key: 'calendlyUrl', value: calendlyUrl },
    { operation: 'upsert', key: 'contactDestinationEmail', value: contactDestinationEmail },
    { operation: 'upsert', key: 'aiProvider', value: aiProvider },
    { operation: 'upsert', key: 'aiModel', value: aiModel },
    { operation: 'upsert', key: 'contactEmail', value: contactEmail },
    { operation: 'upsert', key: 'contactPhone', value: contactPhone },
    { operation: 'upsert', key: 'contactLinkedinUrl', value: contactLinkedinUrl },
    { operation: 'upsert', key: 'contactUpworkUrl', value: contactUpworkUrl },
  ]);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true });
}
