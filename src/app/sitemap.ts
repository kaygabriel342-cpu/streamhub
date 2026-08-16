import type { MetadataRoute } from 'next';

const siteUrl = 'https://marqueeflix.netlify.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/movies',
    '/tv',
    '/anime',
    '/live',
    '/providers',
    '/trending',
    '/search',
    '/login',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/providers' || route === '/live' || route === '/anime' ? 0.9 : 0.8,
  }));
}
