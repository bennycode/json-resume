@AGENTS.md

# Project

JSON Resume Builder — a Next.js app for building tailored resumes per targeted job, backed by the JSON Resume standard. Uses TypeScript, Tailwind CSS, Prisma (SQLite), and App Router.

## Commands

- `npm run dev` — start dev server (Turbopack)
- `npx prisma migrate dev --name <name>` — create and apply a migration after schema changes
- `npx prisma generate` — regenerate Prisma client after schema changes

## Architecture

- `prisma/schema.prisma` — data model (Resume, Basics, Work, Job, Posting, WorkJobDescription)
- `src/app/api/` — route handlers for CRUD operations
- `src/components/` — client components (`"use client"`) for interactive pages
- `src/app/` — server component pages that wrap client components
- `src/lib/prisma.ts` — Prisma client singleton using LibSQL adapter
- `src/generated/prisma/` — generated Prisma client (gitignored)

## Conventions

- Delete actions must always require user confirmation via `confirm()` before proceeding
- Prisma v7 with `prisma-client` generator and `@prisma/adapter-libsql` — do NOT use `prisma-client-js`
- DB file lives at project root (`dev.db`), not in `prisma/`
- After schema changes: run migration, then `npx prisma generate`, then restart dev server
- Route handler params use `{ params }: { params: Promise<{ id: string }> }` (Next.js 16 async params)
- Markdown descriptions use `react-markdown` with `@tailwindcss/typography` prose classes
