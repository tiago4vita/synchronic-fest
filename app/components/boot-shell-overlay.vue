<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import SYNCHRONIC_ASCII from '~/assets/boot/synchron-ascii.txt?raw'

const { ready, progressPercent, loadedCount, total } = useGalleryAssets()

const reduceMotion = ref(false)
/** Whole overlay (fixed stack) until site is revealed */
const showOverlay = ref(true)
/** `boot` = terminal UI · `flash` = solid ink field before site fade-in */
const phase = ref<'boot' | 'flash'>('boot')

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

const transitionDuration = computed(() =>
  reduceMotion.value
    ? { enter: 0, leave: 200 }
    : { enter: 0, leave: 650 },
)

const bootLines = computed(() => {
  const p = progressPercent.value
  const lines: string[] = []
  lines.push('0847-MF-01> BOOT_SEQ / COLD_START')
  lines.push('0847-MF-01> MOUNT /dev/raster .............. PENDING')
  if (p >= 8) lines.push('0847-MF-01> CHK  ECC ........................ PASS')
  if (p >= 20) lines.push('0847-MF-01> MAP  framebuf 0xB8000 .......... OK')
  if (p >= 35) lines.push('0847-MF-01> LD   signed_object ............ OK')
  if (p >= 52) lines.push(`0847-MF-01> PULL assets [${String(loadedCount.value).padStart(2, '0')}/${total}] .... RUN`)
  if (p >= 70) lines.push('0847-MF-01> DEC  parallel_decode ........... OK')
  if (p >= 88) lines.push('0847-MF-01> ARM  handoff -> main_plane ..... WAIT')
  if (ready.value) lines.push('0847-MF-01> *** CHANNELS HOT — EXEC GO ***')
  return lines
})

const statusLine = computed(() => {
  if (ready.value) {
    return 'STATUS: ONLINE   OP: RDY   ERR: 00'
  }
  return `STATUS: BUSY   LOAD: ${String(progressPercent.value).padStart(3, '0')}%   OP: I/O`
})

const progressBarAscii = computed(() => {
  const w = 28
  const filled = Math.round((progressPercent.value / 100) * w)
  const bar = '#'.repeat(filled) + '-'.repeat(Math.max(0, w - filled))
  return `[${bar}]`
})

let lockedScroll = false

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
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
    if (reduceMotion.value) {
      phase.value = 'flash'
      await sleep(280)
      showOverlay.value = false
      unlockScroll()
      return
    }
    phase.value = 'flash'
    await sleep(450)
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
    :duration="transitionDuration"
    @after-leave="onAfterLeave"
  >
    <div
      v-if="showOverlay"
      class="boot-root"
      data-boot-overlay
      role="status"
      aria-live="polite"
      :aria-busy="phase === 'boot' && !ready"
    >
      <!-- Phase 1: terminal -->
      <div
        v-if="phase === 'boot'"
        class="boot-shell"
      >
        <div class="boot-shell__noise" aria-hidden="true" />

        <div class="boot-shell__inner">
          <div class="boot-shell__frame">
            <div class="boot-shell__frame-top">
              +--[ MAINFRAME / TTY0847 / SEC=A ]-------------------------------------------+
            </div>

            <pre class="boot-shell__ascii" aria-label="SYNCHRONIC">{{ SYNCHRONIC_ASCII }}</pre>

            <p class="boot-shell__meta">
              NODE: BER-01 &nbsp; JOB: SYNC-LOAD &nbsp; CLASS: RASTER &nbsp; PRI: HI
            </p>

            <div class="boot-shell__rule">
              +-------------------------------------------------------------------------+
            </div>

            <pre class="boot-shell__log">{{ statusLine }}</pre>

            <p class="boot-shell__bar-label">
              PROGRESS (BLK)
            </p>
            <pre class="boot-shell__bar-ascii">{{ progressBarAscii }}</pre>

            <div class="boot-shell__track" aria-hidden="true">
              <div
                class="boot-shell__track-fill"
                :style="{ width: `${progressPercent}%` }"
              />
            </div>

            <div class="boot-shell__rule">
              +-------------------------------------------------------------------------+
            </div>

            <ul
              class="boot-shell__lines"
              aria-label="Boot log"
            >
              <li
                v-for="(line, i) in bootLines"
                :key="`${i}-${line}`"
                class="boot-shell__line"
              >
                {{ line }}
              </li>
            </ul>

            <div class="boot-shell__frame-bottom">
              +----------------------------------------------------------------------------+
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Root: full-screen stack — bg token + final fade reveals website */
.boot-root {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  background: black;
}

.boot-shell {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  color: var(--color-ticker-fg);
  font-family: ui-monospace, "Cascadia Mono", "Consolas", "Liberation Mono", var(--font-body),
    monospace;
  font-size: clamp(0.62rem, 1.35vw, 0.78rem);
  line-height: 1.35;
}

.boot-flash {
  position: absolute;
  inset: 0;
  background: var(--color-accent-cyan);
}

.boot-shell__noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.09;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

.boot-shell__inner {
  position: relative;
  width: min(52rem, 100%);
  max-height: min(92dvh, 100%);
  overflow: auto;
}

.boot-shell__frame {
  border: 1px solid var(--color-accent-cyan);
  padding: var(--space-sm) var(--space-md) var(--space-md);
}

.boot-shell__frame-top,
.boot-shell__frame-bottom,
.boot-shell__rule {
  margin: 0;
  color: color-mix(in srgb, var(--color-ticker-fg) 48%, transparent);
  font-size: 0.85em;
  letter-spacing: 0.02em;
  white-space: pre-wrap;
  word-break: break-all;
}

.boot-shell__frame-bottom {
  margin-top: var(--space-sm);
}

.boot-shell__ascii {
  margin: var(--space-sm) 0 var(--space-md);
  padding: 0;
  overflow-x: auto;
  font: inherit;
  line-height: 1.12;
  letter-spacing: 0;
  color: var(--color-accent-magenta);
  white-space: pre;
}

.boot-shell__meta {
  margin: 0 0 var(--space-sm);
  font-size: 0.82em;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--color-ticker-fg) 62%, transparent);
}

.boot-shell__log {
  margin: 0 0 var(--space-sm);
  font: inherit;
  white-space: pre-wrap;
  word-break: break-word;
}

.boot-shell__bar-label {
  margin: var(--space-sm) 0 0.15rem;
  font-size: 0.78em;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.boot-shell__bar-ascii {
  margin: 0 0 var(--space-sm);
  font: inherit;
  white-space: pre;
  overflow-x: auto;
}

.boot-shell__track {
  height: 3px;
  margin-bottom: var(--space-sm);
  border-radius: var(--radius-sm);
  background: var(--color-fg-primary);
  overflow: hidden;
}

.boot-shell__track-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--color-accent-acid);
  transition: width 0.16s var(--ease-sharp);
}

.boot-shell__lines {
  margin: 0;
  padding: 0;
  list-style: none;
  font: inherit;
}

.boot-shell__line {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Phase 3: fade overlay out — site fades in */
.boot-site-leave-active {
  transition: opacity 0.65s var(--ease-out-expo);
}

.boot-site-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .boot-site-leave-active {
    transition: opacity 0.18s var(--ease-sharp);
  }

  .boot-shell__track-fill {
    transition: none;
  }
}
</style>
