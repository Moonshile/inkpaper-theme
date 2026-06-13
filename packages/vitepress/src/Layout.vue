<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { onMounted } from 'vue'
import ArticleAside from './components/ArticleAside.vue'
import InkEffect from './components/InkEffect.vue'

const { Layout } = DefaultTheme
const { frontmatter, site } = useData()
const inkEffect = (site.value.themeConfig?.inkEffect as string) || ''
const inkEffectOpacity = (site.value.themeConfig?.inkEffectOpacity as number) ?? 1

function styleSidebarDates() {
  const dateRegex = /^(\d{4}-\d{2}-\d{2})\s+(.+)$/
  document.querySelectorAll('.VPSidebarItem .text').forEach(el => {
    const text = el.textContent || ''
    const match = text.match(dateRegex)
    if (match && !el.querySelector('.sidebar-date')) {
      el.innerHTML = `${match[2]}<span class="sidebar-date">${match[1]}</span>`
    }
  })
}

onMounted(() => {
  const saved = localStorage.getItem('ink-sidebar-width')
  if (saved) document.documentElement.style.setProperty('--vp-sidebar-width', saved + 'px')

  styleSidebarDates()
  const observer = new MutationObserver(styleSidebarDates)
  const sidebarEl = document.querySelector('.VPSidebar')
  if (sidebarEl) observer.observe(sidebarEl, { childList: true, subtree: true })

  const sidebar = document.querySelector<HTMLElement>('.VPSidebar')
  if (!sidebar) return

  const handle = document.createElement('div')
  handle.className = 'ink-sidebar-resize'
  sidebar.appendChild(handle)

  let startX: number
  let startWidth: number

  function onMouseMove(e: MouseEvent) {
    const width = Math.max(200, Math.min(480, startWidth + e.clientX - startX))
    document.documentElement.style.setProperty('--vp-sidebar-width', width + 'px')
  }

  function onMouseUp(e: MouseEvent) {
    handle.classList.remove('dragging')
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    const width = Math.max(200, Math.min(480, startWidth + e.clientX - startX))
    localStorage.setItem('ink-sidebar-width', String(width))
  }

  handle.addEventListener('mousedown', (e) => {
    e.preventDefault()
    startX = e.clientX
    startWidth = sidebar.offsetWidth
    handle.classList.add('dragging')
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })

  // Auto-scroll active outline item into view
  const marker = document.querySelector('.outline-marker') as HTMLElement | null
  if (marker) {
    const scrollActiveIntoView = () => {
      const activeLink = document.querySelector('.VPDocAsideOutline .outline-link.active') as HTMLElement | null
      activeLink?.scrollIntoView({ block: 'center' })
    }
    new MutationObserver(scrollActiveIntoView).observe(marker, { attributes: true, attributeFilter: ['style'] })
  }
})
</script>

<template>
  <InkEffect :effect="inkEffect" :opacity="inkEffectOpacity" />
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
  <footer class="theme-credit">
    <small>Themed by <a href="https://inkpaper.vercel.app/posts/2026-05-11-inkpaper-%E4%B8%BB%E9%A2%98%E4%BB%8B%E7%BB%8D%E4%B8%8E%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B.html" target="_blank" rel="noopener">@inkpaper</a></small>
  </footer>
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

.theme-credit {
  text-align: center;
  padding: 32px 16px;
  position: relative;
  z-index: 70;
  background: var(--vp-c-bg);
}

.theme-credit::before {
  content: '';
  display: block;
  margin-bottom: 24px;
  border-top: 1px solid var(--vermillion-faint);
}

.theme-credit small {
  font-size: 0.75rem;
  color: var(--vermillion-soft);
  opacity: 0.45;
}

.theme-credit a {
  color: inherit;
  text-decoration: none;
}

.theme-credit a:hover {
  text-decoration: underline;
}
</style>

<style>
body:has(.article-header) .vp-doc h1:first-of-type {
  display: none !important;
}
</style>
