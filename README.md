# Encuesta DMA

Standalone Data Maturity Assessment ("Diagnóstico de madurez de datos") extracted from the main DMA Analytics site, for use as its own Vercel project.

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

- `DATABASE_URL` — Neon Postgres connection string. Run [`db/schema.sql`](db/schema.sql) against it once to create the `quiz_submissions` table.
- `RESEND_API_KEY` — Resend API key. The sender domain (`dma@updates.dmaanalytics.com`) must be verified on that Resend account, or update the `from` addresses in [`app/actions/send-quiz-email.ts`](app/actions/send-quiz-email.ts).

```bash
npm run dev
```

## Deploying to Vercel

1. Import this repo as a new Vercel project.
2. Add the environment variables above under Project Settings → Environment Variables.
3. Deploy.
