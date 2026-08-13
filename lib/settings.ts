import { get } from '@vercel/global-config';

export interface SiteSettings {
  calendlyUrl: string;
  contactDestinationEmail: string;
  aiProvider?: 'groq' | 'openai';
  aiModel?: string;
  contactEmail: string;
  contactPhone: string;
  contactLinkedinUrl: string;
  contactUpworkUrl: string;
}

const DEFAULTS: SiteSettings = {
  calendlyUrl: 'https://calendly.com/cyrusgaburno10/new-meeting',
  contactDestinationEmail: 'cyrusgaburno10@gmail.com',
  contactEmail: 'cyrusgaburno10@gmail.com',
  contactPhone: '+63 985 785 5137',
  contactLinkedinUrl: 'https://www.linkedin.com/in/cyrus-gaburno-466a0a402',
  contactUpworkUrl: 'https://www.upwork.com/freelancers/~018180ced334a4fb38',
};

/**
 * Reads owner-editable integration settings from Vercel Global Config
 * (formerly Edge Config), so the calendar link, contact info, and AI
 * provider/model can be changed from /admin without a redeploy. Falls
 * back to the hardcoded defaults if Global Config isn't connected yet
 * or a read fails, so the site keeps working either way.
 */
export async function getSettings(): Promise<SiteSettings> {
  if (!process.env.GLOBAL_CONFIG) return DEFAULTS;

  try {
    const [
      calendlyUrl,
      contactDestinationEmail,
      aiProvider,
      aiModel,
      contactEmail,
      contactPhone,
      contactLinkedinUrl,
      contactUpworkUrl,
    ] = await Promise.all([
      get<string>('calendlyUrl'),
      get<string>('contactDestinationEmail'),
      get<string>('aiProvider'),
      get<string>('aiModel'),
      get<string>('contactEmail'),
      get<string>('contactPhone'),
      get<string>('contactLinkedinUrl'),
      get<string>('contactUpworkUrl'),
    ]);

    return {
      calendlyUrl: calendlyUrl || DEFAULTS.calendlyUrl,
      contactDestinationEmail: contactDestinationEmail || DEFAULTS.contactDestinationEmail,
      aiProvider: aiProvider === 'groq' || aiProvider === 'openai' ? aiProvider : undefined,
      aiModel: aiModel || undefined,
      contactEmail: contactEmail || DEFAULTS.contactEmail,
      contactPhone: contactPhone || DEFAULTS.contactPhone,
      contactLinkedinUrl: contactLinkedinUrl || DEFAULTS.contactLinkedinUrl,
      contactUpworkUrl: contactUpworkUrl || DEFAULTS.contactUpworkUrl,
    };
  } catch {
    return DEFAULTS;
  }
}
