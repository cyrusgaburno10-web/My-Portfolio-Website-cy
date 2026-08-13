type WriteResult = { ok: true } | { ok: false; error: string };

interface GlobalConfigItem {
  operation: 'create' | 'update' | 'upsert' | 'delete';
  key: string;
  value?: unknown;
}

/** Writes items to Vercel Global Config via the REST API. Requires VERCEL_API_TOKEN and GLOBAL_CONFIG_ID. */
export async function writeGlobalConfigItems(items: GlobalConfigItem[]): Promise<WriteResult> {
  const token = process.env.VERCEL_API_TOKEN;
  const configId = process.env.GLOBAL_CONFIG_ID;
  if (!token || !configId) {
    return {
      ok: false,
      error: 'Saving is not set up yet. Add VERCEL_API_TOKEN and GLOBAL_CONFIG_ID to your environment.',
    };
  }

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
      return {
        ok: false,
        error: data?.error?.message || 'Vercel rejected the update. Double-check your API token and config ID.',
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not reach Vercel to save the changes. Please try again.' };
  }
}
