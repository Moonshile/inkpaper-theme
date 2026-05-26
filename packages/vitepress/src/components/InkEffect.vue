<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { initInkEffect } from '@inkpaper/core/ink-effect'

const props = defineProps<{ effect?: string; opacity?: number }>()
const canvas = ref<HTMLCanvasElement | null>(null)
let destroy: (() => void) | null = null

onMounted(() => {
  if (canvas.value && props.effect) {
    destroy = initInkEffect(canvas.value, { effect: props.effect, opacity: props.opacity ?? 1 })
  }
})

onUnmounted(() => {
  if (destroy) destroy()
})
</script>

<template>
  <canvas v-if="effect" ref="canvas" class="ink-effect-canvas" />
</template>

<style>
.ink-effect-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
