import { onUnmounted, ref, type Ref } from 'vue'

export interface TicketInkStamp {
  id: number
  x: string
  y: string
  size: string
}

const SPAWN_GAP_MS = 26
const LIFE_MS = 520
const MAX_STAMPS = 18

/**
 * Black ink stamps that spawn around a hovered ticket, sitting in a local
 * layer larger than the card so they cover the surroundings.
 */
export function useTicketInkTrail(root: Ref<HTMLElement | null>) {
  const stamps = ref<TicketInkStamp[]>([])
  let nextId = 0
  let lastSpawn = 0
  const timers = new Set<ReturnType<typeof setTimeout>>()

  function spawnFromEvent(event: PointerEvent) {
    const el = root.value
    if (!el) return

    const now = performance.now()
    if (now - lastSpawn < SPAWN_GAP_MS) return
    lastSpawn = now

    const rect = el.getBoundingClientRect()
    const nx = (event.clientX - rect.left) / Math.max(rect.width, 1)
    const ny = (event.clientY - rect.top) / Math.max(rect.height, 1)
    const id = ++nextId

    stamps.value.push({
      id,
      x: `${nx * 100 + (Math.random() - 0.5) * 86}%`,
      y: `${ny * 100 + (Math.random() - 0.5) * 86}%`,
      size: `${52 + Math.random() * 58}%`,
    })

    if (stamps.value.length > MAX_STAMPS) {
      stamps.value.shift()
    }

    const timer = window.setTimeout(() => {
      stamps.value = stamps.value.filter((stamp) => stamp.id !== id)
      timers.delete(timer)
    }, LIFE_MS)
    timers.add(timer)
  }

  function clear() {
    for (const timer of timers) window.clearTimeout(timer)
    timers.clear()
    stamps.value = []
  }

  function burst() {
    for (let i = 0; i < 7; i++) {
      const id = ++nextId
      stamps.value.push({
        id,
        x: `${50 + (Math.random() - 0.5) * 96}%`,
        y: `${50 + (Math.random() - 0.5) * 96}%`,
        size: `${58 + Math.random() * 54}%`,
      })
      const timer = window.setTimeout(() => {
        stamps.value = stamps.value.filter((stamp) => stamp.id !== id)
        timers.delete(timer)
      }, LIFE_MS + i * 36)
      timers.add(timer)
    }
  }

  onUnmounted(clear)

  return { stamps, spawnFromEvent, clear, burst }
}
