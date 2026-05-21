<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { usePosts } from '../composables/usePosts'

const props = defineProps<{
  period?: string
}>()

const { page } = useData()
const posts = usePosts()

const period = computed(() => {
  if (props.period) return props.period
  const path = page.value.relativePath
  const match = path.match(/^archive\/(.+?)(?:\/index)?\.md$/)
  return match?.[1] ?? ''
})

const isYear = computed(() => period.value.length === 4)

const directPosts = computed(() =>
  isYear.value ? [] : posts.filter(p => p.date.startsWith(period.value))
)

const childMonths = computed(() => {
  if (!isYear.value) return []
  const months = new Set<string>()
  for (const p of posts) {
    if (p.date.startsWith(period.value)) {
      months.add(p.date.slice(0, 7))
    }
  }
  return Array.from(months).sort((a, b) => b.localeCompare(a))
})
</script>

<template>
  <div class="category-page">
    <h1 class="category-title">{{ period }}</h1>
    <ul v-if="childMonths.length" class="dir-list">
      <li v-for="m in childMonths" :key="m">
        <a :href="withBase(`/archive/${m}`)" class="dir-link">
          <span class="dir-icon" />
          <span>{{ m }}</span>
        </a>
      </li>
    </ul>
    <ul v-if="directPosts.length" class="post-list">
      <li v-for="(post, i) in directPosts" :key="post.url" :style="{ animationDelay: `${i * 0.05}s` }">
        <a :href="withBase(post.url)" class="post-list-title">{{ post.title }}</a>
        <div class="post-meta">
          {{ post.date }}
          <span v-if="post.tags.length"> · {{ post.tags.join(', ') }}</span>
        </div>
      </li>
    </ul>
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
  margin: 0 0 1.5rem;
  border: none;
}

.dir-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
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
  align-items: center;
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

.dir-icon {
  display: inline-block;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  opacity: 0.5;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 2h4.293l1 1H14.5l.5.5v10l-.5.5h-13l-.5-.5v-11l.5-.5zM2 3v10h12V4H6.5l-1-1H2z' fill='currentColor'/%3E%3C/svg%3E") center / 16px no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 2h4.293l1 1H14.5l.5.5v10l-.5.5h-13l-.5-.5v-11l.5-.5zM2 3v10h12V4H6.5l-1-1H2z' fill='currentColor'/%3E%3C/svg%3E") center / 16px no-repeat;
}

.post-list li {
  animation: fadeInUp 0.45s var(--ease-out) both;
}
</style>
