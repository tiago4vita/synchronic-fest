<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { galleryImages } from '~/data/gallery-images'

const root = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)

/** True after every gallery URL has been fetched and decoded off-DOM (no empty <img> flash). */
const showGallery = ref(false)

const reduceMotion = ref(false)
const scrollExtraPx = ref(0)
const translateX = ref(0)

let raf = 0
let ro: ResizeObserver | null = null

const images = galleryImages

useHead({
  link: images.map((item) => ({
    rel: 'preload' as const,
    as: 'image' as const,
    href: item.src,
  })),
})

function preloadImage(src: string, timeoutMs = 30000): Promise<void> {
  return new Promise((resolve) => {
    const done = () => resolve()
    const failTimer = window.setTimeout(done, timeoutMs)
    const img = new Image()
    img.onload = () => {
      window.clearTimeout(failTimer)
      if (typeof img.decode === 'function') {
        img.decode().then(done).catch(done)
      }
      else {
        done()
      }
    }
    img.onerror = () => {
      window.clearTimeout(failTimer)
      done()
    }
    img.src = src
  })
}

async function warmupGallery(): Promise<void> {
  if (typeof window === 'undefined') return
  await Promise.all(images.map((item) => preloadImage(item.src)))
  showGallery.value = true
}

function measureRail() {
  const railEl = rail.value
  if (!railEl) return

  const imgs = [...railEl.querySelectorAll<HTMLImageElement>('.rave-photo__img')]
  const railW = imgs.reduce((sum, img) => sum + img.getBoundingClientRect().width, 0)
  const vw = typeof window !== 'undefined' ? window.innerWidth : 0
  const maxPan = Math.max(0, railW - vw)

  scrollExtraPx.value = maxPan
  updateTranslate()
}

function sectionGeometry() {
  const el = root.value
  if (!el || typeof window === 'undefined') {
    return { start: 0, end: 0, maxPan: 0 }
  }
  const top = el.getBoundingClientRect().top + window.scrollY
  const totalH = el.offsetHeight
  const vh = window.innerHeight
  const maxPan = scrollExtraPx.value
  const scrollRange = Math.max(1, totalH - vh)
  const start = top
  const end = top + scrollRange
  return { start, end, maxPan }
}

function scrollProgress(): number {
  if (typeof window === 'undefined') return 0
  const { start, end } = sectionGeometry()
  const y = window.scrollY
  const raw = (y - start) / Math.max(1, end - start)
  return Math.min(1, Math.max(0, raw))
}

function updateTranslate() {
  const { maxPan } = sectionGeometry()
  translateX.value = scrollProgress() * maxPan
}

function tick() {
  raf = 0
  updateTranslate()
}

function onScroll() {
  if (reduceMotion.value) return
  if (raf) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(tick)
}

const sectionHeightStyle = computed(() => {
  if (reduceMotion.value) return undefined
  const extra = scrollExtraPx.value
  return {
    minHeight: `calc(100dvh + ${extra}px)`,
  }
})

function attachScrollRail() {
  measureRail()
  ro = new ResizeObserver(() => {
    measureRail()
  })
  if (rail.value) ro.observe(rail.value)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measureRail, { passive: true })
  updateTranslate()
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  void warmupGallery().then(() =>
    nextTick(() => {
      if (!reduceMotion.value) attachScrollRail()
    }),
  )
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  ro?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', measureRail)
})
</script>

<template>
  <section
    ref="root"
    class="rave-photo"
    :class="{ 'rave-photo--static': reduceMotion }"
    :style="sectionHeightStyle"
    aria-label="Venue photography"
    :aria-busy="!showGallery"
  >
    <!-- Pinned viewport: scroll drives horizontal pan -->
    <div v-if="!reduceMotion" class="rave-photo__pin">
      <div class="rave-photo__viewport">
        <div
          v-if="showGallery"
          ref="rail"
          class="rave-photo__rail"
          :style="{ transform: `translate3d(${-translateX}px, 0, 0)` }"
        >
          <img
            v-for="(item, i) in images"
            :key="item.src"
            class="rave-photo__img"
            :src="item.src"
            :alt="item.alt"
            loading="eager"
            decoding="async"
            :fetchpriority="i === 0 ? 'high' : 'low'"
            @load="measureRail"
          >
        </div>
      </div>
    </div>

    <!-- Reduced motion: simple stack, no scroll capture -->
    <div
      v-else
      class="rave-photo__static"
      :class="{ 'rave-photo__static--hold': !showGallery }"
    >
      <template v-if="showGallery">
        <img
          v-for="(item, i) in images"
          :key="item.src"
          class="rave-photo__img rave-photo__img--stack"
          :src="item.src"
          :alt="item.alt"
          loading="eager"
          decoding="async"
          :fetchpriority="i === 0 ? 'high' : 'low'"
        >
      </template>
    </div>
  </section>
</template>

<style scoped>
.rave-photo {
  position: relative;
  z-index: 1;
  background: var(--color-bg-base);
}

.rave-photo__pin {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
}

.rave-photo__viewport {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.rave-photo__rail {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 100%;
  width: max-content;
  will-change: transform;
}

.rave-photo__img {
  display: block;
  flex: 0 0 auto;
  height: 100vh;
  height: 100dvh;
  width: auto;
  max-width: none;
  filter: grayscale(1) contrast(1.08);
  pointer-events: none;
  user-select: none;
}

.rave-photo__static {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.rave-photo__static--hold {
  min-height: 100dvh;
}

.rave-photo__img--stack {
  height: auto;
  max-height: none;
  width: 100%;
  object-fit: cover;
  aspect-ratio: 16 / 10;
}

@media (prefers-reduced-motion: reduce) {
  .rave-photo__rail {
    will-change: auto;
  }
}
</style>
