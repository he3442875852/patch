const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_BODY_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'pdf', 'ai', 'svg', 'eps']);
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'application/pdf', 'image/svg+xml', 'application/postscript', 'application/illustrator', 'application/octet-stream']);
const recentSubmissions = new Map();

async function handler(req, res) {
  setJsonHeaders(res);
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, error: 'Method not allowed.' }));
    return;
  }

  try {
    const ip = getClientIp(req);
    const last = recentSubmissions.get(ip) || 0;
    if (Date.now() - last < 5000) {
      res.statusCode = 429;
      res.end(JSON.stringify({ ok: false, error: 'Please wait a few seconds before submitting again.' }));
      return;
    }
    recentSubmissions.set(ip, Date.now());

    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      res.statusCode = 400;
      res.end(JSON.stringify({ ok: false, error: 'Invalid form submission.' }));
      return;
    }

    const body = await readRequestBody(req, MAX_BODY_SIZE);
    const parsed = parseMultipart(body, contentType);
    const fields = parsed.fields;
    const file = parsed.files.artwork;

    if (fields.website) {
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    const validationError = validateSubmission(fields, file);
    if (validationError) {
      res.statusCode = 400;
      res.end(JSON.stringify({ ok: false, error: validationError }));
      return;
    }

    await deliverQuote(fields, file);
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    res.statusCode = error.statusCode || 500;
    res.end(JSON.stringify({ ok: false, error: error.publicMessage || 'Submission failed. Please try again later.' }));
  }
}

module.exports = handler;
module.exports.config = { api: { bodyParser: false } };

function setJsonHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) return forwarded.split(',')[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}

function readRequestBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        const error = new Error('Request body too large.');
        error.statusCode = 413;
        error.publicMessage = 'The uploaded file is too large. Maximum file size is 8MB.';
        reject(error);
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function parseMultipart(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    const error = new Error('Missing multipart boundary.');
    error.statusCode = 400;
    error.publicMessage = 'Invalid form submission.';
    throw error;
  }

  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`, 'latin1');
  const fields = {};
  const files = {};
  let start = buffer.indexOf(boundary);

  while (start !== -1) {
    start += boundary.length;
    if (buffer[start] === 45 && buffer[start + 1] === 45) break;
    if (buffer[start] === 13 && buffer[start + 1] === 10) start += 2;

    const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), start);
    if (headerEnd === -1) break;
    const headerText = buffer.slice(start, headerEnd).toString('utf8');
    const nextBoundary = buffer.indexOf(boundary, headerEnd + 4);
    if (nextBoundary === -1) break;

    let part = buffer.slice(headerEnd + 4, nextBoundary);
    if (part.length >= 2 && part[part.length - 2] === 13 && part[part.length - 1] === 10) part = part.slice(0, -2);

    const disposition = /content-disposition:\s*form-data;([^\r\n]+)/i.exec(headerText);
    const nameMatch = disposition && /name="([^"]+)"/i.exec(disposition[1]);
    if (nameMatch) {
      const name = nameMatch[1];
      const filenameMatch = /filename="([^"]*)"/i.exec(disposition[1]);
      if (filenameMatch && filenameMatch[1]) {
        const typeMatch = /content-type:\s*([^\r\n]+)/i.exec(headerText);
        files[name] = { filename: sanitizeFilename(filenameMatch[1]), contentType: typeMatch ? typeMatch[1].trim().toLowerCase() : 'application/octet-stream', buffer: part, size: part.length };
      } else {
        fields[name] = part.toString('utf8').trim();
      }
    }
    start = nextBoundary;
  }
  return { fields, files };
}

function sanitizeFilename(filename) {
  return filename.replace(/[^\w.\- ()]/g, '_').slice(0, 120);
}

function validateSubmission(fields, file) {
  if (!fields.name || !fields.email) return 'Please complete your name and email.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return 'Please enter a valid email address.';
  if (!fields.country) return 'Please enter your country.';
  if (!fields.patchType) return 'Please select a patch type.';
  if (!fields.quantity) return 'Please enter the quantity.';

  if (file && file.filename) {
    const extension = file.filename.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) return 'Please upload JPG, JPEG, PNG, PDF, AI, SVG or EPS artwork.';
    if (!ALLOWED_MIME.has(file.contentType)) return 'Unsupported artwork file type.';
    if (file.size > MAX_FILE_SIZE) return 'Artwork file must be 8MB or smaller.';
  }
  return '';
}

async function deliverQuote(fields, file) {
  const to = process.env.QUOTE_TO_EMAIL;
  if (!to) {
    const error = new Error('QUOTE_TO_EMAIL is not configured.');
    error.statusCode = 500;
    error.publicMessage = 'Quote receiving email is not configured.';
    throw error;
  }

  const payload = buildPayload(fields, file);
  if (process.env.RESEND_API_KEY) {
    await sendWithResend(to, payload);
    return;
  }
  if (process.env.QUOTE_FALLBACK_WEBHOOK_URL) {
    await sendWithWebhook(payload);
    return;
  }

  const error = new Error('No quote delivery service configured.');
  error.statusCode = 503;
  error.publicMessage = 'Quote email service is not configured yet. Please try again later.';
  throw error;
}

function buildPayload(fields, file) {
  const safe = (value) => String(value || '').replace(/[<>]/g, '');
  const lines = [
    'New HeyPalPatch quote request', '',
    `Name: ${safe(fields.name)}`,
    `Email: ${safe(fields.email)}`,
    `Company: ${safe(fields.company)}`,
    `Country: ${safe(fields.country)}`,
    `Patch type: ${safe(fields.patchType)}`,
    `Size: ${safe(fields.size)}`,
    `Quantity: ${safe(fields.quantity)}`,
    `Backing: ${safe(fields.backing)}`,
    `Needed date: ${safe(fields.neededDate)}`,
    '', 'Message:', safe(fields.message), '',
    file && file.filename ? `Artwork file: ${file.filename} (${file.size} bytes)` : 'Artwork file: none'
  ];
  return {
    subject: `Custom patch quote request - ${safe(fields.name)}`,
    text: lines.join('\n'),
    replyTo: safe(fields.email),
    fields,
    attachment: file && file.filename ? { filename: file.filename, contentType: file.contentType, content: file.buffer.toString('base64') } : null
  };
}

async function sendWithResend(to, payload) {
  const body = {
    from: process.env.QUOTE_FROM_EMAIL || 'HeyPalPatch Quote <onboarding@resend.dev>',
    to: [to],
    reply_to: payload.replyTo,
    subject: payload.subject,
    text: payload.text
  };
  if (payload.attachment) body.attachments = [{ filename: payload.attachment.filename, content: payload.attachment.content, content_type: payload.attachment.contentType }];

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const error = new Error(`Resend failed: ${await response.text()}`);
    error.statusCode = 502;
    error.publicMessage = 'Quote email could not be sent. Please try again later.';
    throw error;
  }
}

async function sendWithWebhook(payload) {
  const response = await fetch(process.env.QUOTE_FALLBACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = new Error('Fallback webhook failed.');
    error.statusCode = 502;
    error.publicMessage = 'Quote request could not be delivered. Please try again later.';
    throw error;
  }
}
