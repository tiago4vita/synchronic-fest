<script setup lang="ts">
import { festival } from '~/data/site'
</script>

<template>
  <section class="festival-hero" aria-labelledby="hero-title">
    <ExpressionBackground />

    <div class="festival-hero__grain" aria-hidden="true" />
    <div class="festival-hero__grid" aria-hidden="true" />

    <div class="festival-hero__inner">
      <p class="festival-hero__eyebrow">
        <span class="festival-hero__eyebrow-accent">{{ festival.dates }}</span>
        <span class="festival-hero__eyebrow-muted">· {{ festival.city }}</span>
      </p>

      <h1 id="hero-title" class="festival-hero__title">
        <span class="festival-hero__name">{{ festival.name }}</span>
        <span class="festival-hero__suffix">{{ festival.nameSuffix }}</span>
      </h1>

      <p class="festival-hero__tagline">
        {{ festival.tagline }}
      </p>

      <p class="festival-hero__meta">
        {{ festival.location }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.festival-hero {
  position: relative;
  min-height: calc(100dvh - var(--ticker-height));
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
    linear-gradient(to right, var(--color-border-subtle) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-border-subtle) 1px, transparent 1px);
  background-size: 4rem 4rem;
  opacity: 0.35;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, black 20%, transparent 70%);
}

.festival-hero__inner {
  position: relative;
  z-index: 2;
  max-width: var(--content-max);
  width: 100%;
  text-align: center;
}

.festival-hero__eyebrow {
  margin: 0 0 var(--space-lg);
  font-size: var(--text-label);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}

.festival-hero__eyebrow-accent {
  color: var(--color-accent-magenta);
}

.festival-hero__eyebrow-muted {
  color: var(--color-fg-muted);
}

.festival-hero__title {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.15em 0.25em;
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-hero-xl);
  line-height: 0.92;
  letter-spacing: var(--letter-spacing-tight);
  text-transform: uppercase;
}

.festival-hero__name {
  color: var(--color-fg-primary);
}

.festival-hero__suffix {
  color: var(--color-fg-on-accent);
  background: var(--color-hero-accent);
  padding: 0 0.12em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

.festival-hero__tagline {
  margin: var(--space-xl) 0 0;
  font-size: var(--text-hero-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-fg-muted);
  max-width: 28ch;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.45;
}

.festival-hero__meta {
  margin: var(--space-lg) 0 0;
  font-size: var(--text-label);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  color: var(--color-fg-muted);
}

@media (prefers-reduced-motion: reduce) {
  .festival-hero__grid {
    opacity: 0.2;
  }
}
</style>
