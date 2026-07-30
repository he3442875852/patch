# Performance Report

Date: 2026-07-30

## Changes Made

- Removed the Google Fonts dependency and switched to system fonts.
- Replaced the previous large CSS file with a smaller site stylesheet.
- Simplified front-end JavaScript and kept it loaded with `defer`.
- Generated WebP display versions of product images while preserving original images.
- Updated generated pages so only the hero/LCP image uses `fetchpriority="high"`.
- Added explicit `width`, `height`, `alt` and `decoding="async"` attributes for generated page images.
- Kept the site static and did not add heavy frameworks, chat widgets or analytics scripts.

## Local Audit

- SEO script: passed for 42 HTML files.
- Link script: passed for 42 HTML files.
- Lighthouse was not run in this environment before commit because Chrome/Lighthouse CLI was not available through the local PATH. Run Lighthouse in Vercel preview or Chrome DevTools after deployment.

## Expected Performance Impact

- Large PNG files are no longer used as primary display images on generated pages; WebP assets are used instead.
- Removing external font requests should reduce render blocking and third-party request overhead.
- The remaining performance risk is image payload size on pages with many product cards, though those images are lazy-loaded below the hero.

## Lighthouse Fields To Record After Preview

- Performance
- Accessibility
- Best Practices
- SEO
- LCP
- CLS
- TBT or INP
- Page resource size
- Request count
