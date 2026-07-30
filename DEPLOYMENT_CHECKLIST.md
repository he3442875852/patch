# Deployment Checklist

Use this checklist in Vercel because repository access does not confirm dashboard settings.

1. Confirm the Vercel project is connected to `he3442875852/patch`.
2. Confirm the production branch is `main`.
3. Confirm both `https://www.heypalpatch.com` and the non-www domain point to the intended Vercel project.
4. Confirm the latest deployment uses the merge commit from the SEO PR after it is approved and merged.
5. Confirm `cleanUrls` is enabled and `trailingSlash` is false from `vercel.json`.
6. Confirm `/index.html` redirects permanently to `/`.
7. Confirm old `.html` URLs and legacy clean URLs redirect to the correct new clean URL with one hop.
8. Confirm unknown URLs return the real `404.html` page and are not redirected to the homepage.
9. Confirm `/api/quote` still accepts the quote form and delivers messages after environment variables are configured.
10. Confirm no old Vercel project is still serving the production domain.
