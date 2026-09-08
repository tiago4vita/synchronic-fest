<script setup lang="ts">
import { festival } from '~/data/site'
</script>

<template>
  <section
    id="site-hero"
    class="festival-hero"
    aria-labelledby="hero-title"
  >
    <ExpressionBackground />

    <div class="festival-hero__grain" aria-hidden="true" />
    <div class="festival-hero__grid" aria-hidden="true" />

    <div class="festival-hero__inner">
      <h1 id="hero-title" class="festival-hero__title">
        <span class="festival-hero__name">{{ festival.name }}</span>
      </h1>

      <p class="sr-only">20–21 November 2026, Berlin</p>
      <div
        class="festival-hero__dates"
        aria-hidden="true"
      >
        <FestivalDateLock
          v-for="night in festival.nights"
          :key="night.day"
          :day="night.day"
          :ordinal="night.ordinal"
          :month="festival.monthShort"
          :year="festival.yearShort"
          :city="festival.city"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.festival-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl) var(--space-md) var(--space-xl);
  overflow: hidden;
}

.festival-hero__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: var(--grain-opacity);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

.festival-hero__grid {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image:
    linear-gradient(to right, var(--color-ui-grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-ui-grid-line) 1px, transparent 1px);
  background-size: 4rem 4rem;
  opacity: 0.35;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, black 20%, transparent 70%);
}

.festival-hero__inner {
  position: relative;
  z-index: 2;
  width: 100%;
  text-align: center;
}

.festival-hero__title {
  margin: 0;
  line-height: 0.92;
  letter-spacing: var(--letter-spacing-tight);
  text-transform: uppercase;
}

.festival-hero__name {
  font-family: var(--font-led);
  font-weight: var(--font-weight-regular);
  font-size: var(--text-hero-name);
  color: var(--color-accent-magenta);
}

.festival-hero__dates {
  margin: var(--space-xl) 0 0;
  display: grid;
  justify-content: center;
}

@media (prefers-reduced-motion: reduce) {
  .festival-hero__grid {
    opacity: 0.2;
  }
}
</style>
