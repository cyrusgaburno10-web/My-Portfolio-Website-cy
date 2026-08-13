'use client';

import Script from 'next/script';

interface CalendlyEmbedProps {
  calendlyUrl: string;
}

export function CalendlyEmbed({ calendlyUrl }: CalendlyEmbedProps) {
  const embedUrl = `${calendlyUrl}?background_color=0a0d1f&text_color=edeffb&primary_color=7882e3&hide_gdpr_banner=1`;

  return (
    <>
      <div
        className="calendly-inline-widget"
        data-url={embedUrl}
        style={{ minWidth: '320px', width: '100%', height: '700px' }}
      />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </>
  );
}
