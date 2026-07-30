import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = fs.readdirSync(root).filter((name) => name.endsWith('.html')).sort();
const pageByPath = new Map(files.map((file) => [file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '')}`, file]));
const inbound = new Map([...pageByPath.keys()].map((url) => [url, 0]));
const errors = [];

for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const source = file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '')}`;
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));

  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const rawHref = match[1];
    if (/^(mailto:|tel:|https:\/\/wa\.me\/|#)/i.test(rawHref)) continue;
    if (/localhost|vercel\.app/i.test(rawHref)) errors.push(`${file}: invalid external environment link ${rawHref}`);
    if (/^https?:\/\//i.test(rawHref)) {
      if (!rawHref.startsWith('https://www.heypalpatch.com')) continue;
    }

    const url = rawHref.replace('https://www.heypalpatch.com', '');
    const [pathname, hash] = url.split('#');
    if (pathname.includes('.html')) errors.push(`${file}: internal link uses .html ${rawHref}`);
    if (pathname.length > 1 && pathname.endsWith('/')) errors.push(`${file}: internal link has trailing slash ${rawHref}`);
    if (pathname.startsWith('/assets/') || pathname.startsWith('/api/')) continue;
    if (!pageByPath.has(pathname || '/')) errors.push(`${file}: dead internal link ${rawHref}`);
    if ((pathname || '/') !== source && inbound.has(pathname || '/')) inbound.set(pathname || '/', inbound.get(pathname || '/') + 1);
    if (hash && pathname === '' && !ids.has(hash)) errors.push(`${file}: missing anchor target #${hash}`);
  }

  for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"/gi)) {
    const src = match[1];
    if (src.startsWith('/assets/') && !fs.existsSync(path.join(root, src.slice(1)))) errors.push(`${file}: missing image asset ${src}`);
  }
}

for (const [url, count] of inbound) {
  if (url !== '/' && url !== '/404' && count === 0) errors.push(`orphan page: ${url}`);
}

if (!fs.existsSync(path.join(root, 'robots.txt'))) errors.push('missing robots.txt');
if (!fs.existsSync(path.join(root, 'sitemap.xml'))) errors.push('missing sitemap.xml');
if (!fs.existsSync(path.join(root, 'sitemap-images.xml'))) errors.push('missing sitemap-images.xml');
if (!fs.existsSync(path.join(root, 'feed.xml'))) errors.push('missing feed.xml');
if (!fs.existsSync(path.join(root, 'llms.txt'))) errors.push('missing llms.txt');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Link check passed for ${files.length} HTML files.`);
