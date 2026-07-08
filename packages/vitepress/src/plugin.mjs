/**
 * Vite plugin: fix relative image paths in markdown files.
 * Converts `images/posts/` to `/images/posts/` so images resolve
 * correctly regardless of the page URL depth.
 */
export function imagePathPlugin() {
  return {
    name: 'inkpaper-image-path',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.md')) {
        return code.replace(/!\[([^\]]*)\]\(images\/posts\//g, '![$1](/images/posts/')
      }
    }
  }
}
