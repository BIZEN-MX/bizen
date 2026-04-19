import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/teacher',
        '/admin',
        '/api',
        '/diagnostic',
        '/auth',
        '/signup',
        '/login',
        '/profile',
        '/account',
        '/courses/*'
      ],
    },
    sitemap: 'https://bizen.mx/sitemap.xml',
  }
}
