const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.avi', '.mkv']

/**
 * Remark plugin that transforms markdown image nodes referencing video files
 * into raw HTML `<video>` elements.
 *
 * `![](video.mp4)` or `![alt](video.mp4 "title")` → `<video src="video.mp4" controls title="..."></video>`
 *
 * This plugin is automatically applied by the @inkpaper/astro integration.
 */
export function remarkVideo() {
  return (tree: any) => {
    visit(tree)
  }

  function visit(node: any) {
    if (node.type === 'image') {
      const url: string = node.url || ''
      const isVideo = VIDEO_EXTS.some(ext => url.toLowerCase().endsWith(ext))

      if (isVideo) {
        const title = node.title || node.alt || ''

        let attrs = `src="${url}" controls`
        if (title) attrs += ` title="${title}"`

        node.type = 'html'
        node.value = `<video ${attrs}></video>`

        // Clean up image-specific properties
        delete node.url
        delete node.alt
        delete node.title
      }
    }

    if (node.children) {
      for (const child of node.children) {
        visit(child)
      }
    }
  }
}
