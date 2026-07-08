import type MarkdownIt from 'markdown-it'

const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.avi', '.mkv']

/**
 * markdown-it plugin that renders video files referenced via image syntax
 * as `<video>` elements instead of `<img>`.
 *
 * Usage in .vitepress/config.mts:
 *   import { videoPlugin } from '@inkpaper/vitepress/markdown'
 *   export default defineConfig({
 *     markdown: { config(md) { md.use(videoPlugin) } }
 *   })
 */
export function videoPlugin(md: MarkdownIt) {
  const defaultImageRender = md.renderer.rules.image!

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const src = token.attrGet('src') || ''
    const isVideo = VIDEO_EXTS.some(ext => src.toLowerCase().endsWith(ext))

    if (!isVideo) {
      return defaultImageRender(tokens, idx, options, env, self)
    }

    const alt = token.content
    const title = token.attrGet('title') || ''

    let attrs = `src="${src}" controls`
    if (title) attrs += ` title="${title}"`
    else if (alt) attrs += ` title="${alt}"`

    return `<video ${attrs}></video>`
  }
}
