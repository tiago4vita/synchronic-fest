<script setup lang="ts">
/**
 * Decorative distant cursor echoes behind the lineup type.
 * Client-only (RAF). Lives above ExpressionBackground, below lineup inner.
 */
const root = ref<HTMLElement | null>(null)
const { layers, cellsByLayer } = useDistantCursorTrails(root)
</script>

<template>
  <div
    ref="root"
    class="lineup-distant-trails"
    aria-hidden="true"
  >
    <div
      v-for="layer in layers"
      :key="layer.id"
      class="lineup-distant-trails__camera"
      :style="{
        perspective: layer.perspective,
        perspectiveOrigin: layer.origin,
      }"
    >
      <div
        class="lineup-distant-trails__plane"
        :style="{
          opacity: layer.opacity,
          transform: layer.transform,
        }"
      >
        <div
          v-for="cell in cellsByLayer[layer.id]"
          :key="cell.id"
          class="lineup-distant-trails__cell"
          :class="{ 'lineup-distant-trails__cell--blank': cell.pendingBlank }"
          :style="{ left: `${cell.x * 100}%`, top: `${cell.y * 100}%` }"
        >
          <span class="lineup-distant-trails__glyph">{{ cell.char }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lineup-distant-trails {
  position: absolute;
  inset: 0;
  z-index: var(--lineup-distant-trail-z);
  pointer-events: none;
  overflow: hidden;
}

.lineup-distant-trails__camera {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.lineup-distant-trails__plane {
  position: absolute;
  inset: -28%;
  width: 256%;
  height: 256%;
  transform-style: preserve-3d;
}

.lineup-distant-trails__cell {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--lineup-distant-trail-cell);
  height: var(--lineup-distant-trail-cell);
  margin: 0;
  padding: 0;
  background: var(--color-distant-trail-cell-bg);
  color: var(--color-distant-trail-glyph);
  transform: translate(-50%, -50%);
}

.lineup-distant-trails__cell--blank .lineup-distant-trails__glyph {
  opacity: 1;
}

.lineup-distant-trails__glyph {
  font-family: var(--font-pixel), ui-monospace, sans-serif;
  font-size: var(--lineup-distant-trail-cell);
  font-weight: var(--font-weight-regular);
  line-height: 1;
  letter-spacing: 0;
  user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .lineup-distant-trails {
    display: none;
  }
}
</style>
