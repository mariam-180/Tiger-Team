const {writeFileSync} = require('fs');
const {resolve} = require('path');

const baseUrl = 'https://www.tigers-team.com';
const routes = [
  {route: '/', priority: 1.0, lastmod: new Date().toISOString()},
  {route: '/championship', priority: 0.8, lastmod: new Date().toISOString()},
  {route: '/live', priority: 0.8, lastmod: new Date().toISOString()},
];

const generateSitemap = () => {
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xmlContent += '      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xmlContent += '      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xmlContent += '            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

  routes.forEach((page) => {
    xmlContent += `  <url>\n`;
    xmlContent += `    <loc>${baseUrl}${page.route}</loc>\n`;
    if (page.lastmod) {
      xmlContent += `    <lastmod>${page.lastmod}</lastmod>\n`;
    }
    xmlContent += `    <priority>${page.priority}</priority>\n`;
    xmlContent += `  </url>\n`;
  });

  xmlContent += '</urlset>';

  writeFileSync(resolve('public', 'sitemap.xml'), xmlContent);
};

generateSitemap();
