import type { SiteSettings } from './settings';

export interface ContactChannel {
  label: string;
  value: string;
  qrUrl: string;
}

function stripUrlPrefix(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
}

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

/** Derives the display text and QR-code target for each contact channel from the raw settings values. */
export function buildContactChannels(settings: SiteSettings): {
  email: ContactChannel;
  whatsapp: ContactChannel;
  linkedin: ContactChannel;
  upwork: ContactChannel;
} {
  return {
    email: {
      label: 'Email',
      value: settings.contactEmail,
      qrUrl: `mailto:${settings.contactEmail}`,
    },
    whatsapp: {
      label: 'Call / WhatsApp',
      value: settings.contactPhone,
      qrUrl: `https://wa.me/${digitsOnly(settings.contactPhone)}`,
    },
    linkedin: {
      label: 'LinkedIn',
      value: stripUrlPrefix(settings.contactLinkedinUrl),
      qrUrl: settings.contactLinkedinUrl,
    },
    upwork: {
      label: 'Upwork',
      value: stripUrlPrefix(settings.contactUpworkUrl),
      qrUrl: settings.contactUpworkUrl,
    },
  };
}
