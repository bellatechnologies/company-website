# Bella Technologies

B2B lead-gen site for Indian manufacturers. Contact form submissions are handled by an Express backend and emailed to `contact@bellatechnologies.in`.

## Stack

- **Frontend** — Single-page HTML with Tailwind CSS (CDN) and Lucide icons
- **Backend** — Node.js + Express, Nodemailer (Gmail SMTP)
- **Process manager** — PM2
- **Reverse proxy** — Caddy (automatic HTTPS via Let's Encrypt)

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

- `SMTP_USER` — your Gmail address
- `SMTP_PASS` — a Gmail [App Password](https://myaccount.google.com/apppasswords) (requires 2FA enabled)
- `ALLOWED_ORIGINS` — set to `http://localhost:3000` for local dev

### 3. Start the dev server

```bash
npm run dev
```

Opens at `http://localhost:3000`. The server hot-reloads on file changes via nodemon.

### 4. Test the contact endpoint

```bash
# Happy path
curl -s -X POST http://localhost:3000/contact \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:3000' \
  -d '{"fullName":"Test Lead","phone":"+91 99999 00000","email":"test@example.com","company":"Test Corp","turnover":"₹10 – ₹25 Cr","challenge":"Testing"}' \
  | jq .

# Validation error (missing fields)
curl -s -X POST http://localhost:3000/contact \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:3000' \
  -d '{"fullName":"","phone":"","email":"","company":""}' \
  | jq .

# Origin rejected
curl -s -X POST http://localhost:3000/contact \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://evil.com' \
  -d '{"fullName":"x","phone":"x","email":"x@x.com","company":"x"}' \
  | jq .
```

---

## Production Deployment (VPS)

### Prerequisites

- Node.js ≥ 18 installed on the VPS
- [PM2](https://pm2.keymetrics.io/) installed globally: `npm install -g pm2`
- [Caddy](https://caddyserver.com/docs/install) installed

### 1. Pull the latest code

```bash
git pull origin main
npm install --omit=dev
```

### 2. Create the `.env` file on the VPS

Do this once — never commit `.env` to git.

```bash
cp .env.example .env
nano .env
```

Set `ALLOWED_ORIGINS=https://bellatechnologies.in,https://www.bellatechnologies.in` and fill in real SMTP credentials.

### 3. Start the server with PM2

```bash
# First deploy
pm2 start server.js --name bella-tech
pm2 save           # persist across reboots
pm2 startup        # register PM2 with systemd (run the printed command)

# Subsequent deploys
pm2 restart bella-tech
```

Useful PM2 commands:

```bash
pm2 logs bella-tech       # tail logs
pm2 status                # process list
pm2 stop bella-tech       # stop
```

### 4. Start Caddy

From the project directory (where `Caddyfile` lives):

```bash
caddy start
```

Caddy will automatically provision a Let's Encrypt TLS certificate for `bellatechnologies.in`. DNS must be pointing to the VPS before this step.

### 5. Verify

```bash
curl https://bellatechnologies.in         # should return the HTML page
curl https://www.bellatechnologies.in     # same
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Node server listens on | `3000` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `465` |
| `SMTP_SECURE` | Use implicit TLS (`true` for port 465) | `true` |
| `SMTP_USER` | SMTP login (Gmail address) | `you@gmail.com` |
| `SMTP_PASS` | Gmail App Password | `abcd efgh ijkl mnop` |
| `RECIPIENT_EMAIL` | Where form submissions are sent | `contact@bellatechnologies.in` |
| `FROM_NAME` | Display name on outbound emails | `Bella Technologies Website` |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins for `/contact` | `https://bellatechnologies.in` |
