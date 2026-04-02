<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'

interface TrailCell {
  id: number
  /** Page-space grid column */
  c: number
  /** Page-space grid row */
  r: number
  char: string
  spawnedAt: number
  pendingBlank?: boolean
}

const GLYPH_ARR = Array.from(
  'いうえおかきくけこさしすせそたちつてとなにのはひへるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノ ∴∵░▒⊹✹✺✮♱⚥⚦☿⚢⚣☺☻♡♥X',
)

const BRUSH_RADIUS_CELLS = 1
const GLYPH_COUNT = GLYPH_ARR.length

/** ~1s total: glyph flicker, then one blank beat, then despawn */
const BLANK_AFTER_MS = 820
const HARD_KILL_MS = 1050

/** Trail only paints while the pointer is over this section (`festival-hero.vue`). */
const HERO_ROOT_ID = 'site-hero'

const cells = shallowRef<TrailCell[]>([])
const gridKeyToId = new Map<string, number>()

const cellPx = ref(32)
const scrollX = ref(0)
const scrollY = ref(0)

let nextId = 0
let raf = 0
let scrollRaf = 0
let flameTimer: ReturnType<typeof setTimeout> | undefined

/** Last viewport pointer (for scroll-only vertical trail) */
let lastClientX = 0
let lastClientY = 0
let hasPointerSample = false

function gridKey(c: number, r: number): string {
  return `${c},${r}`
}

function pickChar(): string {
  const i = Math.floor(Math.random() * GLYPH_COUNT)
  return GLYPH_ARR[i] ?? '✦'
}

function pickCharAvoid(current: string): string {
  if (GLYPH_COUNT < 2) return pickChar()
  let next = pickChar()
  let guard = 0
  while (next === current && guard++ < 10) {
    next = pickChar()
  }
  return next
}

function removeKeyForCell(c: number, r: number) {
  gridKeyToId.delete(gridKey(c, r))
}

function syncScroll() {
  if (typeof window === 'undefined') return
  scrollX.value = window.scrollX
  scrollY.value = window.scrollY
}

function getHeroRoot(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  return document.getElementById(HERO_ROOT_ID)
}

function isPointerInHero(clientX: number, clientY: number): boolean {
  const hero = getHeroRoot()
  if (!hero) return false
  const r = hero.getBoundingClientRect()
  return (
    clientX >= r.left
    && clientX <= r.right
    && clientY >= r.top
    && clientY <= r.bottom
  )
}

function clearTrail() {
  if (!cells.value.length && gridKeyToId.size === 0) return
  gridKeyToId.clear()
  cells.value = []
}

function measureCellSize(): number {
  if (typeof document === 'undefined') return 32
  const el = document.createElement('div')
  el.style.cssText =
    'position:absolute;left:-9999px;width:var(--cursor-trail-cell,2rem);visibility:hidden;pointer-events:none;'
  document.body.appendChild(el)
  const w = el.offsetWidth || 32
  document.body.removeChild(el)
  return Math.max(4, w)
}

/** Page coordinates (document space) — trail sticks to content when scrolling */
function spawnBrush(pageX: number, pageY: number) {
  const step = cellPx.value
  const jx = (Math.random() - 0.5) * step * (Math.random() < 0.55 ? 1.4 : 0)
  const jy = (Math.random() - 0.5) * step * (Math.random() < 0.55 ? 1.4 : 0)
  let cx = Math.floor((pageX + jx) / step)
  let cy = Math.floor((pageY + jy) / step)
  if (Math.random() < 0.32) cx += Math.random() < 0.5 ? -1 : 1
  if (Math.random() < 0.32) cy += Math.random() < 0.5 ? -1 : 1

  const r2 = BRUSH_RADIUS_CELLS * BRUSH_RADIUS_CELLS
  const ext = Math.ceil(BRUSH_RADIUS_CELLS)
  const added: TrailCell[] = []
  const now = Date.now()

  function trySpawn(gc: number, gr: number, ignite: number) {
    if (Math.random() > ignite) return
    const k = gridKey(gc, gr)
    if (gridKeyToId.has(k)) return
    const id = ++nextId
    gridKeyToId.set(k, id)
    added.push({
      id,
      c: gc,
      r: gr,
      char: pickChar(),
      spawnedAt: now,
    })
  }

  for (let dr = -ext; dr <= ext; dr++) {
    for (let dc = -ext; dc <= ext; dc++) {
      const d2 = dc * dc + dr * dr
      if (d2 > r2) continue
      const dist = Math.sqrt(d2)
      const inward = 1 - dist / (BRUSH_RADIUS_CELLS + 0.001)
      const flicker = 0.1 + inward * 0.62 + Math.random() * 0.28
      trySpawn(cx + dc, cy + dr, Math.min(0.96, flicker))
    }
  }

  for (let s = 0; s < 4; s++) {
    if (Math.random() < 0.22) {
      const ang = Math.random() * Math.PI * 2
      const rd = BRUSH_RADIUS_CELLS + 0.4 + Math.random() * 1.35
      trySpawn(cx + Math.round(Math.cos(ang) * rd), cy + Math.round(Math.sin(ang) * rd), 0.5 + Math.random() * 0.35)
    }
  }

  if (added.length) {
    cells.value = [...cells.value, ...added].slice(-480)
  }
}

function paintAtViewport(clientX: number, clientY: number) {
  if (!isPointerInHero(clientX, clientY)) {
    clearTrail()
    return
  }
  syncScroll()
  const pageX = clientX + window.scrollX
  const pageY = clientY + window.scrollY
  spawnBrush(pageX, pageY)
}

function onMouseMove(e: MouseEvent) {
  lastClientX = e.clientX
  lastClientY = e.clientY
  hasPointerSample = true

  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => paintAtViewport(e.clientX, e.clientY))
}

function onScrollPaint() {
  if (!hasPointerSample) return
  cancelAnimationFrame(scrollRaf)
  scrollRaf = requestAnimationFrame(() => {
    paintAtViewport(lastClientX, lastClientY)
  })
}

function onWindowScroll() {
  syncScroll()
  onScrollPaint()
}

function onResize() {
  cellPx.value = measureCellSize()
  syncScroll()
}

function flameTick() {
  if (!cells.value.length) return

  const now = Date.now()
  const next: TrailCell[] = []

  for (const cell of cells.value) {
    const age = now - cell.spawnedAt

    if (cell.pendingBlank || age >= HARD_KILL_MS) {
      removeKeyForCell(cell.c, cell.r)
      continue
    }

    if (age >= BLANK_AFTER_MS) {
      next.push({
        ...cell,
        char: ' ',
        pendingBlank: true,
      })
      continue
    }

    if (Math.random() < 0.32) {
      next.push(cell)
      continue
    }

    next.push({
      ...cell,
      char: pickCharAvoid(cell.char),
    })
  }

  cells.value = next
}

function scheduleFlameTick() {
  if (typeof window === 'undefined') return
  const delay = 22 + Math.random() * 75
  flameTimer = window.setTimeout(() => {
    flameTick()
    scheduleFlameTick()
  }, delay)
}

function stopFlameSchedule() {
  if (flameTimer !== undefined) {
    window.clearTimeout(flameTimer)
    flameTimer = undefined
  }
}

onMounted(() => {
  if (typeof window === 'undefined' || typeof matchMedia === 'undefined') return

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (matchMedia('(pointer: coarse)').matches) return

  cellPx.value = measureCellSize()
  syncScroll()

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('scroll', onWindowScroll, { passive: true, capture: true })

  scheduleFlameTick()
})

onUnmounted(() => {
  stopFlameSchedule()
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('scroll', onWindowScroll, { capture: true })
  }
  cancelAnimationFrame(raf)
  cancelAnimationFrame(scrollRaf)
  gridKeyToId.clear()
  cells.value = []
})
</script>

<template>
  <Teleport to="body">
    <div
      class="cursor-grid-trail"
      aria-hidden="true"
    >
      <div
        v-for="cell in cells"
        :key="cell.id"
        class="cursor-grid-trail__cell"
        :class="{ 'cursor-grid-trail__cell--blank': cell.pendingBlank }"
        :style="{
          left: `${cell.c * cellPx - scrollX}px`,
          top: `${cell.r * cellPx - scrollY}px`,
          width: `${cellPx}px`,
          height: `${cellPx}px`,
        }"
      >
        <span class="cursor-grid-trail__glyph">{{ cell.char }}</span>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cursor-grid-trail {
  position: fixed;
  inset: 0;
  z-index: var(--cursor-trail-z);
  pointer-events: none;
  overflow: hidden;
}

.cursor-grid-trail__cell {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  background: var(--color-fg-primary);
  color: var(--color-bg-elevated);
  border: none;
}

.cursor-grid-trail__cell--blank .cursor-grid-trail__glyph {
  opacity: 0;
}

.cursor-grid-trail__glyph {
  font-family: ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, "Segoe UI Symbol",
    "Noto Sans Symbols 2", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .cursor-grid-trail {
    display: none;
  }
}
</style>
