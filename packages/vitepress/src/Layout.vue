<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import ArticleAside from './components/ArticleAside.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #doc-before>
      <div v-if="frontmatter.title && frontmatter.date" class="article-header">
        <h1 class="article-title">{{ frontmatter.title }}</h1>
        <div class="article-meta">
          <time>{{ frontmatter.date?.toString().slice(0, 10) }}</time>
          <span v-if="frontmatter.tags?.length"> &middot; {{ frontmatter.tags.join(', ') }}</span>
        </div>
      </div>
    </template>
    <template #aside-outline-after>
      <ArticleAside v-if="frontmatter.tags" />
    </template>
  </Layout>
</template>

<style scoped>
.article-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.article-title {
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.article-meta {
  font-size: 14px;
  color: var(--vp-c-text-3);
  line-height: 24px;
}
</style>

<style>
body:has(.article-header) .vp-doc h1:first-of-type {
  display: none !important;
}
</style>
