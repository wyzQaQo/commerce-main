# PalmGrass Pro — 项目文件结构

## 核心配置

| 文件 | 说明 |
|------|------|
| `next.config.mjs` | Next.js + next-intl 插件 |
| `tailwind.config.ts` | 品牌色 #1a2b4a / #c9a84c |
| `middleware.ts` | 多语言路由中间件 |
| `i18n/routing.ts` | EN / RU / ES 路由 |
| `i18n/request.ts` | 语言消息加载 |

## 页面 (`app/[locale]/`)

| 路由 | 文件 |
|------|------|
| `/` | `page.tsx` |
| `/products` | `products/page.tsx` |
| `/products/[slug]` | `products/[slug]/page.tsx` |
| `/projects` | `projects/page.tsx` |
| `/blog` | `blog/page.tsx` |
| `/blog/[slug]` | `blog/[slug]/page.tsx` |
| `/about` | `about/page.tsx` |
| `/contact` | `contact/page.tsx` |

## 数据

- `data/products.json` — 12 个产品
- `data/categories.json` — 6 个分类
- `data/projects.json` — 4 个案例
- `data/blog.json` + `content/blog/*.md`
- `data/hero.json` / `data/stats.json`

## 组件

- `components/layout/` — 导航、Footer、WhatsApp 悬浮
- `components/home/` — 首页各区块
- `components/products/` — 筛选、图库
- `components/ui/` — shadcn 基础组件
- `components/inquiry-form.tsx` — 询盘表单

## API

- `app/api/inquiry/route.ts` — Resend 发邮件

## SEO

- `app/sitemap.ts` — 自动生成 sitemap
- `app/robots.ts`
- 每页 `generateMetadata` + SSG `generateStaticParams`
