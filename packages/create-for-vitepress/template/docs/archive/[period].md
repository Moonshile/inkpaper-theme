---
sidebar: true
---

<script setup>
import { useData } from 'vitepress'
import { ArchivePeriodPage } from '@inkpaper/vitepress'

const { params } = useData()
</script>

<ArchivePeriodPage :period="params.period" />
