import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './site-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const pages = fs.readdirSync(root)
  .filter((name) => name.endsWith('.html') && name !== '404.html')
  .sort();

const entries = pages.map((name) => {
  const html = fs.readFileSync(path.join(root, name), 'utf8');
  const loc = name === 'index.html' ? site.origin : `${site.origin}/${name.replace(/\.html$/, '')}`;
  const images = [...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)]
    .map((match) => ({ src: match[1], alt: match[2] }))
    .filter((image) => image.src.startsWith('/assets/'))
    .slice(0, 6);
  if (!images.length) return '';
  return `  <url><loc>${loc}</loc>${images.map((image) => `<image:image><image:loc>${site.origin}${image.src}</image:loc><image:caption>${escapeXml(image.alt)}</image:caption></image:image>`).join('')}</url>`;
}).filter(Boolean).join('\n');

fs.writeFileSync(path.join(root, 'sitemap-images.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>
`, 'utf8');

fs.writeFileSync(path.join(root, 'llms.txt'), `# HeyPalPatch

HeyPalPatch is a China-based custom patch supplier and project coordination service for international custom patch buyers.

## Key Pages
- Home: ${site.origin}
- Patch Types: ${site.origin}/patch-types
- Order Process: ${site.origin}/custom-patch-order-process
- Samples and MOQ: ${site.origin}/samples-and-moq
- Shipping and Payment: ${site.origin}/shipping-and-payment
- FAQ: ${site.origin}/faq
- Contact: ${site.origin}/contact

## Confirmed Business Information
- Email: ${site.email}
- WhatsApp: ${site.phoneDisplay}
- Location: China
- Embroidered patch MOQ: 50 pieces
- Most other patch types MOQ: 100 pieces
- Physical samples: available with a sample fee
- Digital proof timing: usually approximately 3-4 days after details are confirmed
- Bulk production timing: usually approximately 8-10 days after proof approval
- Payment: PayPal for confirmed orders
- Shipping: 4PX, DHL, FedEx and UPS may be used depending on order details

This file is a content navigation aid. It does not guarantee search indexing, rankings, AI Overview inclusion or citation by AI systems.
`, 'utf8');

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char]));
}
