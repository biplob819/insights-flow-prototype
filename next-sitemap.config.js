/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://insights-flow.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/admin/*', '/dashboard/create'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/create'],
      },
    ],
    additionalSitemaps: [
      'https://insights-flow.vercel.app/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
