import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/crm'],
      },
    ],
    sitemap: 'https://marqueeflix.netlify.app/sitemap.xml',
    host: 'https://marqueeflix.netlify.app',
  };
}
