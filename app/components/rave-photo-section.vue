<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const { preloadAll, galleryImages } = useGalleryAssets()

const root = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)

/** True after every gallery URL has been fetched and decoded off-DOM (no empty <img> flash). */
const showGallery = ref(false)

const reduceMotion = ref(false)
const scrollExtraPx = ref(0)
const translateX = ref(0)
/** 0–1 while the gallery section is in the scroll-driven range (horizontal rail or static stack). */
const galleryScrollProgress = ref(0)

let raf = 0
let ro: ResizeObserver | null = null

const images = galleryImages

/** Three beats tied to scroll thirds — edit copy here. */
const GALLERY_CAPTIONS: readonly [string, string, string] = [
  'Berlin concrete, cables everywhere — bodies stacked to the ceiling. If you know, you know.',
  'Strobe, haze, no apologies. Half these shots are already two beats behind real life.',
  'Stay tuned: what you scrolled past was the warm-up. The roster hits next.',
]

const activeCaptionIndex = computed(() => {
  const p = galleryScrollProgress.value
  if (p < 1 / 3) return 0
  if (p < 2 / 3) return 1
  return 2
})

const activeCaption = computed(() => GALLERY_CAPTIONS[activeCaptionIndex.value]!)

/** Scroll phase: magenta lead → acid channel → digital chrome */
const CAPTION_ACCENT_VARS = [
  'var(--color-accent-primary)',
  'var(--color-accent-acid)',
  'var(--color-accent-cyan)',
] as const

const captionAccentColor = computed(
  () => CAPTION_ACCENT_VARS[activeCaptionIndex.value]!,
)

/**
 * Caption slide matches horizontal rail: scrolling “forward” (↓) pans images left →
 * new line enters from the right, previous exits left. Scrolling back reverses.
 */
const captionSlideName = ref<'rave-cap-fwd' | 'rave-cap-back'>('rave-cap-fwd')

watch(activeCaptionIndex, (next, prev) => {
  if (prev === undefined) return
  if (next > prev) captionSlideName.value = 'rave-cap-fwd'
  else if (next < prev) captionSlideName.value = 'rave-cap-back'
})

async function warmupGallery(): Promise<void> {
  if (typeof window === 'undefined') return
  await preloadAll()
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
  galleryScrollProgress.value = scrollProgress()
  const { maxPan } = sectionGeometry()
  translateX.value = galleryScrollProgress.value * maxPan
}

function syncCaptionProgress() {
  galleryScrollProgress.value = scrollProgress()
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
      if (!reduceMotion.value) {
        attachScrollRail()
      }
      else {
        window.addEventListener('scroll', syncCaptionProgress, { passive: true })
        window.addEventListener('resize', syncCaptionProgress, { passive: true })
        syncCaptionProgress()
      }
    }),
  )
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  ro?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', measureRail)
  window.removeEventListener('scroll', syncCaptionProgress)
  window.removeEventListener('resize', syncCaptionProgress)
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
        <!-- Caption is a viewport sibling (not inside translate) so it stays fixed while images pan -->
        <div
          v-if="showGallery"
          ref="rail"
          class="rave-photo__rail"
          :style="{ transform: `translate3d(${-translateX}px, 0, 0)` }"
        >
          <div class="rave-photo__rail-media">
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
        <div
          v-if="showGallery"
          class="rave-photo__caption-layer"
          aria-live="polite"
        >
          <Transition :name="captionSlideName" mode="out-in">
            <p
              :key="activeCaptionIndex"
              class="rave-photo__caption"
              :style="{ color: captionAccentColor }"
            >
              {{ activeCaption }}
            </p>
          </Transition>
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
        <div class="rave-photo__static-compose">
          <div class="rave-photo__stack-media">
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
          </div>
          <div
            class="rave-photo__caption-layer rave-photo__caption-layer--static"
            aria-live="polite"
          >
            <Transition :name="captionSlideName" mode="out-in">
              <p
                :key="activeCaptionIndex"
                class="rave-photo__caption"
                :style="{ color: captionAccentColor }"
              >
                {{ activeCaption }}
              </p>
            </Transition>
        </div>
      </div>
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
  position: relative;
  isolation: isolate;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.rave-photo__caption-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  padding: var(--space-lg);
}

.rave-photo__caption-layer--static {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  padding: var(--space-lg);
}

.rave-photo__caption {
  margin: 0;
  max-width: min(38rem, 88vw);
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.35vw, 1.75rem);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  letter-spacing: var(--letter-spacing-tight);
  text-align: center;
  text-transform: uppercase;
  text-wrap: balance;
  transition: color var(--motion-base) var(--ease-sharp);
  will-change: auto;
}

/* Forward: enter from right, exit left — same sense as rail translateX increasing */
.rave-cap-fwd-enter-active,
.rave-cap-fwd-leave-active,
.rave-cap-back-enter-active,
.rave-cap-back-leave-active {
  transition:
    transform 0.28s var(--ease-sharp),
    opacity 0.22s var(--ease-sharp);
}

.rave-cap-fwd-enter-from {
  opacity: 0;
  transform: translate3d(clamp(1.25rem, 7vw, 4.5rem), 0, 0);
}

.rave-cap-fwd-enter-to,
.rave-cap-fwd-leave-from {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.rave-cap-fwd-leave-to {
  opacity: 0;
  transform: translate3d(calc(-1 * clamp(1.25rem, 7vw, 4.5rem)), 0, 0);
}

/* Backward: enter from left, exit right */
.rave-cap-back-enter-from {
  opacity: 0;
  transform: translate3d(calc(-1 * clamp(1.25rem, 7vw, 4.5rem)), 0, 0);
}

.rave-cap-back-enter-to,
.rave-cap-back-leave-from {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.rave-cap-back-leave-to {
  opacity: 0;
  transform: translate3d(clamp(1.25rem, 7vw, 4.5rem), 0, 0);
}

.rave-photo__rail {
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  height: 100%;
  width: max-content;
  will-change: transform;
}

.rave-photo__rail-media {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 100%;
  width: max-content;
  filter: grayscale(1) contrast(1.08);
}

.rave-photo__img {
  display: block;
  flex: 0 0 auto;
  height: 100vh;
  height: 100dvh;
  width: auto;
  max-width: none;
  pointer-events: none;
  user-select: none;
}

.rave-photo__static {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.rave-photo__static-compose {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.rave-photo__stack-media {
  display: flex;
  flex-direction: column;
  gap: 0;
  filter: grayscale(1) contrast(1.08);
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

  .rave-cap-fwd-enter-active,
  .rave-cap-fwd-leave-active,
  .rave-cap-back-enter-active,
  .rave-cap-back-leave-active {
    transition: opacity var(--motion-fast) var(--ease-sharp);
  }

  .rave-cap-fwd-enter-from,
  .rave-cap-fwd-leave-to,
  .rave-cap-back-enter-from,
  .rave-cap-back-leave-to {
    transform: none;
  }
}
</style>
