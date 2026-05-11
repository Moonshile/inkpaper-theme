# inkpaper

纸白墨黑，朱砂点缀。

inkpaper 是一套博客主题，同时支持 VitePress 和 Astro。为个人日志和博客设计，视觉上追求安静、可读、有质感——打开页面就像摊开一张宣纸。

[English](./README.en.md) | 在线演示：[VitePress](https://inkpaper.vercel.app/) · [Astro](https://inkpaper-astro.vercel.app/)

## 快速开始

### VitePress

```bash
npx @inkpaper/create-for-vitepress my-blog
cd my-blog
npm install
npm run dev
```

### Astro

```bash
npm install @inkpaper/astro
```

详细配置见示例站点源码：[examples/vitepress](./examples/vitepress) | [examples/astro](./examples/astro)

## 特性

- **宣纸纹理** — SVG 噪点纹理 + 朱砂顶线，营造纸质感
- **墨/纸/朱砂三色系统** — 完整的亮色/暗色模式支持
- **可配置侧边栏** — 按页面类型独立控制显示与否、目录树或日期树
- **首页/归档/标签** — 三个开箱即用的页面组件
- **文章侧边栏** — 字数统计、阅读时间、标签、相关文章推荐
- **共享设计系统** — `@inkpaper/core` 提供统一的色彩、排版、纹理，两套框架实现视觉一致
- **脚手架工具** — `npx @inkpaper/create-for-vitepress` 一键初始化 VitePress 项目

## 包结构

| 包 | 说明 |
|---|------|
| `@inkpaper/core` | 纯 CSS 设计变量、纹理、排版、通用组件样式，框架无关 |
| `@inkpaper/vitepress` | VitePress 主题：Vue 组件、Layout、侧边栏配置、内容加载器 |
| `@inkpaper/astro` | Astro 主题：Astro 组件、集成、侧边栏配置 |
| `@inkpaper/create-for-vitepress` | VitePress 项目脚手架工具 |

安装 `@inkpaper/vitepress` 或 `@inkpaper/astro`，core 会作为依赖自动装上。

## 许可

[MIT](./LICENSE)
