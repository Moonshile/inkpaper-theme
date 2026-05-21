import fs from 'node:fs'
import path from 'node:path'

export default {
  paths() {
    const postsDir = path.resolve(import.meta.dirname, '..', 'posts')
    if (!fs.existsSync(postsDir)) return []

    const years = new Set<string>()
    const months = new Set<string>()

    function scan(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue
        if (entry.isDirectory()) {
          scan(path.join(dir, entry.name))
        } else if (entry.name.endsWith('.md')) {
          const content = fs.readFileSync(path.join(dir, entry.name), 'utf-8')
          const match = content.match(/date:\s*(.+)/)
          if (match) {
            const date = new Date(match[1].trim()).toISOString().slice(0, 10)
            years.add(date.slice(0, 4))
            months.add(date.slice(0, 7))
          }
        }
      }
    }

    scan(postsDir)

    return [
      ...Array.from(years).map(y => ({ params: { period: y } })),
      ...Array.from(months).map(m => ({ params: { period: m } })),
    ]
  }
}
