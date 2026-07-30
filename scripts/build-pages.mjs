import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, facts, products, intentPages, guidePages, faqItems, orderSteps } from './site-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pageMap = new Map();

const patchTypes = [
  ...products.map((product) => [product.slug, product.name]),
  ...intentPages.map(([slug, name]) => [slug, name])
];

const primaryNav = [
  ['Patch Types', '/patch-types'],
  ['Process', '/custom-patch-order-process'],
  ['MOQ', '/samples-and-moq'],
  ['Shipping', '/shipping-and-payment'],
  ['FAQ', '/faq'],
  ['Contact', '/contact'],
  ['Get a Quote', '/get-a-quote', 'nav-quote']
];

function cleanUrl(slug) {
  return slug === 'index' ? site.origin : `${site.origin}/${slug}`;
}

function href(slug) {
  return slug === 'index' ? '/' : `/${slug}`;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function pageFile(slug) {
  return slug === 'index' ? 'index.html' : `${slug}.html`;
}

function register(page) {
  pageMap.set(page.slug, page);
  fs.writeFileSync(path.join(root, pageFile(page.slug)), render(page), 'utf8');
}

function imagePath(file) {
  if (file.startsWith('/assets/')) return file;
  return `/assets/${file}`;
}

function head(page) {
  const url = cleanUrl(page.slug);
  const image = `${site.origin}${page.image || site.image}`;
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${site.origin}/#organization`,
      name: site.brand,
      url: site.origin,
      description: 'Heypal Patch is a China-based custom patch supplier providing quotation support, digital proof coordination, production arrangement and international shipping support for custom patch orders.',
      areaServed: 'International'
    },
    {
      '@type': 'WebSite',
      '@id': `${site.origin}/#website`,
      name: site.brand,
      url: site.origin,
      publisher: { '@id': `${site.origin}/#organization` }
    },
    breadcrumbSchema(page)
  ];
  if (page.faqs?.length) {
    graph.push({ '@type': 'FAQPage', mainEntity: page.faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  }
  if (page.schemaType) {
    graph.push({
      '@type': page.schemaType,
      name: page.h1,
      description: page.description,
      brand: { '@type': 'Brand', name: site.brand },
      provider: { '@id': `${site.origin}/#organization` },
      areaServed: 'International'
    });
  }
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  ${page.noindex ? '<meta name="robots" content="noindex, follow">' : ''}
  <meta name="theme-color" content="#0D0F12">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:type" content="${page.slug === 'index' ? 'website' : 'article'}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${esc(page.imageAlt || page.h1)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(page.description)}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${esc(page.imageAlt || page.h1)}">
  <link rel="stylesheet" href="/assets/site.css">
  <script type="application/ld+json">${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}</script>
</head>`;
}

function breadcrumbSchema(page) {
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.origin }];
  if (page.slug !== 'index') items.push({ '@type': 'ListItem', position: 2, name: page.h1, item: cleanUrl(page.slug) });
  return { '@type': 'BreadcrumbList', '@id': `${cleanUrl(page.slug)}#breadcrumb`, itemListElement: items };
}

function header() {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <div class="announcement-bar"><div class="wrap">Custom patch supplier and project coordination partner in China</div></div>
  <header class="site-header" data-header>
    <div class="wrap nav-shell">
      <a class="brand" href="/" aria-label="Heypal Patch home">Heypal Patch</a>
      <button class="menu-toggle" type="button" aria-controls="primary-menu" aria-expanded="false"><span></span><span></span><span></span><span class="sr-only">Open menu</span></button>
      <nav class="primary-nav" id="primary-menu" aria-label="Primary navigation">
        <ul>
          <li class="mega-parent"><a href="/patch-types">Patch Types</a><div class="mega-menu">${products.map((product) => `<a href="/${product.slug}"><img src="${product.image}" width="160" height="160" loading="lazy" decoding="async" alt="${esc(product.name)} material reference"><span>${esc(product.name.replace('Custom ', ''))}</span></a>`).join('')}</div></li>
          ${primaryNav.slice(1).map(([label, url, cls]) => `<li><a${cls ? ` class="${cls}"` : ''} href="${url}">${label}</a></li>`).join('')}
        </ul>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="wrap footer-grid">
      <div><a class="brand footer-brand" href="/">Heypal Patch</a><p>${esc(site.description)}</p></div>
      <div><h2>Company</h2><a href="/about">About</a><a href="/gallery">Gallery</a><a href="/blog">Blog</a><a href="/samples-and-moq">Samples and MOQ</a><a href="/shipping-and-payment">Shipping and Payment</a><a href="/custom-patch-order-process">Order Process</a><a href="/faq">FAQ</a><a href="/contact">Contact</a><a href="/get-a-quote">Quote</a></div>
      <div><h2>Patch Types</h2>${products.map((product) => `<a href="/${product.slug}">${esc(product.name)}</a>`).join('')}<a href="/custom-iron-on-patches">Iron-On Patches</a><a href="/custom-velcro-patches">Hook-and-Loop Patches</a></div>
      <div><h2>Buyer Guides</h2><a href="/embroidered-vs-woven-patches">Embroidered vs Woven</a><a href="/pvc-vs-embroidered-patches">PVC vs Embroidered</a><a href="/iron-on-vs-sew-on-patches">Iron-On vs Sew-On</a><a href="/how-much-do-custom-patches-cost">Patch Cost Factors</a><a href="/how-to-design-a-custom-patch">Design Guide</a><a href="/custom-patch-file-formats">File Formats</a><a href="/custom-patch-backing-options-guide">Backing Guide</a><a href="/patch-care-guide">Care Guide</a><a href="/custom-patches-for-business">Business Patches</a><a href="/custom-motorcycle-patches">Motorcycle Patches</a><a href="/self-adhesive-vs-sew-on-patches">Adhesive vs Sew-On</a></div>
    </div>
  </footer>
  <a class="whatsapp-float" href="${site.whatsapp}?text=${encodeURIComponent(site.whatsappText)}" aria-label="Chat with Heypal Patch on WhatsApp"><span>WhatsApp</span></a>
  <script src="/assets/site.js" defer></script>`;
}

function breadcrumbs(page) {
  if (page.slug === 'index') return '';
  return `<nav class="breadcrumbs wrap" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>${esc(page.h1)}</span></nav>`;
}

function render(page) {
  return `<!doctype html>
<html lang="en">
${head(page)}
<body>
${header()}
${breadcrumbs(page)}
<main id="main">
${page.body}
</main>
${footer()}
</body>
</html>
`;
}

function hero(page, actions = true) {
  const hasImage = Boolean(page.image);
  return `<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">${esc(page.kicker || 'Custom patches for brands, teams and merchandise')}</p>
      <h1>${esc(page.h1)}</h1>
      <p class="lead">${esc(page.direct || page.description)}</p>
      ${actions ? `<div class="actions"><a class="button primary" href="/get-a-quote">Request a Quote</a><a class="button secondary" href="/patch-types">Compare Patch Types</a></div>` : ''}
    </div>
    ${hasImage ? `<figure class="hero-media ${page.heroClass || ''}"><img src="${page.image}" width="900" height="900" decoding="async" fetchpriority="high" alt="${esc(page.imageAlt || page.h1)}"><figcaption>${esc(page.imageCaption || 'Material reference')}</figcaption></figure>` : ''}
  </div>
</section>`;
}

function quickFacts(product) {
  return `<section class="section band"><div class="wrap">
    <p class="eyebrow">Quick facts</p>
    <div class="table-wrap"><table>
      <tbody>
        <tr><th>Minimum order quantity</th><td>${product.slug === 'custom-embroidered-patches' ? facts.embroideredMoq : facts.otherMoq}</td></tr>
        <tr><th>Sample availability</th><td>${facts.sample}</td></tr>
        <tr><th>Digital proof timing</th><td>${facts.proof}</td></tr>
        <tr><th>Typical production timing</th><td>${facts.production}</td></tr>
        <tr><th>Common backings</th><td>${product.backings.join(', ')}</td></tr>
        <tr><th>Common borders</th><td>${product.borders.join(', ')}</td></tr>
        <tr><th>Best applications</th><td>${product.bestFor.join(', ')}</td></tr>
        <tr><th>Shipping options</th><td>${facts.shipping}</td></tr>
        <tr><th>Payment method</th><td>PayPal</td></tr>
      </tbody>
    </table></div>
  </div></section>`;
}

function buyerChecklist() {
  const items = ['Artwork or logo', 'Patch type', 'Finished size', 'Quantity', 'Number of colors', 'Backing', 'Border', 'Shipping country', 'Deadline or delivery requirement'];
  return `<div class="check-card"><h2>Buyer Information Checklist</h2><p>For a clearer quotation, include these details when you contact Heypal Patch.</p><ul class="check-list">${items.map((item) => `<li>${item}</li>`).join('')}</ul></div>`;
}

function faqBlock(items = faqItems.slice(0, 5)) {
  return `<section class="section faq-section"><div class="wrap faq-grid"><div class="faq-intro"><p class="eyebrow">FAQ</p><h2>Common Buyer Questions</h2><p>Answers below use only confirmed Heypal Patch order information: standard MOQ, paid samples, proof approval, PayPal payment, shipment photos and international shipping coordination from China.</p><ul class="mini-facts"><li>50-piece MOQ for embroidered patches</li><li>100-piece MOQ for most other patch types</li><li>Digital proof before bulk production</li><li>PayPal payment for confirmed orders</li></ul></div><div class="faq-list">${items.map(([question, answer], index) => `<details${index === 0 ? ' open' : ''}><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('')}</div></div></section>`;
}

function related(slugs) {
  const cards = slugs.map((slug) => {
    const product = products.find((item) => item.slug === slug);
    const intent = intentPages.find(([itemSlug]) => itemSlug === slug);
    const guide = guidePages.find(([itemSlug]) => itemSlug === slug);
    const title = product?.name || intent?.[1] || guide?.[1] || slug.replaceAll('-', ' ');
    const text = product?.short || intent?.[2] || guide?.[2] || 'Related custom patch information for buyers.';
    return `<article class="card"><h3><a href="/${slug}">${esc(title)}</a></h3><p>${esc(text)}</p></article>`;
  }).join('');
  return `<section class="section band"><div class="wrap"><p class="eyebrow">Related guides</p><h2>Useful Next Steps</h2><div class="card-grid">${cards}<article class="card"><h3><a href="/get-a-quote">Request a Custom Patch Quote</a></h3><p>Send artwork, quantity, size and shipping country so Heypal Patch can review the project details.</p></article></div></div></section>`;
}

function quoteCta() {
  return `<section class="final-cta"><div class="wrap"><h2>Ready to Coordinate Your Custom Patch Order?</h2><p>Send your artwork, size, quantity, preferred patch type and shipping country. Heypal Patch will review the details and prepare a quotation based on confirmed requirements.</p><div class="actions"><a class="button primary" href="/get-a-quote">Request a Quote</a><a class="button light" href="${site.whatsapp}?text=${encodeURIComponent(site.whatsappText)}">Chat on WhatsApp</a></div></div></section>`;
}

function asSentenceList(items) {
  return items.map((item) => esc(item)).join(', ');
}

function intentSections(slug, direct) {
  const common = [
    ['Order Details to Confirm', 'For a useful quotation, send artwork, finished size, quantity, preferred backing, border style, shipping country and any deadline or application requirement.'],
    ['Proof and Production Control', 'A digital proof is prepared after the project details are confirmed. Bulk production is arranged only after the customer reviews and approves the proof.'],
    ['Shipping and Tracking', facts.photos]
  ];
  const details = {
    'custom-iron-on-patches': [
      ['Best Fit', 'Iron-on backing is convenient for suitable fabrics when buyers want heat application instead of hand sewing. Sew-on attachment may still be better for heavy wear, thick materials or frequent washing.'],
      ['Material Notes', 'The patch material, garment fabric and heat tolerance should be checked before choosing iron-on backing. Application results depend on heat, pressure, time and the garment surface.']
    ],
    'custom-velcro-patches': [
      ['Best Fit', 'Hook-and-loop patches are practical for removable use on uniforms, bags, morale panels and gear where patches may need to be changed or repositioned.'],
      ['Material Notes', 'Confirm whether the order needs only the hook side or both hook and loop sides. PVC, embroidered and woven patches may all be considered depending on artwork and use.']
    ],
    'custom-sew-on-patches': [
      ['Best Fit', 'Sew-on backing is a durable option for jackets, uniforms, hats and bags, especially when the patch will face regular wear or washing.'],
      ['Material Notes', 'Sew-on patches can work with many patch types. Final edge, backing and thickness should be reviewed together with the garment material.']
    ],
    'custom-logo-patches': [
      ['Best Fit', 'Logo patches work best when the artwork has clear shapes, readable lettering and a material choice matched to the brand style and placement.'],
      ['Material Notes', 'Embroidery suits classic texture, woven suits small detail, PVC suits bold gear labels, leather suits simple marks and printed patches suit full-color artwork.']
    ],
    'custom-name-patches': [
      ['Best Fit', 'Name patches need readable lettering, consistent sizing and enough contrast between the text and background. They are common for uniforms, teams and workwear.'],
      ['Material Notes', 'Embroidery can work for bold names, while woven patches may be better for smaller lettering or longer names. Final size should be checked before proof preparation.']
    ],
    'custom-patches-for-jackets': [
      ['Best Fit', 'Jacket patches can be small brand labels, sleeve patches or larger back patches. Attachment strength and finished size are especially important for this use case.'],
      ['Material Notes', 'Chenille, embroidery, woven and leather patches may all work for jackets. Sew-on backing is often considered for long-term wear.']
    ],
    'custom-patches-for-hats': [
      ['Best Fit', 'Hat patches usually need compact artwork that remains readable on a curved or limited placement area such as a front panel, side panel or beanie cuff.'],
      ['Material Notes', 'Embroidered, woven, leather and PVC patches can be considered for hats. Simple shapes and clear text usually produce cleaner results.']
    ],
    'custom-patches-for-uniforms': [
      ['Best Fit', 'Uniform patches usually require consistent sizing, readable identifiers and a backing that matches how the garment will be worn and maintained.'],
      ['Material Notes', 'Embroidered and woven patches are common for uniforms. Hook-and-loop backing can be useful when removable patches are needed.']
    ],
    'custom-patches-for-backpacks': [
      ['Best Fit', 'Backpack patches should be planned around abrasion, bag fabric and whether the patch is permanent or removable. Outdoor and retail bag use cases may need different materials.'],
      ['Material Notes', 'PVC can work well for rugged styles, while embroidered, woven or leather patches may better suit brand labels and merchandise.']
    ]
  };
  return [...(details[slug] || [['Best Fit', direct], ['Material Notes', 'The right specification depends on artwork detail, finished size, patch type, backing, border and intended application.']]), ...common];
}

function guideSections(slug, direct) {
  const specific = {
    'embroidered-vs-woven-patches': [
      ['Main Difference', direct],
      ['Choose Embroidered When', 'Use embroidery when the buyer wants raised thread texture, a classic patch feel and artwork built from bold shapes or readable lettering.'],
      ['Choose Woven When', 'Use woven patches when the artwork has smaller text, thin lines or label-style detail that needs a flatter surface.']
    ],
    'pvc-vs-embroidered-patches': [
      ['Main Difference', direct],
      ['Choose PVC When', 'PVC is useful for bold molded shapes, gear patches, removable hook-and-loop systems and styles that need a rubber-like surface.'],
      ['Choose Embroidery When', 'Embroidery is useful for classic fabric patches, uniforms, hats and merchandise where raised thread texture is part of the desired look.']
    ],
    'iron-on-vs-sew-on-patches': [
      ['Main Difference', direct],
      ['Choose Iron-On When', 'Iron-on backing may be convenient for suitable fabrics and lower-wear applications where heat application is acceptable.'],
      ['Choose Sew-On When', 'Sew-on backing is usually the stronger choice for jackets, bags, uniforms and items that may face washing or regular abrasion.']
    ],
    'merrowed-border-vs-heat-cut-border': [
      ['Main Difference', direct],
      ['Choose Merrowed Border When', 'A merrowed border suits simple shapes such as circles, rectangles and shields where a raised stitched edge is desired.'],
      ['Choose Heat-Cut Border When', 'A heat-cut edge is useful for custom outlines, detailed shapes and artwork that should follow a less standard silhouette.']
    ]
  };
  return [
    ...(specific[slug] || [['Main Consideration', direct], ['How to Choose', 'Start with artwork detail, expected texture, finished size, backing, garment type and delivery requirement.']]),
    ['Cost Factors', 'Final pricing depends on patch type, finished size, quantity, colors, design complexity, backing, border, sample requirements and shipping destination. Fixed price claims are not used.'],
    ['Approval Step', 'The customer reviews the digital proof before bulk production is arranged, so shape, size, colors, text, border and backing can be confirmed.']
  ];
}

function utilitySections(slug, direct) {
  const specific = {
    gallery: [
      ['How to Use the Gallery', direct],
      ['What to Compare', 'Look at texture, edge thickness, color separation, surface finish and how readable the artwork remains at the intended size.']
    ],
    blog: [
      ['Buyer Guide Focus', direct],
      ['Useful Starting Points', 'Start with material choice, size planning, file preparation, backing options, MOQ, proof approval and shipping requirements.']
    ],
    'patch-backing-options': [
      ['Backing Choice', direct],
      ['Common Options', 'Sew-on, iron-on, hook-and-loop, adhesive and no-backing options may be considered depending on patch type and intended use.']
    ],
    'patch-border-options': [
      ['Border Choice', direct],
      ['Common Options', 'Merrowed, heat-cut, laser-cut, molded and stitched edges may be considered depending on shape, material and artwork.']
    ],
    'custom-patch-size-guide': [
      ['Size Planning', direct],
      ['Readability Check', 'Small patches need simpler artwork and larger lettering. Larger patches allow more detail but may require stronger attachment planning.']
    ],
    'custom-patch-backing-options-guide': [
      ['Backing Planning', direct],
      ['Application Check', 'Confirm fabric type, wash expectations, removability and whether the patch will be used on apparel, bags, packaging or display items.']
    ],
    'self-adhesive-vs-sew-on-patches': [
      ['Main Difference', direct],
      ['Use Case Check', 'Self-adhesive backing is generally for temporary or low-wear use, while sew-on backing is the practical option for durable garment attachment.']
    ],
    'custom-patches-for-business': [
      ['Business Use Cases', direct],
      ['Consistency Check', 'Business orders should confirm logo files, color references, repeated sizing, quantity, backing and shipping requirements before quotation.']
    ],
    'custom-motorcycle-patches': [
      ['Motorcycle Patch Planning', direct],
      ['Durability Check', 'Jacket and gear patches often benefit from durable sew-on attachment, readable design and an edge style that suits the patch shape.']
    ]
  };
  return [
    ...(specific[slug] || [['Planning Notes', direct], ['Specification Check', 'Confirm artwork, size, quantity, backing, border, shipping country and delivery requirement.']]),
    ['Proof Approval', 'The customer reviews and approves the digital proof before bulk production is arranged.'],
    ['Shipping and Tracking', facts.photos]
  ];
}

function productBody(product) {
  const page = { ...product, h1: product.name, imageAlt: `${product.name} material reference` };
  const faqs = [
    ['What is the MOQ for this patch type?', product.slug === 'custom-embroidered-patches' ? 'The standard MOQ for embroidered patches is 50 pieces. Final requirements may still depend on design, size and production requirements.' : 'The standard MOQ for this patch type is 100 pieces. Final requirements may still depend on design, size and production requirements.'],
    ['Can I approve the design first?', 'Yes. The customer reviews and approves the digital proof before bulk production is arranged.'],
    ['Are samples available?', 'Yes. Physical samples are available with a sample fee. The fee depends on artwork, size, colors, material and production requirements.'],
    ['How long does production usually take?', facts.production],
    ['Which shipping services can be used?', facts.shipping]
  ];
  return `${hero(page)}
${quickFacts(product)}
<section class="section"><div class="wrap two-col align-start">
  <div class="content-flow">
    <h2>Material Fit</h2><p>${esc(product.direct)}</p>
    <h2>Artwork Strengths</h2><p>${esc(product.detail)}</p>
    <h2>Surface Feel</h2><p>${esc(product.texture)}</p>
    <h2>Design Watchouts</h2><p>This option is not ideal for ${asSentenceList(product.notIdeal).toLowerCase()}. Send the final artwork and size so readability and production requirements can be checked before quotation.</p>
    <h2>Backing Choices</h2><ul>${product.backings.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2>Border Choices</h2><ul>${product.borders.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2>Common Applications</h2><ul>${product.bestFor.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
  </div>
  <aside class="side-stack">
    <div class="check-card"><h2>Best For</h2><ul class="check-list">${product.bestFor.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></div>
    <div class="check-card"><h2>Not Ideal For</h2><ul class="check-list">${product.notIdeal.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></div>
    ${buyerChecklist()}
  </aside>
</div></section>
<section class="section band"><div class="wrap"><p class="eyebrow">Order information</p><h2>MOQ, Samples, Proofs and Timing</h2><div class="card-grid"><article class="card"><h3>Standard MOQ</h3><p>The standard minimum order quantity is ${product.slug === 'custom-embroidered-patches' ? facts.embroideredMoq : facts.otherMoq}. Final MOQ may still depend on design, size, material and production requirements.</p></article><article class="card"><h3>Physical Samples</h3><p>${facts.sample} The fee depends on artwork, finished size, number of colors, material, backing and border requirements.</p></article><article class="card"><h3>Proof and Production</h3><p>A digital proof is usually prepared within approximately 3-4 days after details are confirmed. Bulk production usually takes approximately 8-10 days after customer approval.</p></article></div></div></section>
<section class="section"><div class="wrap"><p class="eyebrow">Comparison</p><h2>Comparison With Alternatives</h2>${comparisonTable(product)}</div></section>
${faqBlock(faqs)}
${related(product.compare)}
${quoteCta()}`;
}

function comparisonTable(product) {
  const rows = [
    ['Texture', product.texture, 'Choose based on desired surface feel.'],
    ['Detail', product.detail, 'Fine detail may need woven or printed methods.'],
    ['Durability', 'Depends on material, backing and intended application.', 'High-wear items often benefit from sew-on attachment.'],
    ['Small text', product.slug.includes('woven') || product.slug.includes('printed') ? 'Usually stronger than raised embroidery.' : 'Needs artwork review for readability.', 'Send final size for checking.'],
    ['Gradients', product.slug.includes('printed') ? 'Suitable for many gradient designs.' : 'Usually better as printed artwork.', 'Avoid assuming stitch methods can reproduce photos.'],
    ['Removable backing', product.backings.includes('Hook and loop') ? 'Available for this patch type.' : 'May be available depending on patch type.', 'Confirm intended use before quotation.'],
    ['Typical use', product.bestFor.join(', '), 'Final recommendation depends on artwork and garment.'],
    ['MOQ', product.slug === 'custom-embroidered-patches' ? facts.embroideredMoq : facts.otherMoq, 'Final MOQ may depend on requirements.']
  ];
  return `<div class="table-wrap"><table><thead><tr><th>Factor</th><th>${esc(product.name)}</th><th>Buyer note</th></tr></thead><tbody>${rows.map((row) => `<tr><th>${esc(row[0])}</th><td>${esc(row[1])}</td><td>${esc(row[2])}</td></tr>`).join('')}</tbody></table></div>`;
}

function standardPage(slug, h1, title, description, direct, sections, links, image = '/assets/patch-materials-closeup.webp') {
  register({
    slug,
    title,
    description,
    h1,
    direct,
    image,
    imageAlt: h1,
    faqs: faqItems.slice(0, 5),
    schemaType: 'Service',
    body: `${hero({ slug, h1, title, description, direct, image, imageAlt: h1 })}
<section class="section"><div class="wrap two-col align-start">
  <div class="content-flow">${sections.map(([heading, text]) => `<h2>${esc(heading)}</h2><p>${esc(text)}</p>`).join('')}</div>
  <aside class="side-stack">${buyerChecklist()}<div class="check-card"><h2>Order Notes</h2><ul class="check-list"><li>PayPal payment for confirmed orders</li><li>Digital proof before bulk production</li><li>Shipment photos and tracking where available</li></ul></div></aside>
</div></section>
${faqBlock(faqItems.slice(0, 5))}
${related(links)}
${quoteCta()}`
  });
}

function quoteForm() {
  return `<form class="quote-form" id="quoteForm" action="/api/quote" method="post" enctype="multipart/form-data" novalidate>
  <div class="hp-field" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
  <label>Name<input name="name" autocomplete="name" required></label>
  <label>Contact Method<input name="email" autocomplete="email" required></label>
  <label>Company<input name="company" autocomplete="organization"></label>
  <label>Shipping Country<input name="country" autocomplete="country-name"></label>
  <label>Patch Type<select name="patchType"><option value="">Not sure yet</option>${patchTypes.map(([, name]) => `<option>${esc(name.replace('Custom ', ''))}</option>`).join('')}</select></label>
  <label>Finished Size<input name="size" placeholder="3 in / 7.5 cm"></label>
  <label>Quantity<input name="quantity" inputmode="numeric" required placeholder="100 pieces"></label>
  <label>Deadline<input name="neededDate" type="text" inputmode="numeric" placeholder="YYYY-MM-DD"></label>
  <label class="form-wide">Message<textarea name="message" rows="5" required placeholder="Tell us about artwork, patch type, size, backing, border, shipping country and delivery requirement."></textarea></label>
  <p class="form-wide field-help">Static upload is supported by the quote API. Additional artwork files can be shared after submitting the request.</p>
  <label class="form-wide">Artwork File<span class="file-upload"><input id="artworkInput" class="file-upload-native" name="artwork" type="file" accept=".jpg,.jpeg,.png,.pdf,.ai,.svg,.eps,image/jpeg,image/png,application/pdf,image/svg+xml"><span class="file-upload-button">Choose Artwork</span><span class="file-upload-name" data-file-name>No file selected</span></span></label>
  <button class="button primary form-wide" type="submit">Submit Quote Request</button>
  <p class="form-status form-wide" role="status" aria-live="polite"></p>
</form>`;
}

function buildCorePages() {
  register({
    slug: 'index',
    title: 'Custom Patches for Brands, Teams and Merchandise | Heypal Patch',
    description: 'Order custom embroidered, woven, PVC, chenille, leather and printed patches with digital proof approval, flexible customization and international shipping support from China.',
    h1: 'Custom Patches, Coordinated From Artwork to Delivery.',
    direct: 'Heypal Patch helps brands, teams, clubs and merchandise buyers order custom patches from China. Send your artwork and requirements to receive a quotation, review a digital proof and confirm the design before bulk production is arranged.',
    image: '/assets/custom-patches-hero.webp',
    imageAlt: 'Custom patches for brands teams and merchandise',
    faqs: faqItems.slice(0, 6),
    body: `${hero({ h1: 'Custom Patches, Coordinated From Artwork to Delivery.', title: '', description: '', direct: 'Heypal Patch helps brands, teams, clubs and merchandise buyers order custom patches from China. Send your artwork and requirements to receive a quotation, review a digital proof and confirm the design before bulk production is arranged.', image: '/assets/custom-patches-hero.webp', imageAlt: 'Custom patches for brands teams and merchandise', imageCaption: 'Patch material and backing reference', heroClass: 'hero-media-wide' })}
<section class="trust-strip"><div class="wrap trust-grid"><span>Embroidered Patch MOQ From 50 Pieces</span><span>Digital Proof Before Bulk Production</span><span>Physical Samples Available</span><span>PayPal Payment Supported</span><span>Shipment Photos and Tracking Provided</span></div></section>
<section class="section"><div class="wrap"><p class="eyebrow">Patch Types</p><h2>Compare Materials Before You Quote</h2><div class="product-grid">${products.map((product) => `<article class="product-card"><img src="${product.image}" width="640" height="640" loading="lazy" decoding="async" alt="${esc(product.name)} material reference"><h3><a href="/${product.slug}">${esc(product.name)}</a></h3><p>${esc(product.short)}</p></article>`).join('')}</div></div></section>
<section class="section band"><div class="wrap"><p class="eyebrow">How the order process works</p><h2>Clear Approval Steps Before Production</h2><div class="step-grid">${orderSteps.slice(0, 6).map(([step, text], index) => `<article class="step"><span>${index + 1}</span><h3>${esc(step)}</h3><p>${esc(text)}</p></article>`).join('')}</div></div></section>
<section class="section"><div class="wrap"><p class="eyebrow">Standard MOQ</p><h2>MOQ, Samples and Timing</h2><div class="card-grid"><article class="card"><h3>Minimum Order Quantity</h3><p>The standard minimum order quantity is 50 pieces for embroidered patches and 100 pieces for most other patch types. Final MOQ may still depend on the design, size, material and production requirements.</p></article><article class="card"><h3>Physical Samples</h3><p>Physical samples are available with a sample fee. The fee depends on artwork, finished size, number of colors, material, backing and border requirements.</p></article><article class="card"><h3>Proof and Production Timing</h3><p>A digital proof is usually prepared within approximately 3-4 days after details are confirmed. Bulk production usually takes approximately 8-10 days after customer approval.</p></article></div></div></section>
<section class="section band"><div class="wrap"><p class="eyebrow">Material comparison</p><h2>Start With Texture, Detail and Application</h2><p class="section-lead">The best patch type depends on artwork detail, expected surface feel, backing, border and how the patch will be used. This comparison is a starting point before Heypal Patch reviews the actual artwork and order requirements.</p>${comparisonTable(products[0])}</div></section>
<section class="section band"><div class="wrap"><p class="eyebrow">Popular applications</p><h2>Built Around Buyer Use Cases</h2><div class="card-grid">${intentPages.slice(5, 9).map(([slug, name, desc]) => `<article class="card"><h3><a href="/${slug}">${esc(name)}</a></h3><p>${esc(desc)}</p></article>`).join('')}</div></div></section>
<section class="section"><div class="wrap two-col align-start"><div><p class="eyebrow">Shipping options</p><h2>International Shipping Coordination</h2><p>${facts.shipping} The final method depends on destination, package weight, delivery requirement and available service.</p></div>${buyerChecklist()}</div></section>
${faqBlock(faqItems.slice(0, 6))}
${related(['patch-types', 'samples-and-moq', 'shipping-and-payment'])}
${quoteCta()}`
  });

  standardPage('about', 'Custom Patch Order Support From China', 'About Heypal Patch | Custom Patch Order Support From China', 'Learn how Heypal Patch supports international custom patch buyers with quotations, proof coordination, production arrangement and shipment tracking from China.', 'Heypal Patch is a China-based custom patch supplier and project coordination service. We help international buyers request quotations, confirm patch specifications, review digital proofs, arrange production and receive shipment photos and tracking information.', [
    ['What Heypal Patch Provides', 'Heypal Patch provides custom patch quotation support, patch material comparison, digital proof coordination, production arrangement after approval and international shipping support.'],
    ['Who We Support', 'We support brands, teams, clubs, uniform buyers, event organizers and merchandise buyers that need custom patch orders coordinated from artwork to delivery.'],
    ['How Inquiries Are Reviewed', 'Buyer information is reviewed around artwork, size, quantity, patch type, backing, border, shipping country and delivery requirement before a quotation is prepared.'],
    ['How Shipment Information Is Shared', 'Before dispatch, finished product or shipment photos are provided where available, and tracking information is provided after shipping.']
  ], ['custom-patch-order-process', 'patch-types', 'contact']);

  standardPage('samples-and-moq', 'Samples and MOQ for Custom Patches', 'Samples and MOQ for Custom Patches | Heypal Patch', 'Review standard custom patch MOQ, paid sample availability, proof timing and order details needed before quotation.', 'The standard minimum order quantity is 50 pieces for embroidered patches and 100 pieces for most other patch types. Physical samples are available with a sample fee, and the final sample cost depends on design, size, colors, material and production requirements.', [
    ['Standard MOQ', 'Embroidered patches usually start from 50 pieces. Most other patch types usually start from 100 pieces. Final requirements may depend on design, size, material and production requirements.'],
    ['Physical Samples', 'Physical samples are available with a sample fee. The fee depends on artwork, finished size, number of colors, material, backing and border requirements.'],
    ['Digital Proof Timing', 'A digital proof is usually prepared within approximately 3-4 days after order details and artwork requirements are confirmed.'],
    ['What Affects Final Requirements', 'Patch type, finished size, quantity, design complexity, backing, border, sample requirements and shipping destination can all affect quotation and timing.']
  ], ['custom-embroidered-patches', 'how-much-do-custom-patches-cost', 'get-a-quote']);

  standardPage('shipping-and-payment', 'Shipping and Payment for Custom Patch Orders', 'Shipping and Payment for Custom Patch Orders | Heypal Patch', 'Learn how Heypal Patch coordinates shipping through 4PX, DHL, FedEx or UPS and supports PayPal payment for confirmed orders.', 'Shipping can generally be arranged through small-parcel logistics services such as 4PX or international express couriers including DHL, FedEx and UPS. The final shipping method depends on destination, package weight, delivery requirement and available service. PayPal payment is available for confirmed orders.', [
    ['Shipping Options', facts.shipping],
    ['How Shipping Is Chosen', 'The final shipping method depends on destination, package weight, delivery requirement and available service. Fixed transit times, fixed freight costs and duty-free delivery are not promised.'],
    ['Payment Method', 'PayPal payment is available for confirmed orders. PayPal account details are not published on the website.'],
    ['Photos and Tracking', facts.photos]
  ], ['samples-and-moq', 'custom-patch-order-process', 'contact']);

  register({
    slug: 'custom-patch-order-process',
    title: 'Custom Patch Order Process | Heypal Patch',
    description: 'Follow the custom patch order process from inquiry and quotation to digital proof approval, production arrangement, shipment photos and tracking.',
    h1: 'Custom Patch Order Process',
    direct: 'Heypal Patch coordinates custom patch orders through a clear process: inquiry, quotation, PayPal payment for confirmed orders, digital proof preparation, customer approval, production arrangement, shipment confirmation and delivery tracking. Bulk production is arranged only after the customer approves the digital proof.',
    image: '/assets/patch-production-process.webp',
    imageAlt: 'Custom patch order process from proof review to shipment',
    faqs: faqItems.slice(0, 6),
    schemaType: 'Service',
    body: `${hero({ h1: 'Custom Patch Order Process', direct: 'Heypal Patch coordinates custom patch orders through a clear process: inquiry, quotation, PayPal payment for confirmed orders, digital proof preparation, customer approval, production arrangement, shipment confirmation and delivery tracking. Bulk production is arranged only after the customer approves the digital proof.', image: '/assets/patch-production-process.webp', imageAlt: 'Custom patch order process from proof review to shipment' })}
<section class="section"><div class="wrap"><div class="step-grid">${orderSteps.map(([step, text], index) => `<article class="step"><span>${index + 1}</span><h2>${esc(step)}</h2><p>${esc(text)}</p></article>`).join('')}</div></div></section>
${related(['samples-and-moq', 'shipping-and-payment', 'get-a-quote'])}
${quoteCta()}`
  });

  register({
    slug: 'patch-types',
    title: 'Custom Patch Types and Material Comparison | Heypal Patch',
    description: 'Compare embroidered, woven, PVC, chenille, leather, printed, iron-on, sew-on and hook-and-loop custom patch options.',
    h1: 'Custom Patch Types',
    direct: 'Different patch types require different materials and production methods. Heypal Patch coordinates suitable production resources according to the artwork, quantity, size and intended application, then provides a digital proof for customer approval before bulk production is arranged.',
    image: '/assets/patch-materials-closeup.webp',
    imageAlt: 'Custom patch material comparison',
    faqs: faqItems.slice(0, 5),
    schemaType: 'Service',
    body: `${hero({ h1: 'Custom Patch Types', direct: 'Different patch types require different materials and production methods. Heypal Patch coordinates suitable production resources according to the artwork, quantity, size and intended application, then provides a digital proof for customer approval before bulk production is arranged.', image: '/assets/patch-materials-closeup.webp', imageAlt: 'Custom patch material comparison' })}
<section class="section"><div class="wrap"><p class="eyebrow">Material hub</p><h2>Choose by Detail, Texture and Application</h2><div class="product-grid">${products.map((product) => `<article class="product-card"><img src="${product.image}" width="640" height="640" loading="lazy" decoding="async" alt="${esc(product.name)} material reference"><h3><a href="/${product.slug}">${esc(product.name)}</a></h3><p>${esc(product.short)}</p></article>`).join('')}</div></div></section>
<section class="section band"><div class="wrap"><h2>Backing and Application Pages</h2><div class="card-grid">${intentPages.map(([slug, name, desc]) => `<article class="card"><h3><a href="/${slug}">${esc(name)}</a></h3><p>${esc(desc)}</p></article>`).join('')}</div></div></section>
${faqBlock(faqItems.slice(0, 5))}
${related(['custom-patch-order-process', 'samples-and-moq', 'get-a-quote'])}
${quoteCta()}`
  });

  register({
    slug: 'contact',
    title: 'Contact Heypal Patch | Custom Patch Quotes',
    description: 'Contact Heypal Patch for custom patch quotations, artwork review and international order coordination.',
    h1: 'Contact Heypal Patch',
    direct: 'Send your artwork, required quantity, finished size, preferred patch type and shipping country. We will review the project information and prepare a quotation based on the confirmed requirements.',
    image: '/assets/patch-use-cases.webp',
    imageAlt: 'Custom patch inquiry support',
    faqs: faqItems.slice(0, 4),
    body: `${hero({ h1: 'Contact Heypal Patch', direct: 'Send your artwork, required quantity, finished size, preferred patch type and shipping country. We will review the project information and prepare a quotation based on the confirmed requirements.', image: '/assets/patch-use-cases.webp', imageAlt: 'Custom patch inquiry support' })}
<section class="section"><div class="wrap quote-page-grid">${buyerChecklist()}${quoteForm()}</div></section>
${related(['samples-and-moq', 'shipping-and-payment', 'custom-patch-order-process'])}`
  });

  register({
    slug: 'get-a-quote',
    title: 'Request a Custom Patch Quote | Heypal Patch',
    description: 'Request a custom patch quotation by sending artwork, quantity, size, patch type and shipping country to Heypal Patch.',
    h1: 'Request a Custom Patch Quote',
    direct: 'Share the basic project details so Heypal Patch can review the artwork, compare suitable patch materials and prepare a quotation based on confirmed requirements. Required details are name, email or WhatsApp, quantity and message. Artwork can be sent through the form, email or WhatsApp.',
    image: '/assets/patch-materials-closeup.webp',
    imageAlt: 'Custom patch quote request',
    faqs: faqItems.slice(0, 5),
    body: `${hero({ h1: 'Request a Custom Patch Quote', direct: 'Share the basic project details so Heypal Patch can review the artwork, compare suitable patch materials and prepare a quotation based on confirmed requirements. Required details are name, email or WhatsApp, quantity and message. Artwork can be sent through the form, email or WhatsApp.', image: '/assets/patch-materials-closeup.webp', imageAlt: 'Custom patch quote request' })}
<section class="section"><div class="wrap two-col align-start">${buyerChecklist()}${quoteForm()}</div></section>
${faqBlock(faqItems.slice(0, 5))}
${related(['patch-types', 'samples-and-moq', 'shipping-and-payment'])}`
  });

  register({
    slug: 'faq',
    title: 'Custom Patch FAQ | MOQ, Samples, Proofs and Shipping',
    description: 'Answers about custom patch MOQ, physical samples, digital proof timing, production timing, PayPal payment and shipping options.',
    h1: 'Custom Patch FAQ',
    direct: 'These answers summarize the confirmed Heypal Patch order information: MOQ starts from 50 embroidered patches or 100 pieces for most other patch types, samples are paid, proofs are usually prepared in approximately 3-4 days, and PayPal payment is available for confirmed orders.',
    image: '/assets/patch-embroidered.webp',
    imageAlt: 'Custom patch FAQ',
    faqs: faqItems,
    body: `${hero({ h1: 'Custom Patch FAQ', direct: 'These answers summarize the confirmed Heypal Patch order information: MOQ starts from 50 embroidered patches or 100 pieces for most other patch types, samples are paid, proofs are usually prepared in approximately 3-4 days, and PayPal payment is available for confirmed orders.', image: '/assets/patch-embroidered.webp', imageAlt: 'Custom patch FAQ' }, false)}
${faqBlock(faqItems)}
${related(['samples-and-moq', 'shipping-and-payment', 'contact'])}
${quoteCta()}`
  });

  register({
    slug: '404',
    title: 'Page Not Found | Heypal Patch',
    description: 'The requested page could not be found. Continue to Heypal Patch patch types, FAQ, contact or quote pages.',
    h1: 'Page Not Found',
    direct: 'The page you requested may have moved or the URL may be incorrect. Use the links below to continue to custom patch types, FAQ, contact information or the quote form.',
    image: '/assets/patch-embroidered.webp',
    imageAlt: 'Heypal Patch page not found',
    noindex: true,
    body: `${hero({ h1: 'Page Not Found', direct: 'The page you requested may have moved or the URL may be incorrect. Use the links below to continue to custom patch types, FAQ, contact information or the quote form.', image: '/assets/patch-embroidered.webp', imageAlt: 'Heypal Patch page not found' }, false)}
<section class="section"><div class="wrap card-grid"><article class="card"><h2><a href="/">Home</a></h2><p>Return to the Heypal Patch homepage.</p></article><article class="card"><h2><a href="/patch-types">Patch Types</a></h2><p>Compare embroidered, woven, PVC, chenille, leather and printed patches.</p></article><article class="card"><h2><a href="/faq">FAQ</a></h2><p>Review MOQ, samples, proof timing, shipping and payment answers.</p></article><article class="card"><h2><a href="/contact">Contact</a></h2><p>Use the quote form to send project details.</p></article><article class="card"><h2><a href="/get-a-quote">Get a Quote</a></h2><p>Send a custom patch inquiry.</p></article></div></section>`
  });
}

function buildProducts() {
  products.forEach((product) => register({ ...product, h1: product.name, faqs: faqItems.slice(0, 5), schemaType: 'Product', imageAlt: `${product.name} material reference`, body: productBody(product) }));
}

function buildIntentPages() {
  intentPages.forEach(([slug, h1, description, direct, img, links]) => {
    standardPage(slug, h1, `${h1} | Heypal Patch`, description, direct, intentSections(slug, direct), links, imagePath(img));
  });
}

function buildGuidePages() {
  guidePages.forEach(([slug, h1, description, direct, links]) => {
    standardPage(slug, h1, `${h1} | Heypal Patch`, description, direct, guideSections(slug, direct), links, '/assets/patch-materials-closeup.webp');
  });
}

function buildUtilityPages() {
  const utility = [
    ['gallery', 'Custom Patch Gallery', 'View custom patch material references for embroidered, woven, PVC, chenille, leather and printed patches.', 'Use the gallery to compare texture, color separation, edge thickness and typical applications before requesting a quotation. Final patch details follow the approved digital proof and the confirmed order requirements.', ['patch-types', 'custom-patch-order-process', 'get-a-quote']],
    ['blog', 'Custom Patch Buyer Guides', 'Read practical custom patch buyer guides about materials, backing options, artwork preparation, MOQ and shipping.', 'The Heypal Patch guide section helps buyers prepare artwork, compare materials and understand order steps without relying on fixed price claims or unverified business information.', ['how-to-design-a-custom-patch', 'custom-patch-file-formats', 'patch-care-guide']],
    ['patch-backing-options', 'Patch Backing Options', 'Compare sew-on, iron-on, hook-and-loop, adhesive and no-backing options for custom patches.', 'Patch backing affects how a patch attaches to a garment, bag or display item. The right choice depends on fabric, wear, washing, removability and the selected patch type.', ['custom-iron-on-patches', 'custom-sew-on-patches', 'custom-velcro-patches']],
    ['patch-border-options', 'Patch Border Options', 'Compare merrowed, heat-cut, laser-cut and molded patch borders for different shapes and materials.', 'Patch borders affect edge thickness, shape precision and visual style. Simple shapes may use merrowed borders, while custom outlines often need heat-cut or laser-cut edges.', ['merrowed-border-vs-heat-cut-border', 'custom-embroidered-patches', 'custom-woven-patches']],
    ['custom-patch-size-guide', 'Custom Patch Size Guide', 'Plan practical custom patch sizes for hats, jackets, uniforms, bags and merchandise.', 'Patch size affects readability, detail, texture and placement. Buyers should confirm finished size together with artwork, backing, border and intended application before quotation.', ['custom-patches-for-hats', 'custom-patches-for-jackets', 'custom-patches-for-uniforms']],
    ['custom-patch-backing-options-guide', 'Custom Patch Backing Options Guide', 'Review backing choices for custom patches and when to consider sew-on, iron-on or hook-and-loop attachment.', 'Backing should be selected around the garment, expected wear and whether the patch needs to be removable. Heypal Patch can review application details before recommending options.', ['patch-backing-options', 'iron-on-vs-sew-on-patches', 'custom-velcro-patches']],
    ['self-adhesive-vs-sew-on-patches', 'Self-Adhesive vs Sew-On Patches', 'Compare temporary adhesive backing and durable sew-on backing for custom patch applications.', 'Self-adhesive patches are usually better for temporary use, packaging or display applications. Sew-on backing is often better for garments, bags and high-wear items.', ['custom-sew-on-patches', 'patch-backing-options', 'patch-care-guide']],
    ['custom-patches-for-business', 'Custom Patches for Business', 'Coordinate custom business patches for uniforms, merch, events and branded packaging.', 'Business patch orders usually need consistent artwork, clear size requirements and a material that fits the use case. Heypal Patch coordinates quotation, proof approval and shipping support.', ['custom-logo-patches', 'custom-patches-for-uniforms', 'get-a-quote']],
    ['custom-motorcycle-patches', 'Custom Motorcycle Patches', 'Plan custom motorcycle patches for jackets, clubs and gear with durable backing and border guidance.', 'Motorcycle patches often need durable attachment, readable design and a size suitable for jackets or gear. Sew-on embroidered or chenille styles may be considered based on artwork.', ['custom-patches-for-jackets', 'custom-sew-on-patches', 'custom-embroidered-patches']]
  ];
  utility.forEach(([slug, h1, description, direct, links]) => standardPage(slug, h1, `${h1} | Heypal Patch`, description, direct, utilitySections(slug, direct), links));
}

buildCorePages();
buildProducts();
buildIntentPages();
buildGuidePages();
buildUtilityPages();
