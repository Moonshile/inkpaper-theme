/**
 * Shared word count and reading time utilities for inkpaper themes.
 *
 * countWords(src)  — 接受原始 markdown 文本，清洗后统计字数
 * countTextWords(text) — 接受已清洗的纯文本，直接统计字数
 * readingTime(wordCount, wordsPerMinute?) — 根据字数计算阅读时长
 */

// ── Unicode ranges for CJK characters ──────────────────────────────
// Matches the approach used by the `reading-time` npm package.
const CJK_PATTERN =
  /[一-鿿㐀-䶿豈-﫿ぁ-ゟ가-힣]/g

// ── Internal: count words from clean text ───────────────────────────
function countFromCleanText(text) {
  // Each CJK character = 1 word
  const cjkChars = (text.match(CJK_PATTERN) || []).length

  // Non-CJK: split by whitespace, count word-like tokens
  const nonCjk = text.replace(CJK_PATTERN, ' ')
  const words = nonCjk
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .length

  return cjkChars + words
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Count words from raw markdown source.
 *
 * Cleaning pipeline:
 *   frontmatter → fenced code blocks → <style>/<script>/<svg>/<pre>
 *   → HTML comments → inline code → markdown links/images
 *   → HTML tags → HTML entities → CJK + word tokenization
 *
 * @param {string} src - Raw markdown source text
 * @returns {number} Total word count
 */
export function countWords(src) {
  if (!src) return 0

  let text = src

  // ① Frontmatter
  text = text.replace(/^---[\s\S]*?---/, '')

  // ② Fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, '')

  // ③ <style> / <script> / <svg> / <pre> — whole blocks
  text = text.replace(/<(style|script|svg|pre)\b[\s\S]*?<\/\1>/gi, '')

  // ④ HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '')

  // ⑤ Inline code
  text = text.replace(/`[^`]*`/g, '')

  // ⑥ Markdown images / links: keep alt/link text, drop URL
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')

  // ⑦ HTML tags
  text = text.replace(/<[^>]*>/g, '')

  // ⑧ HTML entities
  text = text.replace(/&[a-z]+;/gi, ' ')

  return countFromCleanText(text)
}

/**
 * Count words from already-clean plain text (e.g. DOM textContent).
 *
 * @param {string} text - Plain text content
 * @returns {number} Total word count
 */
export function countTextWords(text) {
  if (!text) return 0
  return countFromCleanText(text)
}

/**
 * Calculate reading time string.
 *
 * @param {number} wordCount - Total word count
 * @param {number} [wordsPerMinute=400] - Reading speed (default 400, optimised for Chinese)
 * @returns {string} Reading time string, e.g. "3 min"
 */
export function readingTime(wordCount, wordsPerMinute = 400) {
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  return `${minutes} min`
}
