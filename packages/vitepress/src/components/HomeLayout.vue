<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { usePosts } from '../composables/usePosts'

const posts = usePosts()

const totalPosts = computed(() => posts.length)

const allTags = computed(() => {
  const map: Record<string, number> = {}
  posts.forEach(p => p.tags.forEach(t => { map[t] = (map[t] || 0) + 1 }))
  return Object.entries(map).sort((a, b) => b[1] - a[1])
})

const hotTags = computed(() => allTags.value.slice(0, 10))
const recentPosts = computed(() => posts.slice(0, 10))
const lastUpdate = computed(() => posts[0]?.date || '-')
</script>

<template>
  <div class="home-layout">
    <header class="home-header">
      <h1 class="home-title">Journal</h1>
      <p class="home-motto">记录思考与生活</p>
    </header>

    <section class="stats-row">
      <div class="stat">
        <span class="stat-num">{{ totalPosts }}</span>
        <span class="stat-label">篇文章</span>
      </div>
      <span class="stat-sep">/</span>
      <div class="stat">
        <span class="stat-num">{{ allTags.length }}</span>
        <span class="stat-label">个标签</span>
      </div>
      <span class="stat-sep">/</span>
      <div class="stat">
        <span class="stat-label">最近更新</span>
        <span class="stat-date">{{ lastUpdate }}</span>
      </div>
    </section>

    <section class="home-section">
      <h2 class="section-heading">标签</h2>
      <div class="tag-cloud">
        <a
          v-for="[tag, count] in hotTags"
          :key="tag"
          :href="withBase('/tags?tag=' + encodeURIComponent(tag))"
          class="tag"
        >
          {{ tag }}<sup>{{ count }}</sup>
        </a>
      </div>
    </section>

    <section class="home-section">
      <h2 class="section-heading">最近更新</h2>
      <ul class="post-list">
        <li v-for="(post, i) in recentPosts" :key="post.url" :style="{ animationDelay: `${i * 0.05}s` }">
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
.home-layout {
  padding: 0;
}

.home-header {
  margin-bottom: 2rem;
  animation: fadeInUp 0.45s var(--ease-out) both;
}

.home-title {
  font-size: 1.85rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
  border: none;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.home-motto {
  color: var(--ink-ghost);
  font-size: 0.85rem;
  font-weight: 300;
  letter-spacing: 0.12em;
  margin-top: 0.35rem;
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

.home-section {
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

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0;
}

.tag {
  display: inline-block;
  color: var(--ink-light);
  font-size: 0.92rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  margin-right: 1.25rem;
  padding: 0.25rem 0;
  text-decoration: none;
  background-image: linear-gradient(var(--vermillion), var(--vermillion));
  background-size: 0% 1px;
  background-position: left bottom;
  background-repeat: no-repeat;
  transition: background-size 0.35s var(--ease-out), color 0.2s var(--ease-out);
}

.tag:hover {
  color: var(--vermillion);
  background-size: 100% 1px;
}

.tag sup {
  font-size: 0.65rem;
  color: var(--ink-faint);
  margin-left: 0.15rem;
}

.post-list li {
  animation: fadeInUp 0.45s var(--ease-out) both;
}
</style>
