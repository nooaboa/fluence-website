# Lead Leak Audit

Interactive quiz lead magnet for Fluence. React + TypeScript + Tailwind (Vite).

## Local development

```bash
cd lead-leak-audit
cp .env.example .env
# Set VITE_N8N_WEBHOOK_URL to your n8n webhook
npm install
npm run dev
```

Open `http://localhost:5173/audit/`.

## Build

```bash
cd lead-leak-audit
npm run build
```

Production assets land in `dist/` with base path `/audit/`. Netlify builds this into `/audit` on the main site.
