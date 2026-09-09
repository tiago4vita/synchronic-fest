import { computed, onMounted, onUnmounted, ref } from 'vue'

/**
 * Pointer-driven 3D tilt for a card face. Disabled when the pointer is coarse
 * or the user prefers reduced motion. Client-only listeners (SSR-safe defaults).
 */
export function usePointerTilt(maxDeg = 14) {
  const root = ref<HTMLElement | null>(null)
  const rotateX = ref(0)
  const rotateY = ref(0)
  const active = ref(false)
  const enabled = ref(false)

  onMounted(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)')

    const sync = () => {
      enabled.value = fineHover.matches && !motion.matches
      if (!enabled.value) reset()
    }

    sync()
    motion.addEventListener('change', sync)
    fineHover.addEventListener('change', sync)

    onUnmounted(() => {
      motion.removeEventListener('change', sync)
      fineHover.removeEventListener('change', sync)
    })
  })

  function reset() {
    rotateX.value = 0
    rotateY.value = 0
    active.value = false
  }

  function onPointerEnter() {
    if (!enabled.value) return
    active.value = true
  }

  function onPointerMove(event: PointerEvent) {
    if (!enabled.value) return
    const el = root.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const nx = Math.min(1, Math.max(0, px))
    const ny = Math.min(1, Math.max(0, py))

    rotateY.value = (nx - 0.5) * 2 * maxDeg
    rotateX.value = (0.5 - ny) * 2 * maxDeg
    active.value = true
  }

  function onPointerLeave() {
    reset()
  }

  const faceStyle = computed(() => ({
    transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
  }))

  return {
    root,
    active,
    enabled,
    faceStyle,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
  }
}
