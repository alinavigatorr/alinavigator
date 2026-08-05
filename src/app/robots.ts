import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/seller/', '/checkout/', '/api/', '/login', '/register'],
    },
    sitemap: 'https://alinavigator.com/sitemap.xml',
  };
}