export interface ContactLink {
  label: string;
  value: string;
  qrUrl: string;
}

export const CONTACT_LINKS = {
  email: {
    label: 'Email',
    value: 'cyrusgaburno10@gmail.com',
    qrUrl: 'mailto:cyrusgaburno10@gmail.com',
  },
  whatsapp: {
    label: 'Call / WhatsApp',
    value: '+63 985 785 5137',
    qrUrl: 'https://wa.me/639857855137',
  },
  linkedin: {
    label: 'LinkedIn',
    value: 'linkedin.com/in/cyrus-gaburno-466a0a402',
    qrUrl: 'https://www.linkedin.com/in/cyrus-gaburno-466a0a402',
  },
  upwork: {
    label: 'Upwork',
    value: 'upwork.com/freelancers/~018180ced334a4fb38',
    qrUrl: 'https://www.upwork.com/freelancers/~018180ced334a4fb38',
  },
} as const satisfies Record<string, ContactLink>;
