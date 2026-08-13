import { get } from '@vercel/global-config';

export interface SiteSettings {
  calendlyUrl: string;
  contactDestinationEmail: string;
  aiProvider?: 'groq' | 'openai';
  aiModel?: string;
}

const DEFAULTS: SiteSettings = {
  calendlyUrl: 'https://calendly.com/cyrusgaburno10/new-meeting',
  contactDestinationEmail: 'cyrusgaburno10@gmail.com',
};

/**
 * Reads owner-editable integration settings from Vercel Global Config
 * (formerly Edge Config), so the calendar link, contact destination, and
 * AI provider/model can be changed from the Vercel dashboard without a
 * redeploy. Falls back to the hardcoded defaults if Global Config isn't
 * connected yet or a read fails, so the site keeps working either way.
 */
export async function getSettings(): Promise<SiteSettings> {
  if (!process.env.GLOBAL_CONFIG) return DEFAULTS;

  try {
    const [calendlyUrl, contactDestinationEmail, aiProvider, aiModel] = await Promise.all([
      get<string>('calendlyUrl'),
      get<string>('contactDestinationEmail'),
      get<string>('aiProvider'),
      get<string>('aiModel'),
    ]);

    return {
      calendlyUrl: calendlyUrl || DEFAULTS.calendlyUrl,
      contactDestinationEmail: contactDestinationEmail || DEFAULTS.contactDestinationEmail,
      aiProvider: aiProvider === 'groq' || aiProvider === 'openai' ? aiProvider : undefined,
      aiModel: aiModel || undefined,
    };
  } catch {
    return DEFAULTS;
  }
}
