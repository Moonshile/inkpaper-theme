export interface OutlineItem {
  id: string
  text: string
  level: number
}

export function extractOutline(body: string, levels: [number, number] = [2, 3]): OutlineItem[] {
  const items: OutlineItem[] = []
  const regex = /^(#{2,6})\s+(.+)$/gm
  let match
  while ((match = regex.exec(body)) !== null) {
    const level = match[1].length
    if (level < levels[0] || level > levels[1]) continue
    const text = match[2].replace(/[`*_~]/g, '').trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w一-鿿\s-]/g, '')
      .replace(/\s+/g, '-')
    items.push({ id, text, level })
  }
  return items
}
