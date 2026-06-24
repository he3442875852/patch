# HeyPalPatch Quote Form Setup

The homepage quote form submits to the Vercel Serverless Function at `POST /api/quote`.

## Required environment variables

- `QUOTE_TO_EMAIL`: the inbox that receives quote requests.
- `RESEND_API_KEY`: Resend API key used to send quote emails.

## Optional environment variables

- `QUOTE_FROM_EMAIL`: verified sender address for Resend. Defaults to `HeyPalPatch Quote <onboarding@resend.dev>` for testing.
- `QUOTE_FALLBACK_WEBHOOK_URL`: optional JSON webhook fallback if `RESEND_API_KEY` is not configured.

Do not commit API keys to the repository. Add them in Vercel Project Settings -> Environment Variables, then redeploy.

## Local preview

This is a static HTML/CSS/JavaScript site. You can preview pages with any local static server, for example:

```bash
npx serve .
```

The quote API requires a Vercel-compatible local runtime or deployment environment to test end-to-end email delivery.

## Accepted artwork uploads

- File types: JPG, JPEG, PNG, PDF, AI, SVG, EPS.
- Maximum file size: 8MB.

The form includes a honeypot field and client/server checks to reduce spam and accidental repeated submissions.
