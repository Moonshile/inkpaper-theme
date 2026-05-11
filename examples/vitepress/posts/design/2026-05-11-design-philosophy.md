---
title: "inkpaper: Design Philosophy"
date: 2026-05-10
order: 2
tags:
  - design
  - CSS
---

# inkpaper: Design Philosophy

The visual system of inkpaper is built around one image: writing with a brush on rice paper, stamped with a vermillion seal. The entire design is about recreating that feeling while maintaining on-screen readability.

## Color System

Three groups of tones, each with a clear role.

**Ink**, for text. Four levels:

- `--ink`: body text, near-black with a warm undertone (#1a1814)
- `--ink-light`: secondary text — dates, tags
- `--ink-faint`: tertiary info, sidebar captions
- `--ink-ghost`: lightest level — separators, placeholder text

**Paper**, for backgrounds. Three levels:

- `--paper`: main background, a slightly warm white (#f7f5f2), not pure white
- `--paper-warm`: cards, sidebar background, one step deeper
- `--paper-deep`: inline code background, another step for differentiation

**Vermillion**, for emphasis and interaction:

- `--vermillion`: links, hover states, brand color (#c04b3a)
- `--vermillion-soft`: link underlines, blockquote left border
- `--vermillion-faint`: blockquote background, ultra-subtle highlights

Why not pure black and white? Because rice paper isn't white, and ink isn't pure black. The warm tones make the page feel like "paper" rather than "screen."

## Paper Texture

An SVG `feTurbulence` filter generates fractalNoise, overlaid on `body::before` at `opacity: 0.1`. This number went through many iterations — 0.05 is barely visible, 0.2 starts interfering with reading, 0.1 is the point where you can sense the texture without it getting in the way.

Implementation is an inline SVG data URL, no extra image request. Fixed positioning, `pointer-events: none`, zero impact on interaction.

## Vermillion Top Line

A 2px vermillion line sits at the very top of the page, `position: fixed`, always visible. It's the heaviest color element on the entire page. The inspiration is a seal — a vermillion stamp pressed into the corner of rice paper.

## Typography

Body text uses Noto Sans SC + Inter. Noto Sans SC covers Chinese characters, Inter covers Latin and numerals. They pair well in x-height and stroke weight. Code uses JetBrains Mono, one of the most legible monospace fonts available.

Fonts load via Google Fonts. If your site targets regions where Google is slow, you may want to self-host the font files.

## Dark Mode

Dark mode is not a simple black-white inversion. Every tone group is re-tuned:

- Ink becomes light text (#e8e4df), keeping the warm undertone
- Paper becomes a dark background (#1a1814), close to the light mode's ink color
- Vermillion brightens (#e06050), because dark backgrounds need higher contrast

The principle: in dark mode, the paper-ink relationship still holds, just reversed — dark "paper" carries light "ink."

## Motion

Only two types of animation:

1. **fadeInUp**: elements fade in from below on page load, 0.45s, used only on the home page and post lists.
2. **Gradient underline**: links and tags reveal a vermillion line from left to right on hover. Implemented with `background-image` + `background-size` transition — smoother than animating `border-bottom`.

That's all. Motion is seasoning, not the main course.

## Design Token Architecture

All colors, fonts, and spacing are defined as CSS custom properties in the `@inkpaper/core` package. This package is pure CSS, framework-agnostic. `@inkpaper/vitepress` builds on top of it with VitePress variable mappings (`--vp-c-brand-1: var(--vermillion)` and so on).

The benefit of this split: if an Astro or Hugo version of the theme is built later, the color system and texture can be reused directly. Only the component layer needs rewriting.
