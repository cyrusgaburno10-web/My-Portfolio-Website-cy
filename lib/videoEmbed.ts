/** Converts a YouTube, Loom, Vimeo, or Google Drive share link into an embeddable iframe URL. Returns null if the link isn't recognized. */
export function getVideoEmbedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, '');

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const id = parsed.pathname === '/watch' ? parsed.searchParams.get('v') : parsed.pathname.split('/').pop();
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === 'youtu.be') {
    const id = parsed.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === 'loom.com') {
    const id = parsed.pathname.split('/').pop();
    return id ? `https://www.loom.com/embed/${id}` : null;
  }
  if (host === 'vimeo.com') {
    const id = parsed.pathname.split('/').filter(Boolean).pop();
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === 'drive.google.com') {
    const fileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    const id = fileMatch ? fileMatch[1] : parsed.searchParams.get('id');
    return id ? `https://drive.google.com/file/d/${id}/preview` : null;
  }

  return null;
}
