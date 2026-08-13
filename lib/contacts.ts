export type ContactIconKey = 'mail' | 'phone' | 'chat' | 'globe' | 'briefcase' | 'send' | 'link';

export interface ContactEntry {
  id: string;
  label: string;
  value: string;
  link: string;
  icon: ContactIconKey;
  /** True for contacts added through /admin, as opposed to the hardcoded seed list below. */
  isCustom?: boolean;
}

export const CONTACTS: ContactEntry[] = [
  {
    id: 'email',
    label: 'Email',
    value: 'cyrusgaburno10@gmail.com',
    link: 'mailto:cyrusgaburno10@gmail.com',
    icon: 'mail',
  },
  {
    id: 'whatsapp',
    label: 'Call / WhatsApp',
    value: '+63 985 785 5137',
    link: 'https://wa.me/639857855137',
    icon: 'phone',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/cyrus-gaburno-466a0a402',
    link: 'https://www.linkedin.com/in/cyrus-gaburno-466a0a402',
    icon: 'globe',
  },
  {
    id: 'upwork',
    label: 'Upwork',
    value: 'upwork.com/freelancers/~018180ced334a4fb38',
    link: 'https://www.upwork.com/freelancers/~018180ced334a4fb38',
    icon: 'briefcase',
  },
];
