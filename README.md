# Cybernetics Wiki

Cybernetics Wiki is an interactive learning website based on the classic Chinese book *控制论与科学方法论* by 金观涛 and 华国凡. It turns the book's key ideas into a modern, readable, and explorable wiki-style app with guided reading, simulations, source-page references, and quizzes.

The project is designed for learners who want to understand cybernetics through concrete cases rather than only abstract definitions: possibility spaces, control and feedback, information, organization, system evolution, qualitative change, and black-box epistemology.

## What It Includes

- Full-book learning path covering chapters 1-5.
- Section-by-section reading cards with original explanations and modern engineering mappings.
- Interactive simulations for key concepts, including feedback control, memory search, signal channels, system boundaries, oscillation, self-organization, potential wells, catastrophe points, black-box probing, and feedback-driven epistemology.
- Short quizzes for immediate learning feedback.
- Source reference modals that show selected page images with highlighted regions.
- Light/dark mode and multiple visual themes.
- Responsive layout for desktop and mobile.

## Source Material Boundary

This repository includes the original PDF file because the deployed learning site needs reliable source context. A deployable copy is available at `public/cybernetics-methodology.pdf`. The interactive reference modal primarily uses selected page images under `public/pdf-pages/` so it can highlight the relevant source-page region, and also links back to the PDF page range for full-context reading.

Because this is a static public website, any PDF or image used by the deployed page is technically downloadable through browser developer tools. If you need stricter access control, move the PDF and page images behind an authenticated server or generate references on demand from a private backend instead of hosting them as static assets.

If you own or control distribution rights and want a stricter setup, move the page images behind an authenticated server or generate them on demand from a private backend instead of hosting them as static assets.

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

On Windows, you can also use:

```bat
start.bat
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

When pushed to the `main` branch, the workflow:

1. Installs dependencies with `npm ci`.
2. Builds the Vite app with the correct GitHub Pages base path.
3. Uploads `dist/` as a Pages artifact.
4. Deploys the site with GitHub Pages.

For the repository name `cybernetics-wiki`, the default GitHub Pages URL will be:

```text
https://<your-github-username>.github.io/cybernetics-wiki/
```

## Tech Stack

- React
- TypeScript
- Vite
- HeroUI v3
- Framer Motion
- Lucide React

## Repository Name

Recommended repository name:

```text
cybernetics-wiki
```

This is the English translation of “控制论 wiki” in a repository-friendly format.
