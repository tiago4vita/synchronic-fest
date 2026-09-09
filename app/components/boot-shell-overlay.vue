<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const { ready } = useGalleryAssets()

const showOverlay = ref(true)
let lockedScroll = false

const AFTER_LOAD_HOLD_MS = 1500

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function lockScroll() {
  if (typeof document === 'undefined') return
  document.body.style.overflow = 'hidden'
  lockedScroll = true
}

function unlockScroll() {
  if (typeof document === 'undefined' || !lockedScroll) return
  document.body.style.overflow = ''
  lockedScroll = false
}

onMounted(() => {
  lockScroll()
})

onUnmounted(() => {
  unlockScroll()
})

watch(
  ready,
  async (isReady) => {
    if (!isReady) return
    await nextTick()
    await sleep(AFTER_LOAD_HOLD_MS)
    showOverlay.value = false
  },
  { immediate: true, flush: 'post' },
)

function onAfterLeave() {
  unlockScroll()
}
</script>

<template>
  <Transition
    name="boot-site"
    @after-leave="onAfterLeave"
  >
    <div
      v-if="showOverlay"
      class="boot-root"
      data-boot-overlay
      role="alert"
      aria-live="assertive"
      :aria-busy="!ready"
    >
      <div class="boot-shell">
        <h1 class="boot-shell__title">
          WARNING
        </h1>
        <p class="boot-shell__copy">
          Hard cuts. Rapid flash. High contrast.
          If that wrecks you, close the tab.
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.boot-root {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-strobe-warn-bg);
  color: var(--color-strobe-warn-fg);
}

.boot-shell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(40rem, calc(100% - var(--space-xl)));
  padding: var(--space-md);
  text-align: center;
}

.boot-shell__title {
  margin: var(--space-sm) 0 0;
  font-family: var(--font-display);
  font-size: clamp(3.25rem, 16vw, 9rem);
  font-weight: var(--font-weight-bold);
  line-height: 0.82;
  letter-spacing: var(--letter-spacing-tight);
  text-transform: uppercase;
}

.boot-shell__copy {
  margin: var(--space-lg) 0 0;
  max-width: 28ch;
  font-family: var(--font-label);
  font-size: clamp(0.95rem, 2.1vw, 1.15rem);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.02em;
}

.boot-site-leave-active {
  transition: opacity 1.6s var(--ease-out-expo);
}

.boot-site-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .boot-site-leave-active {
    transition: opacity 0.4s var(--ease-sharp);
  }
}
</style>
