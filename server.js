'use strict';

require('dotenv').config();

const express   = require('express');
const path      = require('path');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.static(path.join(__dirname), { index: false }));

// ── Origin check ──────────────────────────────────────────────────────────────

function requireOrigin(req, res, next) {
  const origin = req.headers['origin'];
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ ok: false, message: 'Forbidden.' });
  }
  next();
}

// ── Rate limiter ──────────────────────────────────────────────────────────────

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Too many submissions. Please try again later.' },
});

// ── Nodemailer transport ──────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ── POST /contact ─────────────────────────────────────────────────────────────

app.post('/contact', requireOrigin, contactLimiter, async (req, res) => {
  const { fullName, phone, email, company, turnover, challenge } = req.body;

  const missing = [];
  if (!fullName?.trim())  missing.push('Full Name');
  if (!phone?.trim())     missing.push('Phone Number');
  if (!email?.trim())     missing.push('Email Address');
  if (!company?.trim())   missing.push('Company Name');

  if (missing.length) {
    return res.status(400).json({
      ok: false,
      message: `Please fill in: ${missing.join(', ')}.`,
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
  }

  const mailOptions = {
    from:    `"${process.env.FROM_NAME || 'Bella Technologies Website Lead Form'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to:      process.env.RECIPIENT_EMAIL,
    replyTo: email,
    subject: `New Lead: ${fullName} — ${company}`,
    text: [
      `Name:     ${fullName}`,
      `Phone:    ${phone}`,
      `Email:    ${email}`,
      `Company:  ${company}`,
      `Turnover: ${turnover || 'Not specified'}`,
      ``,
      `Challenge:`,
      challenge || '(not provided)',
    ].join('\n'),
    html: `
      <h2 style="color:#ea580c;font-family:sans-serif">New Consultation Request</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
        <tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-weight:600">Name</td><td>${esc(fullName)}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-weight:600">Phone</td><td>${esc(phone)}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-weight:600">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-weight:600">Company</td><td>${esc(company)}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-weight:600">Turnover</td><td>${esc(turnover || 'Not specified')}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:14px;margin-top:16px;color:#374151">
        <strong>Challenge:</strong><br>
        ${esc(challenge || '(not provided)').replace(/\n/g, '<br>')}
      </p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true, message: "We'll be in touch within 4 business hours." });
  } catch (err) {
    console.error('[contact] sendMail error:', err.message);
    return res.status(500).json({
      ok: false,
      message: 'Something went wrong on our end. Please email us directly at contact@bellatechnologies.in.',
    });
  }
});

// ── Catch-all ─────────────────────────────────────────────────────────────────

const fs = require('fs');

const GTM_ID = 'GTM-5ZN587DK';
const GTM_HEAD = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->`;
const GTM_BODY = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

const indexTemplate = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

app.get('*', (_req, res) => {
  const gtmEnabled = process.env.ENABLE_GTM === 'true';
  const html = indexTemplate
    .replace('  <!-- GTM_HEAD -->', gtmEnabled ? GTM_HEAD : '')
    .replace('  <!-- GTM_BODY -->', gtmEnabled ? GTM_BODY : '');
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Bella Technologies server running on http://localhost:${PORT}`);
});

// ── Utility ───────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
