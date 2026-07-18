'use client';

import Script from 'next/script';

const CALENDLY_URL = 'https://calendly.com/cyrusgaburno10/new-meeting';
const CALENDLY_EMBED_URL = `${CALENDLY_URL}?background_color=0a0d1f&text_color=edeffb&primary_color=7882e3&hide_gdpr_banner=1`;

export function CalendlyEmbed() {
  return (
    <>
      <div
        className="calendly-inline-widget"
        data-url={CALENDLY_EMBED_URL}
        style={{ minWidth: '320px', width: '100%', height: '700px' }}
      />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </>
  );
}
