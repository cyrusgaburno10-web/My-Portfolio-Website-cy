export const runtime = 'edge';

const NAMESPACE = 'cyrusgaburno10-web-my-portfolio-website-cy';
const KEY = 'homepage-visits-v1';

export async function GET(request: Request) {
  const isNewVisit = new URL(request.url).searchParams.get('new') === 'true';
  const action = isNewVisit ? 'hit' : 'get';
  const counterUrl = `https://abacus.jasoncameron.dev/${action}/${NAMESPACE}/${KEY}`;

  try {
    const res = await fetch(counterUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Counter service responded ${res.status}`);
    const data: { value: number } = await res.json();
    return Response.json({ count: data.value });
  } catch {
    return Response.json({ count: null });
  }
}
