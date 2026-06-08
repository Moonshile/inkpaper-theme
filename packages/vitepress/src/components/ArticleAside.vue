<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { usePosts, useRelated } from '../composables/usePosts'
import { countTextWords, readingTime } from '@inkpaper/core/count-words'

const posts = usePosts()
const relatedData = useRelated()

const { page, frontmatter } = useData()
const route = useRoute()

const currentTags = computed(() => {
  return (frontmatter.value.tags || []) as string[]
})

const currentLink = computed(() => {
  return '/' + page.value.relativePath.replace(/\.md$/, '')
})

// Match the current post to reuse its pre-computed wordCount (same as list pages)
const currentPost = computed(() => {
  return posts.find(p => p.url === currentLink.value + '.html' || p.url === currentLink.value)
})

// Preferred: wordCount from pre-computed post data (consistent with list page)
const preCount = computed(() => currentPost.value?.wordCount ?? 0)

// Fallback: DOM textContent for pages not in the posts collection
const domCount = ref(0)
function updateDomCount() {
  // Only query DOM when needed (as a fallback)
  if (preCount.value > 0) {
    domCount.value = preCount.value
    return
  }
  const el = document.querySelector('.content-container .vp-doc')
  if (el) {
    domCount.value = countTextWords(el.textContent || '')
  }
}

const wordCount = computed(() => preCount.value || domCount.value)
const minutes = computed(() => readingTime(wordCount.value))

onMounted(updateDomCount)
watch(() => route.path, () => { setTimeout(updateDomCount, 100) })

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
          <div class="stat-value">{{ minutes }}</div>
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
