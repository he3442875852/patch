# SEO, AEO and GEO Audit

Date: 2026-07-30

## Scope

The site was rebuilt as a static HTML, CSS and JavaScript website for `https://www.heypalpatch.com` with clean canonical URLs, expanded content architecture, structured data, internal links and lightweight audit tooling.

## Business Identity Accuracy

- Removed or avoided factory-positioning language such as "custom patch manufacturer", "factory direct", "our factory", "in-house production", "production line", "factory capacity" and similar claims from public page content.
- Repositioned Heypal Patch as a China-based custom patch supplier, sourcing partner and project coordination service.
- Did not publish registered company name, detailed street address, factory address, business license, founder, employee count, factory area, equipment, certifications, awards, ratings or reviews.
- Unified confirmed business information: Email `heypal01@163.com`, WhatsApp `+86 183 9080 0841`, Location `China`, embroidered MOQ `50 pieces`, most other patch types MOQ `100 pieces`, paid samples, digital proof usually approximately `3-4 days`, bulk production usually approximately `8-10 days after proof approval`, PayPal payment, and shipping coordination through 4PX, DHL, FedEx or UPS.
- Future additions should only be made after the site owner confirms exact payment methods, sample fee rules, additional logistics services, supported file upload workflow and any public company information.

## Technical SEO

- Every generated HTML page includes a unique title, unique meta description, one H1, self-referencing canonical, Open Graph metadata, Twitter metadata and JSON-LD.
- Canonicals use `https://www.heypalpatch.com` with clean URLs and no `.html` suffix.
- `robots.txt`, `sitemap.xml`, `sitemap-images.xml`, `feed.xml` and `llms.txt` are generated or updated.
- `404.html` is noindex, follow and links to useful recovery pages.

## Content Structure

- Added hub-and-spoke navigation from Home to Patch Types, individual patch pages, buyer guides, order process, MOQ, shipping, FAQ, contact and quote.
- Each priority page opens with a direct answer and includes practical buyer information, internal links and FAQ content.
- Product pages cover material fit, artwork suitability, surface and texture, detail limitations, backing, borders, MOQ, samples, proof process, timing, comparisons and quote CTAs.

## Validation

- `scripts/check-seo.mjs` checks titles, descriptions, H1 count, canonical format, JSON-LD parsing, OG/Twitter fields, image attributes, sitemap coverage and noindex usage.
- `scripts/check-links.mjs` checks clean internal URLs, missing pages, missing images, orphan pages and required generated files.
