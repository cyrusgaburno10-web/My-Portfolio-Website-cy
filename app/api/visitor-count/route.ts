export const runtime = 'edge';

const COUNTER_URL = 'https://abacus.jasoncameron.dev/hit/cyrusgaburno10-web-my-portfolio-website-cy/homepage-views-v1';

export async function GET() {
  try {
    const res = await fetch(COUNTER_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Counter service responded ${res.status}`);
    const data: { value: number } = await res.json();
    return Response.json({ count: data.value });
  } catch {
    return Response.json({ count: null });
  }
}
