<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { usePosts } from '../composables/usePosts'
import { readingTime } from '@inkpaper/core/count-words'

const posts = usePosts()

const grouped = computed(() => {
  const map: Record<string, typeof posts> = {}
  posts.forEach(p => {
    const year = p.date.slice(0, 4)
    if (!map[year]) map[year] = []
    map[year].push(p)
  })
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
})
</script>

<template>
  <div class="archive-page">
    <div v-for="[year, yearPosts] in grouped" :key="year" class="archive-year">
      <h2 class="section-heading">{{ year }} <span class="year-count">({{ yearPosts.length }})</span></h2>
      <ul class="post-list">
        <li v-for="post in yearPosts" :key="post.url">
          <a :href="withBase(post.url)" class="post-list-title">{{ post.title }}</a>
          <div class="post-meta">
            {{ post.date }} · {{ post.tags.join(', ') }}
            <span v-if="post.wordCount"> · {{ post.wordCount }} 字 · {{ readingTime(post.wordCount) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.archive-page {
  padding: 0;
}

.archive-year {
  margin-bottom: 2.25rem;
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

.year-count {
  font-size: 0.78rem;
  font-weight: 400;
  color: var(--ink-ghost);
}

</style>
