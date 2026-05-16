# Cybernetics Wiki

> 中文名：控制论 Wiki  
> 在线 Demo：[https://lun3cy.github.io/cybernetics-wiki/](https://lun3cy.github.io/cybernetics-wiki/)

Cybernetics Wiki is an interactive learning website based on the classic Chinese book *控制论与科学方法论* by 金观涛 and 华国凡. It turns the book's key ideas into a modern, readable, and explorable wiki-style app with guided reading, simulations, source-page references, and quizzes.

This project is designed for learners who want to understand cybernetics through concrete cases rather than only abstract definitions: possibility spaces, control and feedback, information, organization, system evolution, qualitative change, black-box epistemology, and other core ideas.

## 中文介绍

控制论 Wiki 是一个把《控制论与科学方法论》改造成交互式学习应用的项目。它不是简单地把 PDF 搬到网页上，而是把书中的关键概念整理成“阅读解释 + 案例故事 + 实操模拟 + 即时测验”的学习路径。

你可以在线浏览：

[https://lun3cy.github.io/cybernetics-wiki/](https://lun3cy.github.io/cybernetics-wiki/)

目前网站包含：

- 《控制论与科学方法论》主要章节的学习路径。
- 每个小节的原创讲解、书中案例和现代工程映射。
- 面向关键概念的交互实验，例如反馈控制、有记忆搜索、信息通道、系统边界、振荡、自组织、势阱、突变点、黑箱探测等。
- “有意思的小问题”栏目，用同一套学习界面解释二进制编码找毒瓶、哈夫曼压缩、颜色空间与灰度转换等思维题。
- 章节测验和即时反馈，帮助读者检查是否真正理解。
- 原文依据弹窗，用 PDF 页面截图和高亮区域帮助定位书中上下文。
- 深浅色模式、多套主题和桌面/移动端响应式布局。

## What It Includes

- Full-book learning path covering the main chapters currently implemented in the app.
- Section-by-section reading cards with original explanations and modern engineering mappings.
- Interactive simulations for key concepts, including feedback control, memory search, signal channels, system boundaries, oscillation, self-organization, potential wells, catastrophe points, black-box probing, and feedback-driven epistemology.
- A separate “interesting problems” track for compact reasoning cases such as binary poisoning tests, Huffman compression, and color-space conversion.
- Short quizzes for immediate learning feedback.
- Source reference modals that show selected page images with highlighted regions.
- Light/dark mode and multiple visual themes.
- Responsive layout for desktop and mobile.

## Source Material Boundary

This repository includes the original PDF file because the deployed learning site needs reliable source context. A deployable copy is available at `public/cybernetics-methodology.pdf`. The interactive reference modal primarily uses selected page images under `public/pdf-pages/` so it can highlight the relevant source-page region, and also links back to the PDF page range for full-context reading.

Because this is a static public website, any PDF or image used by the deployed page is technically downloadable through browser developer tools. If you need stricter access control, move the PDF and page images behind an authenticated server or generate references on demand from a private backend instead of hosting them as static assets.

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

Current public demo:

```text
https://lun3cy.github.io/cybernetics-wiki/
```

## Tech Stack

- React
- TypeScript
- Vite
- HeroUI v3
- Framer Motion
- Lucide React

## Repository Name

```text
cybernetics-wiki
```

This is the repository-friendly English name for “控制论 Wiki”.
