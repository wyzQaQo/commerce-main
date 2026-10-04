# PalmGrass Pro — B2B Artificial Palm Grass Showcase

Next.js 14 B2B wholesale showcase site for artificial palm trees and tropical landscaping products.

## Tech Stack

- **Next.js 14** (App Router, SSG)
- **Tailwind CSS** + custom brand colors
- **shadcn/ui** components
- **next-intl** — EN / RU / ES
- **Resend** — inquiry form emails
- **Local JSON** — products, categories, projects, blog

## 环境要求

- **Node.js 18 LTS 或 20 LTS**（推荐，避免 v19）
- npm 9+

## Quick Start

```bash
# 1. 若之前安装失败，先清理
rm -rf node_modules package-lock.json
# Windows PowerShell:
# Remove-Item -Recurse -Force node_modules, package-lock.json

# 2. 安装依赖
npm install

# 3. 环境变量
copy .env.example .env.local

# 4. 本地开发（支持热更新）
npm run dev
```

浏览器打开：**http://localhost:3000/en**（默认会重定向到 `/en`）

```bash
# 生产构建（SSG 静态生成）
npm run build
npm start
```

## Pages

| Route | Description |
|-------|-------------|
| `/[locale]` | Home — hero, categories, stats, products, projects |
| `/[locale]/products` | Product list with filters & pagination |
| `/[locale]/products/[slug]` | Product detail + inquiry form |
| `/[locale]/projects` | Project showcase |
| `/[locale]/blog` | Blog list |
| `/[locale]/blog/[slug]` | Blog post (Markdown) |
| `/[locale]/about` | Company profile, timeline, certificates |
| `/[locale]/contact` | Contact form + info |

## Data Files

- `data/products.json` — product catalog
- `data/categories.json` — 6 categories
- `data/projects.json` — case studies
- `data/blog.json` — blog metadata
- `content/blog/*.md` — blog Markdown content

## Environment Variables

See `.env.example`. Resend is optional in development — inquiries log to console without `RESEND_API_KEY`.

## Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
app/[locale]/          # Localized pages
components/            # UI & layout components
data/                  # JSON data files
messages/              # i18n translations
content/blog/          # Markdown blog posts
lib/                   # Utils, data loaders, metadata
i18n/                  # next-intl routing config
```
