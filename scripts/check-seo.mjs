import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './site-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const titles = new Map();
const descriptions = new Map();
const sitemap = fs.existsSync(path.join(root, 'sitemap.xml')) ? fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8') : '';

const files = fs.readdirSync(root).filter((name) => name.endsWith('.html')).sort();

for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const slug = file === 'index.html' ? '' : file.replace(/\.html$/, '');
  const expectedCanonical = slug ? `${site.origin}/${slug}` : site.origin;
  const title = textMatch(html, /<title>([^<]+)<\/title>/i);
  const description = textMatch(html, /<meta name="description" content="([^"]+)"/i);
  const canonical = textMatch(html, /<link rel="canonical" href="([^"]+)"/i);
  const ogUrl = textMatch(html, /<meta property="og:url" content="([^"]+)"/i);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);

  if (!title) errors.push(`${file}: missing title`);
  if (!description) errors.push(`${file}: missing meta description`);
  if (title) addUnique(titles, title, file, 'duplicate title');
  if (description) addUnique(descriptions, description, file, 'duplicate meta description');
  if (h1Count !== 1) errors.push(`${file}: expected one H1, found ${h1Count}`);
  if (!canonical) errors.push(`${file}: missing canonical`);
  if (canonical && canonical !== expectedCanonical) errors.push(`${file}: canonical should be ${expectedCanonical}, found ${canonical}`);
  if (canonical && (canonical.includes('.html') || (canonical !== site.origin && canonical.endsWith('/')) || !canonical.startsWith(site.origin))) errors.push(`${file}: invalid canonical format`);
  if (ogUrl && ogUrl !== canonical) errors.push(`${file}: og:url does not match canonical`);
  if (!/og:image:alt/.test(html)) errors.push(`${file}: missing og:image:alt`);
  if (!/twitter:image:alt/.test(html)) errors.push(`${file}: missing twitter:image:alt`);
  if (file !== '404.html' && noindex) errors.push(`${file}: unexpected noindex`);
  if (file === '404.html' && !noindex) errors.push('404.html: missing noindex, follow');
  if (/localhost|patch-delta\.vercel\.app|vercel\.app/i.test(html)) errors.push(`${file}: contains localhost or Vercel preview link`);

  for (const img of html.matchAll(/<img\b([^>]+)>/gi)) {
    const attrs = img[1];
    if (!/\balt="[^"]*"/i.test(attrs)) errors.push(`${file}: image missing alt attribute`);
    if (!/\bwidth="\d+"/i.test(attrs)) errors.push(`${file}: image missing width`);
    if (!/\bheight="\d+"/i.test(attrs)) errors.push(`${file}: image missing height`);
    if (!/\bdecoding="async"/i.test(attrs) && !/\bfetchpriority="high"/i.test(attrs)) errors.push(`${file}: image missing decoding async`);
  }
  const highPriority = (html.match(/fetchpriority="high"/gi) || []).length;
  if (highPriority > 1) errors.push(`${file}: more than one fetchpriority high image`);

  for (const script of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(script[1]);
    } catch (error) {
      errors.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }

  if (file !== '404.html' && sitemap && !sitemap.includes(`<loc>${expectedCanonical}</loc>`)) {
    errors.push(`${file}: missing from sitemap.xml`);
  }
}

for (const loc of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const value = loc[1];
  if (!value.startsWith(site.origin)) errors.push(`sitemap: non-www or wrong host ${value}`);
  if (value.includes('.html')) errors.push(`sitemap: contains .html URL ${value}`);
  if (value !== site.origin && value.endsWith('/')) errors.push(`sitemap: contains trailing slash ${value}`);
  const file = value === site.origin ? 'index.html' : `${value.slice(site.origin.length + 1)}.html`;
  if (!fs.existsSync(path.join(root, file))) errors.push(`sitemap: URL has no HTML file ${value}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`SEO check passed for ${files.length} HTML files.`);

function textMatch(text, regex) {
  return (text.match(regex) || [null, ''])[1];
}

function addUnique(map, value, file, label) {
  if (map.has(value)) errors.push(`${file}: ${label} also used by ${map.get(value)}`);
  map.set(value, file);
}
