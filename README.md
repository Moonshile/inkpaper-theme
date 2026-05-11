# inkpaper

纸白墨黑，朱砂点缀。

inkpaper 是一个 VitePress 博客主题，为个人日志和博客设计。视觉上追求安静、可读、有质感——打开页面就像摊开一张宣纸。

[English](./README.en.md)

## 快速开始

```bash
npx @inkpaper/create-for-vitepress my-blog
cd my-blog
npm install
npm run dev
```

一条命令生成完整的项目结构，开箱即用。

## 手动安装

```bash
npm install @inkpaper/vitepress
```

详细配置见[主题介绍与快速上手](https://github.com/Moonshile/inkpaper-theme/blob/main/docs/posts/2026-05-11-inkpaper-%E4%B8%BB%E9%A2%98%E4%BB%8B%E7%BB%8D%E4%B8%8E%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B.md)。

## 特性

- **宣纸纹理** — SVG 噪点纹理 + 朱砂顶线，营造纸质感
- **墨/纸/朱砂三色系统** — 完整的亮色/暗色模式支持
- **可配置侧边栏** — 按页面类型独立控制显示与否、目录树或日期树
- **首页/归档/标签** — 三个开箱即用的页面组件
- **文章侧边栏** — 字数统计、阅读时间、标签、相关文章推荐
- **脚手架工具** — `npx @inkpaper/create-for-vitepress` 一键初始化

## 包结构

| 包 | 说明 |
|---|------|
| `@inkpaper/core` | 纯 CSS 设计变量、纹理、通用样式，框架无关 |
| `@inkpaper/vitepress` | Vue 组件、Layout、数据注入、侧边栏配置、内容加载器 |
| `@inkpaper/create-for-vitepress` | 项目脚手架工具 |

只需安装 `@inkpaper/vitepress`，core 会作为依赖自动装上。拆包是为了以后扩展到 Astro 等其他框架。

## 许可

[MIT](./LICENSE)
