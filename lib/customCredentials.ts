import { get } from '@vercel/global-config';
import { CREDENTIALS, type Credential } from './credentials';

const CUSTOM_CREDENTIALS_KEY = 'customCredentials';
const CREDENTIAL_OVERRIDES_KEY = 'credentialOverrides';

/** Credentials added through /admin, stored as a single JSON array in Global Config. */
export async function getCustomCredentials(): Promise<Credential[]> {
  if (!process.env.GLOBAL_CONFIG) return [];

  try {
    const value = await get<Credential[]>(CUSTOM_CREDENTIALS_KEY);
    return Array.isArray(value) ? value.map((c) => ({ ...c, isCustom: true })) : [];
  } catch {
    return [];
  }
}

/** Edits to the original hardcoded credentials, keyed by id, stored in Global Config since the source list can't be edited at runtime. */
export async function getCredentialOverrides(): Promise<Record<string, Credential>> {
  if (!process.env.GLOBAL_CONFIG) return {};

  try {
    const value = await get<Record<string, Credential>>(CREDENTIAL_OVERRIDES_KEY);
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

/** Custom (admin-added) credentials first, then the original lineup with any admin edits applied. */
export async function getAllCredentials(): Promise<Credential[]> {
  const [custom, overrides] = await Promise.all([getCustomCredentials(), getCredentialOverrides()]);
  const hardcoded = CREDENTIALS.map((c) => overrides[c.id] || c);
  return [...custom, ...hardcoded];
}
