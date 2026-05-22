<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { usePosts } from '../composables/usePosts'

const props = defineProps<{
  dir?: string
}>()

const { page } = useData()
const posts = usePosts()

const category = computed(() => {
  if (props.dir) return props.dir
  const path = page.value.relativePath
  const match = path.match(/^category\/(.+?)(?:\/index)?\.md$/)
  return match?.[1] ?? ''
})

const prefix = computed(() => `posts/${category.value}/`)

const directPosts = computed(() =>
  posts.filter(p => {
    const url = p.url.replace(/\.html$/, '')
    const rel = url.startsWith('/') ? url.slice(1) : url
    if (!rel.startsWith(prefix.value)) return false
    const rest = rel.slice(prefix.value.length)
    return !rest.includes('/')
  })
)

const allPosts = computed(() =>
  posts.filter(p => {
    const url = p.url.replace(/\.html$/, '')
    const rel = url.startsWith('/') ? url.slice(1) : url
    return rel.startsWith(prefix.value)
  })
)

const childDirs = computed(() => {
  const dirs = new Set<string>()
  for (const p of posts) {
    const url = p.url.replace(/\.html$/, '')
    const rel = url.startsWith('/') ? url.slice(1) : url
    if (!rel.startsWith(prefix.value)) continue
    const rest = rel.slice(prefix.value.length)
    if (rest.includes('/')) {
      dirs.add(rest.split('/')[0])
    }
  }
  return Array.from(dirs).sort()
})

function childDirCount(dir: string): number {
  const childPrefix = `${prefix.value}${dir}/`
  return posts.filter(p => {
    const url = p.url.replace(/\.html$/, '')
    const rel = url.startsWith('/') ? url.slice(1) : url
    return rel.startsWith(childPrefix)
  }).length
}

const latestDate = computed(() => {
  if (!allPosts.value.length) return ''
  return allPosts.value.reduce((a, b) => (a.date > b.date ? a : b)).date
})

const displayName = computed(() => category.value.split('/').pop() ?? '')
</script>

<template>
  <div class="category-page">
    <h1 class="category-title">{{ displayName }}</h1>

    <section class="stats-row">
      <div class="stat">
        <span class="stat-num">{{ allPosts.length }}</span>
        <span class="stat-label">篇文章</span>
      </div>
      <template v-if="childDirs.length">
        <span class="stat-sep">/</span>
        <div class="stat">
          <span class="stat-num">{{ childDirs.length }}</span>
          <span class="stat-label">个子目录</span>
        </div>
      </template>
      <template v-if="latestDate">
        <span class="stat-sep">/</span>
        <div class="stat">
          <span class="stat-label">最近更新</span>
          <span class="stat-date">{{ latestDate }}</span>
        </div>
      </template>
    </section>

    <section v-if="childDirs.length" class="category-section">
      <ul class="dir-list">
        <li v-for="d in childDirs" :key="d">
          <a :href="withBase(`/category/${category}/${d}`)" class="dir-link">
            <span class="dir-icon" />
            <span>{{ d }}</span>
            <span class="dir-count">{{ childDirCount(d) }} 篇文章</span>
          </a>
        </li>
      </ul>
    </section>

    <section v-if="directPosts.length" class="category-section">
      <ul class="post-list">
        <li v-for="(post, i) in directPosts" :key="post.url" :style="{ animationDelay: `${i * 0.05}s` }">
          <a :href="withBase(post.url)" class="post-list-title">{{ post.title }}</a>
          <div class="post-meta">
            {{ post.date }}
            <span v-if="post.tags.length"> · {{ post.tags.join(', ') }}</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.category-page {
  padding: 0;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 1rem;
  border: none;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.stats-row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-faint);
  margin-bottom: 2rem;
  animation: fadeInUp 0.45s var(--ease-out) 0.05s both;
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}

.stat-num {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ink);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--ink-faint);
  letter-spacing: 0.02em;
}

.stat-date {
  font-size: 0.85rem;
  color: var(--ink-light);
  font-weight: 400;
}

.stat-sep {
  color: var(--ink-ghost);
  font-size: 0.8rem;
}

.category-section {
  margin-bottom: 2.25rem;
  animation: fadeInUp 0.45s var(--ease-out) 0.1s both;
}

.section-heading {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--ink-faint);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.85rem;
  border: none;
  padding: 0;
}

.dir-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dir-list li {
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border-faint);
}

.dir-list li:last-child {
  border-bottom: none;
}

.dir-link {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--ink);
  font-size: 1.05rem;
  font-weight: 500;
  transition: color 0.2s var(--ease-out);
}

.dir-link:hover {
  color: var(--vermillion);
}

.dir-count {
  font-size: 0.8rem;
  color: var(--ink-faint);
}

.dir-icon {
  display: inline-block;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  opacity: 0.5;
  background: currentColor;
  align-self: center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 2h4.293l1 1H14.5l.5.5v10l-.5.5h-13l-.5-.5v-11l.5-.5zM2 3v10h12V4H6.5l-1-1H2z' fill='currentColor'/%3E%3C/svg%3E") center / 16px no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 2h4.293l1 1H14.5l.5.5v10l-.5.5h-13l-.5-.5v-11l.5-.5zM2 3v10h12V4H6.5l-1-1H2z' fill='currentColor'/%3E%3C/svg%3E") center / 16px no-repeat;
}

.post-list li {
  animation: fadeInUp 0.45s var(--ease-out) both;
}
</style>
