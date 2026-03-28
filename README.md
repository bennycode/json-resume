# JSON Resume Builder

A web app for building tailored resumes based on the [JSON Resume](https://jsonresume.org/schema) standard. Instead of maintaining a single static CV, you describe your full work history and then generate targeted PDF versions for each job you're applying to.

## Core Idea

When you work at a company, you wear many hats — you might lead a team, write frontend code, build APIs, and handle DevOps. A single resume can't highlight all of these equally. This tool lets you:

1. **Build your profile** — personal info, location, and online profiles
2. **Add work experience** — each role gets a general description of what you did
3. **Define targeted jobs** — the specific roles you're applying for (e.g. "Senior Frontend Engineer", "Engineering Manager")
4. **Write tailored descriptions** — for each work experience, write job-specific descriptions that highlight the parts most relevant to each target role
5. **Collect reference postings** — save job listings you've found, including their descriptions, responsibilities, and required skills
6. **Generate targeted CVs** — select a targeted job and a theme, and download a PDF with your tailored descriptions automatically substituted

## Features

- Wizard-style profile setup (personal info, location, online profiles)
- Dashboard with work experience and targeted jobs sections
- Markdown support in work descriptions with live preview
- Job-specific tailored descriptions per work entry
- Reference job postings with description, responsibilities, and skills fields
- PDF generation via [resumed](https://github.com/rbardini/resumed) with JSON Resume theme support
- Delete confirmations on all destructive actions
- Data persisted in SQLite via Prisma
- Dark mode support

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) with SQLite
- [resumed](https://github.com/rbardini/resumed) + [Puppeteer](https://pptr.dev/) for PDF generation
- [jsonresume-theme-even](https://github.com/rbardini/jsonresume-theme-even) as the default CV theme
- [react-markdown](https://github.com/remarkjs/react-markdown) for description previews
- [react-select](https://react-select.com/) for country dropdown with flag emojis

## Getting Started

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building your resume.

### Adding More Themes

Install any [JSON Resume theme](https://jsonresume.org/themes) and register it in `src/lib/themes.ts`:

```bash
npm install jsonresume-theme-stackoverflow
```

Then add it to the theme registry so it appears in the Generate CV dialog.
