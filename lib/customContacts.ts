import { get } from '@vercel/global-config';
import { CONTACTS, type ContactEntry } from './contacts';

const CUSTOM_CONTACTS_KEY = 'customContacts';
const CONTACT_OVERRIDES_KEY = 'contactOverrides';
const DELETED_CONTACT_IDS_KEY = 'deletedContactIds';

/** Contacts added through /admin, stored as a single JSON array in Global Config. */
export async function getCustomContacts(): Promise<ContactEntry[]> {
  if (!process.env.GLOBAL_CONFIG) return [];

  try {
    const value = await get<ContactEntry[]>(CUSTOM_CONTACTS_KEY);
    return Array.isArray(value) ? value.map((c) => ({ ...c, isCustom: true })) : [];
  } catch {
    return [];
  }
}

/** Edits to the original hardcoded contacts, keyed by id, stored in Global Config since the source list can't be edited at runtime. */
export async function getContactOverrides(): Promise<Record<string, ContactEntry>> {
  if (!process.env.GLOBAL_CONFIG) return {};

  try {
    const value = await get<Record<string, ContactEntry>>(CONTACT_OVERRIDES_KEY);
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

/** IDs of original hardcoded contacts the owner has removed. */
export async function getDeletedContactIds(): Promise<string[]> {
  if (!process.env.GLOBAL_CONFIG) return [];

  try {
    const value = await get<string[]>(DELETED_CONTACT_IDS_KEY);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

/** Original contacts (minus any deleted, plus any edits) first, then any admin-added ones. */
export async function getAllContacts(): Promise<ContactEntry[]> {
  const [custom, overrides, deletedIds] = await Promise.all([
    getCustomContacts(),
    getContactOverrides(),
    getDeletedContactIds(),
  ]);
  const hardcoded = CONTACTS.filter((c) => !deletedIds.includes(c.id)).map((c) => overrides[c.id] || c);
  return [...hardcoded, ...custom];
}

/** Plain-text summary of every contact channel, for the AI chat's system prompt. */
export function describeContactsForPrompt(contacts: ContactEntry[]): string {
  return contacts.map((c) => `${c.label}: ${c.value}`).join('\n');
}
