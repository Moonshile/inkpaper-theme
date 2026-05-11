<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { usePosts, useRelated } from '../composables/usePosts'

const posts = usePosts()
const relatedData = useRelated()

const { page, frontmatter } = useData()
const route = useRoute()

const wordCount = ref(0)
const readingTime = computed(() => Math.max(1, Math.ceil(wordCount.value / 400)))

function countWords() {
  const el = document.querySelector('.content-container .vp-doc')
  if (el) {
    const text = el.textContent || ''
    wordCount.value = text.replace(/\s+/g, '').length
  }
}

onMounted(countWords)
watch(() => route.path, () => { setTimeout(countWords, 100) })

const currentTags = computed(() => {
  return (frontmatter.value.tags || []) as string[]
})

const currentLink = computed(() => {
  return '/' + page.value.relativePath.replace(/\.md$/, '')
})

const related = computed(() => {
  const fromJson = relatedData[currentLink.value]
  if (fromJson && fromJson.length > 0) {
    return fromJson.slice(0, 5)
  }
  if (!currentTags.value.length) return []
  return posts
    .filter(p => p.url !== currentLink.value + '.html' && p.url !== currentLink.value)
    .map(p => ({
      link: p.url,
      title: p.title,
      score: p.tags.filter(t => currentTags.value.includes(t)).length
    }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
})
</script>

<template>
  <div class="article-aside-content">
    <div class="aside-section">
      <div class="aside-title">统计</div>
      <div class="aside-stats">
        <div>
          <div class="stat-value">{{ wordCount }}</div>
          <div class="stat-label">字数</div>
        </div>
        <div>
          <div class="stat-value">{{ readingTime }} min</div>
          <div class="stat-label">阅读</div>
        </div>
      </div>
    </div>

    <div v-if="currentTags.length" class="aside-section">
      <div class="aside-title">标签</div>
      <div class="aside-tags">
        <a
          v-for="tag in currentTags"
          :key="tag"
          :href="withBase('/tags?tag=' + encodeURIComponent(tag))"
          class="aside-tag"
        >
          {{ tag }}
        </a>
      </div>
    </div>

    <div v-if="related.length" class="aside-section">
      <div class="aside-title">相关文章</div>
      <ul class="related-list">
        <li v-for="item in related" :key="item.link">
          <a :href="withBase(item.link)">{{ item.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
