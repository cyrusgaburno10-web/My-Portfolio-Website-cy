import type { ContactEntry, ContactIconKey } from './contacts';

export const CONTACT_ICON_KEYS: ContactIconKey[] = ['mail', 'phone', 'chat', 'globe', 'briefcase', 'send', 'link'];

export type ParsedContactFields = Omit<ContactEntry, 'id' | 'isCustom'>;
export type ParseContactFormResult =
  | { ok: true; fields: ParsedContactFields }
  | { ok: false; error: string; status: number };

interface ContactFormBody {
  label?: unknown;
  value?: unknown;
  link?: unknown;
  icon?: unknown;
}

/** Validates a contact submission. No file involved, so this works on a plain JSON body. */
export function parseContactForm(body: ContactFormBody): ParseContactFormResult {
  const label = String(body.label || '').trim();
  const value = String(body.value || '').trim();
  const link = String(body.link || '').trim();
  const icon = String(body.icon || '').trim() as ContactIconKey;

  if (!label || !value || !link) {
    return { ok: false, error: 'Please fill in the label, display text, and link.', status: 400 };
  }
  if (!CONTACT_ICON_KEYS.includes(icon)) {
    return { ok: false, error: 'Please choose an icon.', status: 400 };
  }

  return { ok: true, fields: { label, value, link, icon } };
}
