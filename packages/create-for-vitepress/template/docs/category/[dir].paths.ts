import fs from 'node:fs'
import path from 'node:path'

export default {
  paths() {
    const postsDir = path.resolve(import.meta.dirname, '..', 'posts')
    if (!fs.existsSync(postsDir)) return []

    const dirs = new Set<string>()

    function scan(dir: string, prefix: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue
        if (entry.isDirectory()) {
          const rel = prefix ? `${prefix}/${entry.name}` : entry.name
          dirs.add(rel)
          scan(path.join(dir, entry.name), rel)
        }
      }
    }

    scan(postsDir, '')
    return Array.from(dirs).map(d => ({ params: { dir: d } }))
  }
}
