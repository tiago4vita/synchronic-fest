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
