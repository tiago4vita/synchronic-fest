<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import type { TicketTrailChroma } from '~/data/tickets'

const props = defineProps<{
  active: boolean
  hole: HTMLElement | null
  chroma?: TicketTrailChroma
}>()

const plane = ref<HTMLElement | null>(null)
const chroma = computed(() => props.chroma ?? 'black')
const { cells, cellPx } = useHoverGridTrail(
  toRef(props, 'active'),
  plane,
  toRef(props, 'hole'),
  chroma,
)
</script>

<template>
  <div
    ref="plane"
    class="ticket-card-trail"
    aria-hidden="true"
  >
    <div
      v-for="cell in cells"
      :key="cell.id"
      class="ticket-card-trail__cell"
      :class="{ 'ticket-card-trail__cell--blank': cell.pendingBlank }"
      :style="{
        left: `${cell.c * cellPx}px`,
        top: `${cell.r * cellPx}px`,
        width: `${cellPx}px`,
        height: `${cellPx}px`,
        background: cell.cellColor,
        color: cell.glyphColor,
      }"
    >
      <span class="ticket-card-trail__glyph">{{ cell.char }}</span>
    </div>
  </div>
</template>

<style scoped>
.ticket-card-trail {
  position: absolute;
  z-index: 0;
  inset: calc(var(--ticket-trail-halo) * -1);
  overflow: visible;
  pointer-events: none;
  transform: translateZ(-3.25rem);
}

.ticket-card-trail__cell {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  background: var(--color-ticket-trail-cell);
  color: var(--color-ticket-trail-glyph);
}

.ticket-card-trail__cell--blank .ticket-card-trail__glyph {
  opacity: 0;
}

.ticket-card-trail__glyph {
  font-family: ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, "Segoe UI Symbol",
    "Noto Sans Symbols 2", sans-serif;
  font-size: var(--cursor-trail-cell);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .ticket-card-trail {
    display: none;
  }
}
</style>
