<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import ArticleAside from './components/ArticleAside.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #aside-outline-after>
      <ArticleAside v-if="frontmatter.tags" />
    </template>
  </Layout>
</template>
