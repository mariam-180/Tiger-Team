const { writeFileSync } = require('fs');
const { resolve } = require('path');

const baseUrl = 'https://www.tigers-team.com';

const routes = [
  { route: '/', priority: 1.0 },
  { route: '/championship', priority: 0.8 },
  { route: '/registration', priority: 0.8 },
  { route: '/reservations', priority: 0.8 },
  { route: '/Live', priority: 0.8 },
  { route: '/profile', priority: 0.5, requiredRole: 'END_USER' },
  { route: '/admin/users', priority: 0.5, requiredRole: 'EMPLOYEE_USER' },
  {
    route: '/admin/reservations',
    priority: 0.5,
    requiredRole: 'EMPLOYEE_USER',
  },
  { route: '/admin/events', priority: 0.5, requiredRole: 'EMPLOYEE_USER' },
  { route: '/admin/reports', priority: 0.5, requiredRole: 'SUPER_USER' },
];

// Filter out private routes if you don't want them included in the sitemap
const publicRoutes = routes.filter((route) => !route.requiredRole);

const generateSitemap = () => {
  const lastmod = new Date().toISOString();

  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xmlContent += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xmlContent += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
  xmlContent += `              http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  publicRoutes.forEach(({ route, priority }) => {
    xmlContent += `  <url>\n`;
    xmlContent += `    <loc>${baseUrl}${route}</loc>\n`;
    xmlContent += `    <lastmod>${lastmod}</lastmod>\n`;
    xmlContent += `    <priority>${priority}</priority>\n`;
    xmlContent += `  </url>\n`;
  });

  xmlContent += `</urlset>`;

  try {
    writeFileSync(resolve('public', 'sitemap.xml'), xmlContent);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error writing sitemap:', error);
  }
};

generateSitemap();
