import { onMounted, onUnmounted, ref, shallowRef, watch, type Ref } from 'vue'
import { vipTrailPairs, type TicketTrailChroma } from '~/data/tickets'

export interface HoverTrailCell {
  id: number
  c: number
  r: number
  char: string
  spawnedAt: number
  pendingBlank?: boolean
  cellColor: string
  glyphColor: string
}

const GLYPHS = Array.from(
  'いうえおかきくけこさしすせそたちつてとなにのはひへるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノ ∴∵░▒⊹✹✺✮♱⚥⚦☿⚢⚣☺☻♡♥X',
)

const BLANK_AFTER_MS = 820
const HARD_KILL_MS = 1050
const MAX_CELLS = 200
const BRUSH_RADIUS = 1.55

function ellipseRadius(angle: number, rx: number, ry: number): number {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return (rx * ry) / Math.sqrt((ry * c) ** 2 + (rx * s) ** 2)
}

function blobScale(angle: number): number {
  return (
    0.72
    + 0.28 * Math.sin(angle * 2.15 + 0.4)
    + 0.2 * Math.sin(angle * 3.4 - 1.1)
    + 0.12 * Math.sin(angle * 5.7 + 2.2)
    + (Math.random() - 0.5) * 0.22
  )
}

function pickPair(chroma: TicketTrailChroma): { cell: string; glyph: string } {
  if (chroma !== 'vip') {
    return {
      cell: 'var(--color-ticket-trail-cell)',
      glyph: 'var(--color-ticket-trail-glyph)',
    }
  }
  return vipTrailPairs[Math.floor(Math.random() * vipTrailPairs.length)]
    ?? vipTrailPairs[0]!
}

function pickChar(avoid?: string): string {
  let next = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '✦'
  let guard = 0
  while (avoid && next === avoid && guard++ < 10) {
    next = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '✦'
  }
  return next
}

function measureTokenPx(token: string, fallback: number): number {
  if (typeof document === 'undefined') return fallback
  const el = document.createElement('div')
  el.style.cssText =
    `position:absolute;left:-9999px;width:var(${token});visibility:hidden;pointer-events:none;`
  document.body.appendChild(el)
  const w = el.offsetWidth || fallback
  document.body.removeChild(el)
  return Math.max(4, w)
}

/**
 * Cursor-trail-style glyph cells that fill the halo around a card while hovered.
 * Coordinates are local to the trail plane so they ride the same 3D transform.
 */
export function useHoverGridTrail(
  active: Ref<boolean>,
  plane: Ref<HTMLElement | null>,
  hole: Ref<HTMLElement | null>,
  chroma: Ref<TicketTrailChroma>,
) {
  const cells = shallowRef<HoverTrailCell[]>([])
  const cellPx = ref(32)
  const gridKeyToId = new Map<string, number>()

  let nextId = 0
  let flameTimer: ReturnType<typeof setTimeout> | undefined
  let seedTimer: ReturnType<typeof setTimeout> | undefined
  let haloPx = 72

  function gridKey(c: number, r: number): string {
    return `${c},${r}`
  }

  function clear() {
    gridKeyToId.clear()
    cells.value = []
  }

  function trySpawn(c: number, r: number, ignite: number) {
    const planeEl = plane.value
    if (!planeEl) return
    const step = cellPx.value
    const cols = Math.ceil(planeEl.offsetWidth / step)
    const rows = Math.ceil(planeEl.offsetHeight / step)
    if (c < 0 || r < 0 || c >= cols || r >= rows) return
    if (Math.random() > ignite) return
    const k = gridKey(c, r)
    if (gridKeyToId.has(k)) return

    const id = ++nextId
    gridKeyToId.set(k, id)
    const pair = pickPair(chroma.value)
    cells.value = [...cells.value, {
      id,
      c,
      r,
      char: pickChar(),
      spawnedAt: Date.now(),
      cellColor: pair.cell,
      glyphColor: pair.glyph,
    }].slice(-MAX_CELLS)
  }

  function spawnBrush(cx: number, cy: number) {
    const r2 = BRUSH_RADIUS * BRUSH_RADIUS
    const ext = Math.ceil(BRUSH_RADIUS)
    for (let dr = -ext; dr <= ext; dr++) {
      for (let dc = -ext; dc <= ext; dc++) {
        const d2 = dc * dc + dr * dr
        if (d2 > r2) continue
        const dist = Math.sqrt(d2)
        const inward = 1 - dist / (BRUSH_RADIUS + 0.001)
        const flicker = 0.16 + inward * 0.68 + Math.random() * 0.24
        trySpawn(cx + dc, cy + dr, Math.min(0.97, flicker))
      }
    }
  }

  /** Polar splat: irregular blob around / behind the card, not a rectangular fill. */
  function spawnOrganicSplat() {
    const face = hole.value
    if (!face) return
    const step = cellPx.value
    const cx = (haloPx + face.offsetWidth / 2) / step
    const cy = (haloPx + face.offsetHeight / 2) / step
    const rx = face.offsetWidth / 2 / step
    const ry = face.offsetHeight / 2 / step
    const angle = Math.random() * Math.PI * 2
    const edge = ellipseRadius(angle, rx, ry)
    const spread = Math.max(2.2, (haloPx / step) * blobScale(angle))
    const roll = Math.random()
    let dist: number
    if (roll < 0.28) {
      dist = edge * (0.2 + Math.random() * 0.7)
    }
    else if (roll < 0.78) {
      dist = edge * (0.82 + Math.random() * 0.22) + Math.random() * spread * 0.42
    }
    else {
      dist = edge + spread * (0.28 + Math.random() * 0.85)
    }
    const jitter = 1.15
    spawnBrush(
      Math.round(cx + Math.cos(angle) * dist + (Math.random() - 0.5) * jitter),
      Math.round(cy + Math.sin(angle) * dist + (Math.random() - 0.5) * jitter),
    )
  }

  function burstFill() {
    const n = 52 + Math.floor(Math.random() * 18)
    for (let i = 0; i < n; i++) spawnOrganicSplat()
  }

  function seedHalo() {
    const n = 5 + Math.floor(Math.random() * 6)
    for (let i = 0; i < n; i++) spawnOrganicSplat()
  }

  function flameTick() {
    if (!cells.value.length) return
    const now = Date.now()
    const next: HoverTrailCell[] = []

    for (const cell of cells.value) {
      const age = now - cell.spawnedAt
      if (cell.pendingBlank || age >= HARD_KILL_MS) {
        gridKeyToId.delete(gridKey(cell.c, cell.r))
        continue
      }
      if (age >= BLANK_AFTER_MS) {
        next.push({ ...cell, char: ' ', pendingBlank: true })
        continue
      }
      if (Math.random() < 0.32) {
        next.push(cell)
        continue
      }
      next.push({ ...cell, char: pickChar(cell.char) })
    }

    cells.value = next
  }

  function scheduleFlame() {
    if (typeof window === 'undefined') return
    flameTimer = window.setTimeout(() => {
      flameTick()
      scheduleFlame()
    }, 22 + Math.random() * 75)
  }

  function scheduleSeed() {
    if (typeof window === 'undefined') return
    seedTimer = window.setTimeout(() => {
      if (active.value) seedHalo()
      scheduleSeed()
    }, 28 + Math.random() * 40)
  }

  function stopTimers() {
    if (flameTimer !== undefined) {
      window.clearTimeout(flameTimer)
      flameTimer = undefined
    }
    if (seedTimer !== undefined) {
      window.clearTimeout(seedTimer)
      seedTimer = undefined
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    cellPx.value = measureTokenPx('--cursor-trail-cell', 32)
    haloPx = measureTokenPx('--ticket-trail-halo', 72)
    scheduleFlame()
    scheduleSeed()
  })

  onUnmounted(() => {
    stopTimers()
    clear()
  })

  watch(active, (isActive) => {
    if (!isActive) return
    requestAnimationFrame(() => burstFill())
  })

  return { cells, cellPx }
}
