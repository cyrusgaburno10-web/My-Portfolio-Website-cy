import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const VOID = '#0a0d1f';
const INDIGO = '#624cda';
const PERIWINKLE = '#7882e3';
const TEXT = '#edeffb';
const ASH = '#9aa3c7';

async function loadFont(family: string, weight: number): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  // An old Firefox UA makes Google Fonts serve legacy TTF instead of WOFF2, which is what satori (used by
  // next/og's ImageResponse) can parse.
  const css = await fetch(cssUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0.1) Gecko/20100101 Firefox/4.0.1' },
  }).then((res) => res.text());
  const fontUrlMatch = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype|woff)'\)/);
  const fontUrl = fontUrlMatch?.[1];
  if (!fontUrl) throw new Error(`Could not resolve font URL for ${family}`);
  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

export default async function Image() {
  const [spaceGrotesk, plexMono] = await Promise.all([
    loadFont('Space Grotesk', 600),
    loadFont('IBM Plex Mono', 500),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: VOID,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -180,
            right: -180,
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${INDIGO} 0%, transparent 68%)`,
            opacity: 0.55,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -220,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${PERIWINKLE} 0%, transparent 70%)`,
            opacity: 0.35,
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'IBM Plex Mono',
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: PERIWINKLE,
          }}
        >
          AI Automation Specialist
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontFamily: 'Space Grotesk',
            fontSize: 88,
            fontWeight: 600,
            color: TEXT,
            lineHeight: 1.05,
          }}
        >
          Cyrus Gaburno
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 26,
            maxWidth: 760,
            fontFamily: 'Space Grotesk',
            fontSize: 30,
            fontWeight: 400,
            color: ASH,
            lineHeight: 1.4,
          }}
        >
          Automate today. Scale without limits tomorrow.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Space Grotesk', data: spaceGrotesk, weight: 600, style: 'normal' },
        { name: 'IBM Plex Mono', data: plexMono, weight: 500, style: 'normal' },
      ],
    },
  );
}
