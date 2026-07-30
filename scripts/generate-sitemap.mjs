import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './site-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function listHtml(dir = root) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['.git', 'api', 'assets', 'scripts', 'node_modules'].includes(entry.name)) return [];
      return listHtml(full);
    }
    return entry.isFile() && entry.name.endsWith('.html') ? [full] : [];
  });
}

function canonicalFromFile(file) {
  const name = path.basename(file);
  if (name === '404.html') return null;
  if (name === 'index.html') return site.origin;
  return `${site.origin}/${name.replace(/\.html$/, '')}`;
}

const urls = listHtml()
  .map((file) => ({ file, loc: canonicalFromFile(file) }))
  .filter((item) => item.loc)
  .sort((a, b) => a.loc.localeCompare(b.loc));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ file, loc }) => {
  const lastmod = fs.statSync(file).mtime.toISOString().slice(0, 10);
  return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
}).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml, 'utf8');

const feedItems = urls
  .filter(({ loc }) => ![site.origin, `${site.origin}/404`].includes(loc))
  .slice(0, 20)
  .map(({ loc, file }) => {
    const html = fs.readFileSync(file, 'utf8');
    const title = (html.match(/<title>([^<]+)<\/title>/i) || [null, loc])[1];
    const description = (html.match(/<meta name="description" content="([^"]+)"/i) || [null, 'Custom patch buyer guide from Heypal Patch.'])[1];
    return `<item><title>${escapeXml(title)}</title><link>${loc}</link><guid>${loc}</guid><description>${escapeXml(description)}</description></item>`;
  }).join('\n');

fs.writeFileSync(path.join(root, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Heypal Patch Custom Patch Guides</title><link>${site.origin}</link><description>Custom patch buyer guides, material comparisons and order information.</description>${feedItems}</channel></rss>
`, 'utf8');

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char]));
}
