<script setup lang="ts">
import { computed } from 'vue'
import { buildExpressionStream } from '~/data/expression'

const stream0 = computed(() => buildExpressionStream(0))
const stream1 = computed(() => buildExpressionStream(1))
const stream2 = computed(() => buildExpressionStream(2))
</script>

<template>
  <div class="expression-bg" aria-hidden="true">
    <!-- Barcode / scan lines -->
    <div class="expression-bg__scanlines" />

    <!-- Horizontal bands: overlapping, opposite directions -->
    <div class="expression-bg__band expression-bg__band--a">
      <div class="expression-bg__track expression-bg__track--left">
        <span class="expression-bg__text expression-bg__text--xl">{{ stream0 }}</span>
        <span class="expression-bg__text expression-bg__text--xl">{{ stream0 }}</span>
      </div>
    </div>

    <div class="expression-bg__band expression-bg__band--b">
      <div class="expression-bg__track expression-bg__track--right">
        <span class="expression-bg__text expression-bg__text--md">{{ stream1 }}</span>
        <span class="expression-bg__text expression-bg__text--md">{{ stream1 }}</span>
      </div>
    </div>

    <div class="expression-bg__band expression-bg__band--c">
      <div class="expression-bg__track expression-bg__track--left expression-bg__track--fast">
        <span class="expression-bg__text expression-bg__text--sm">{{ stream2 }}</span>
        <span class="expression-bg__text expression-bg__text--sm">{{ stream2 }}</span>
      </div>
    </div>

    <!-- Extra dense layer (offset vertical position) -->
    <div class="expression-bg__band expression-bg__band--d">
      <div class="expression-bg__track expression-bg__track--right expression-bg__track--mid">
        <span class="expression-bg__text expression-bg__text--md">{{ stream2 }}</span>
        <span class="expression-bg__text expression-bg__text--md">{{ stream2 }}</span>
      </div>
    </div>

    <div class="expression-bg__band expression-bg__band--e">
      <div class="expression-bg__track expression-bg__track--left expression-bg__track--fast">
        <span class="expression-bg__text expression-bg__text--md">{{ stream0 }}</span>
        <span class="expression-bg__text expression-bg__text--md">{{ stream0 }}</span>
      </div>
    </div>

    <div class="expression-bg__band expression-bg__band--f">
      <div class="expression-bg__track expression-bg__track--right expression-bg__track--slow">
        <span class="expression-bg__text expression-bg__text--sm">{{ stream1 }}</span>
        <span class="expression-bg__text expression-bg__text--sm">{{ stream1 }}</span>
      </div>
    </div>

    <!-- Vertical Japanese columns (scan-line / MV edge treatment) -->
    <div class="expression-bg__pillar expression-bg__pillar--left">
      <div class="expression-bg__pillar-scroll expression-bg__pillar-scroll--up">
        <p class="expression-bg__pillar-chunk">
          信号はノイズを切り裂く。　顔は最後のインターフェースだ。　光が曲がる場所で出会う。
        </p>
        <p class="expression-bg__pillar-chunk">
          信号はノイズを切り裂く。　顔は最後のインターフェースだ。　光が曲がる場所で出会う。
        </p>
        <p class="expression-bg__pillar-chunk">
          信号はノイズを切り裂く。　顔は最後のインターフェースだ。　光が曲がる場所で出会う。
        </p>
      </div>
    </div>

    <div class="expression-bg__pillar expression-bg__pillar--right">
      <div class="expression-bg__pillar-scroll expression-bg__pillar-scroll--down">
        <p class="expression-bg__pillar-chunk">
          信号はノイズを切り裂く。　顔は最後のインターフェースだ。　光が曲がる場所で出会う。
        </p>
        <p class="expression-bg__pillar-chunk">
          信号はノイズを切り裂く。　顔は最後のインターフェースだ。　光が曲がる場所で出会う。
        </p>
        <p class="expression-bg__pillar-chunk">
          信号はノイズを切り裂く。　顔は最後のインターフェースだ。　光が曲がる場所で出会う。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expression-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.expression-bg__scanlines {
  position: absolute;
  inset: 0;
  opacity: 0.52;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(0, 0, 0, 0.045) 1px,
    rgba(0, 0, 0, 0.045) 2px
  );
  mix-blend-mode: multiply;
}

.expression-bg__band {
  position: absolute;
  left: -5%;
  width: 110%;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.expression-bg__band--a {
  top: 5%;
  transform: rotate(-1.5deg);
}

.expression-bg__band--b {
  top: 24%;
  transform: rotate(0.8deg);
}

.expression-bg__band--c {
  top: 42%;
  transform: rotate(-0.6deg);
}

.expression-bg__band--d {
  top: 58%;
  transform: rotate(1.2deg);
  opacity: 0.95;
}

.expression-bg__band--e {
  top: 74%;
  transform: rotate(-0.35deg);
  opacity: 0.92;
}

.expression-bg__band--f {
  top: 88%;
  transform: rotate(0.55deg);
  opacity: 0.88;
}

.expression-bg__track {
  display: flex;
  width: max-content;
  font-family: var(--font-expression);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--color-expression-ink);
  will-change: transform;
}

.expression-bg__track--left {
  animation: expr-slide-left var(--expression-duration-slow) linear infinite;
}

.expression-bg__track--right {
  animation: expr-slide-right var(--expression-duration-mid) linear infinite;
}

.expression-bg__track--fast {
  animation-duration: var(--expression-duration-fast);
}

.expression-bg__track--mid {
  animation-duration: var(--expression-duration-mid);
}

.expression-bg__track--slow {
  animation-duration: var(--expression-duration-slow);
}

.expression-bg__text {
  padding-right: var(--space-lg);
}

.expression-bg__text--xl {
  font-size: var(--text-expression-xl);
}

.expression-bg__text--md {
  font-size: var(--text-expression-md);
  color: var(--color-expression-ink-strong);
}

.expression-bg__text--sm {
  font-size: clamp(0.9rem, 2.15vw, 1.2rem);
  font-weight: var(--font-weight-semibold);
}

.expression-bg__pillar {
  position: absolute;
  top: 0;
  bottom: 0;
  width: clamp(2.35rem, 5.75vw, 3.85rem);
  overflow: hidden;
  opacity: 0.68;
}

.expression-bg__pillar--left {
  left: 0;
}

.expression-bg__pillar--right {
  right: 0;
}

.expression-bg__pillar-scroll {
  display: flex;
  flex-direction: column;
  will-change: transform;
  animation: expr-pillar-up var(--expression-duration-vertical) linear infinite;
}

.expression-bg__pillar-scroll--down {
  animation-name: expr-pillar-down;
}

.expression-bg__pillar-chunk {
  margin: 0;
  flex-shrink: 0;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: var(--font-expression);
  font-size: clamp(0.72rem, 1.45vw, 1rem);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.16em;
  line-height: 1.55;
  color: var(--color-expression-ink-strong);
  padding-bottom: var(--space-xl);
}

@keyframes expr-slide-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes expr-slide-right {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes expr-pillar-up {
  from {
    transform: translateY(0);
  }
  to {
    /* Three pillar chunks → step by one third for a seamless loop */
    transform: translateY(-33.333333%);
  }
}

@keyframes expr-pillar-down {
  from {
    transform: translateY(-66.666666%);
  }
  to {
    transform: translateY(-33.333333%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .expression-bg__track,
  .expression-bg__pillar-scroll,
  .expression-bg__pillar-scroll--down {
    animation-play-state: paused;
  }

  .expression-bg__band--a {
    opacity: 0.5;
  }
}
</style>
