---
sidebar: true
---

<script setup>
import { useData } from 'vitepress'
import { CategoryPage } from '@inkpaper/vitepress'

const { params } = useData()
</script>

<CategoryPage :dir="params.dir" />
