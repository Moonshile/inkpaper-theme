<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { usePosts } from '../composables/usePosts'

const posts = usePosts()

const selectedTag = ref<string | null>(null)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  selectedTag.value = params.get('tag')
})

const allTags = computed(() => {
  const map: Record<string, number> = {}
  posts.forEach(p => p.tags.forEach(t => { map[t] = (map[t] || 0) + 1 }))
  return Object.entries(map).sort((a, b) => b[1] - a[1])
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts
  return posts.filter(p => p.tags.includes(selectedTag.value!))
})

function selectTag(tag: string) {
  selectedTag.value = selectedTag.value === tag ? null : tag
}
</script>

<template>
  <div class="tags-page">
    <div class="tag-cloud">
      <button
        v-for="[tag, count] in allTags"
        :key="tag"
        class="tag"
        :class="{ active: selectedTag === tag }"
        @click="selectTag(tag)"
      >
        {{ tag }}<sup>{{ count }}</sup>
      </button>
    </div>

    <ul class="post-list">
      <li v-for="post in filteredPosts" :key="post.url">
        <a :href="withBase(post.url)" class="post-list-title">{{ post.title }}</a>
        <div class="post-meta">{{ post.date }} · {{ post.tags.join(', ') }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tags-page {
  padding: 0;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-faint);
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
  border: none;
  background: none;
  background-image: linear-gradient(var(--vermillion), var(--vermillion));
  background-size: 0% 1px;
  background-position: left bottom;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: background-size 0.35s var(--ease-out), color 0.2s var(--ease-out);
}

.tag:hover {
  color: var(--vermillion);
  background-size: 100% 1px;
}

.tag.active {
  color: var(--vermillion);
  background-size: 100% 1px;
}

.tag sup {
  font-size: 0.65rem;
  color: var(--ink-faint);
  margin-left: 0.15rem;
}

</style>
