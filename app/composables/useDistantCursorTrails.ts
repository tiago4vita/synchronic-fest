import { computed, onMounted, onUnmounted, shallowRef, type Ref } from 'vue'

export interface DistantTrailCell {
  id: number
  layerId: number
  x: number
  y: number
  char: string
  spawnedAt: number
  pendingBlank?: boolean
}

export interface DistantTrailLayer {
  id: number
  opacity: number
  /** Camera FOV — unique value in the min–max perspective range */
  perspective: string
  /** Vanishing-point sit in the section */
  origin: string
  transform: string
}

const GLYPHS = Array.from(
  'いうえおかきくけこさしすせそたちつてとなにのはひへるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノ ∴∵░▒⊹✹✺✮X+<>',
)

const BLANK_AFTER_MS = 1200
const HARD_KILL_MS = 980
const MAX_CELLS = 300
const SPAWN_GAP = 0.003

/**
 * Five cameras stepped across the perspective range (tight FOV → shallow).
 * Each uses a different vanish origin + primary axis so they don't share a sit.
 */
export const DISTANT_TRAIL_LAYERS: DistantTrailLayer[] = [
  {
    id: 2,
    opacity: 0.4,
    perspective: '840px',
    origin: '100% 55%',
    transform: 'rotateY(-18deg) rotateX(-16deg) translateX(-16%) rotateZ(6deg)',
  },
  {
    id: 3,
    opacity: 0.38,
    perspective: '1080px',
    origin: '48% 0%',
    transform: 'rotateX(-36deg) rotateZ(4deg) translateY(-8%)',
  },
  {
    id: 4,
    opacity: 0.5,
    perspective: '1480px',
    origin: '18% 32%',
    transform: 'rotateX(28deg) rotateY(-18deg) rotateZ(-2deg) scale(0.78)',
  },
]

interface Agent {
  layerId: number
  x: number
  y: number
  tx: number
  ty: number
  speed: number
  restUntil: number
  burstUntil: number
  lastSpawnX: number
  lastSpawnY: number
  asleep: boolean
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function pickGlyph(avoid?: string): string {
  let next = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '✦'
  let guard = 0
  while (avoid && next === avoid && guard++ < 8) {
    next = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '✦'
  }
  return next
}

function pickTarget(agent: Agent) {
  agent.tx = rand(-0.14, 0.68)
  agent.ty = rand(-0.2, 0.28)
  agent.speed = rand(0.4, 1.0)
}

function makeAgent(layerId: number, now: number): Agent {
  const x = rand(0.08, 0.32)
  const y = rand(0.08, 0.32)
  const agent: Agent = {
    layerId,
    x,
    y,
    tx: x,
    ty: y,
    speed: rand(0.7, 1.0),
    restUntil: now + rand(0, 3600),
    burstUntil: 0,
    lastSpawnX: x,
    lastSpawnY: y,
    asleep: true,
  }
  pickTarget(agent)
  return agent
}

/**
 * Ambient cursor-like glyph trails for the lineup field.
 * Client-only: RAF + IntersectionObserver. No-ops under prefers-reduced-motion.
 */
export function useDistantCursorTrails(root: Ref<HTMLElement | null>) {
  const cells = shallowRef<DistantTrailCell[]>([])
  const cellsByLayer = computed(() => {
    const grouped: Record<number, DistantTrailCell[]> = {}
    for (const layer of DISTANT_TRAIL_LAYERS) grouped[layer.id] = []
    for (const cell of cells.value) {
      grouped[cell.layerId]?.push(cell)
    }
    return grouped
  })

  let agents: Agent[] = []
  let raf = 0
  let lastTs = 0
  let nextId = 0
  let visible = false
  let observer: IntersectionObserver | undefined

  function spawnAt(agent: Agent, now: number) {
    const dx = agent.x - agent.lastSpawnX
    const dy = agent.y - agent.lastSpawnY
    if (Math.hypot(dx, dy) < SPAWN_GAP) return

    agent.lastSpawnX = agent.x
    agent.lastSpawnY = agent.y

    const jitter = 0.008
    const added: DistantTrailCell[] = [{
      id: ++nextId,
      layerId: agent.layerId,
      x: agent.x + rand(-jitter, jitter),
      y: agent.y + rand(-jitter, jitter),
      char: pickGlyph(),
      spawnedAt: now,
    }]

    if (Math.random() < 0.28) {
      added.push({
        id: ++nextId,
        layerId: agent.layerId,
        x: agent.x + rand(-0.016, 0.016),
        y: agent.y + rand(-0.016, 0.016),
        char: pickGlyph(),
        spawnedAt: now,
      })
    }

    cells.value = [...cells.value, ...added].slice(-MAX_CELLS)
  }

  function stepAgents(dt: number, now: number) {
    for (const agent of agents) {
      if (now < agent.restUntil) {
        agent.asleep = true
        continue
      }

      if (agent.asleep) {
        agent.asleep = false
        agent.x = rand(0.06, 0.94)
        agent.y = rand(0.08, 0.92)
        agent.lastSpawnX = agent.x
        agent.lastSpawnY = agent.y
        pickTarget(agent)
      }

      const dx = agent.tx - agent.x
      const dy = agent.ty - agent.y
      const dist = Math.hypot(dx, dy)

      if (dist < 0.014) {
        if (Math.random() < 0.45) {
          agent.restUntil = now + rand(280, 1600)
          agent.asleep = true
          continue
        }
        pickTarget(agent)
        if (Math.random() < 0.22) {
          agent.burstUntil = now + rand(180, 420)
          agent.speed = rand(7, 11)
        }
        else {
          agent.speed = rand(1.8, 4.2)
        }
      }

      const k = 1 - Math.exp(-agent.speed * dt)
      agent.x += dx * k + rand(-0.0012, 0.0012)
      agent.y += dy * k + rand(-0.0012, 0.0012)
      spawnAt(agent, now)
    }
  }

  function ageCells(now: number) {
    if (!cells.value.length) return
    const next: DistantTrailCell[] = []
    for (const cell of cells.value) {
      const age = now - cell.spawnedAt
      if (cell.pendingBlank || age >= HARD_KILL_MS) continue
      if (age >= BLANK_AFTER_MS) {
        next.push({ ...cell, char: ' ', pendingBlank: true })
        continue
      }
      if (Math.random() < 0.38) {
        next.push(cell)
        continue
      }
      next.push({ ...cell, char: pickGlyph(cell.char) })
    }
    cells.value = next
  }

  function tick(ts: number) {
    const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0.052
    lastTs = ts
    if (visible) {
      stepAgents(dt, ts)
      ageCells(ts)
    }
    raf = requestAnimationFrame(tick)
  }

  onMounted(() => {
    if (typeof window === 'undefined' || typeof matchMedia === 'undefined') return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const now = performance.now()
    agents = DISTANT_TRAIL_LAYERS.map((layer) => makeAgent(layer.id, now))

    const el = root.value
    if (el && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          visible = entries.some((entry) => entry.isIntersecting)
        },
        { root: null, threshold: 0.08 },
      )
      observer.observe(el)
    }
    else {
      visible = true
    }

    raf = requestAnimationFrame(tick)
  })

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    observer?.disconnect()
    cells.value = []
    agents = []
  })

  return { layers: DISTANT_TRAIL_LAYERS, cellsByLayer }
}
