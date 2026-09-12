<script setup lang="ts">
import { computed } from 'vue'
import { festival, portfolio } from '~/data/site'

const sourceCredits = computed(() =>
  portfolio.credits.filter((item) => item.kind === 'source'),
)
const referenceCredits = computed(() =>
  portfolio.credits.filter((item) => item.kind === 'reference'),
)
</script>

<template>
  <footer
    class="site-footer"
    aria-labelledby="site-footer-heading"
  >
    <div class="site-footer__inner">
      <p
        id="site-footer-heading"
        class="site-footer__brand"
      >
        {{ festival.name }}
      </p>
      <p class="site-footer__meta">
        {{ festival.dates }} {{ festival.yearShort }} · {{ festival.city }} · {{ festival.location }}
      </p>
      <p class="site-footer__disclaimer">
        This is a <em>portfolio project</em>, not a real festival. No tickets, no door, no afters.
        Built by
        <span class="site-footer__author">{{ portfolio.author }}</span>.
      </p>

      <p class="site-footer__links">
        <a
          :href="portfolio.github"
          target="_blank"
          rel="noopener noreferrer"
        >GitHub</a>
        <a :href="`mailto:${portfolio.email}`">{{ portfolio.email }}</a>
      </p>

      <details class="site-footer__credits">
        <summary>
          Credits
          <span
            class="site-footer__credits-mark"
            aria-hidden="true"
          />
        </summary>
        <ul>
          <li
            v-for="item in sourceCredits"
            :key="`${item.credit}-${item.work}`"
          >
            <span>{{ item.credit }}</span>
            <a
              v-if="item.href"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
            >{{ item.work }}</a>
            <span v-else>{{ item.work }}</span>
          </li>
        </ul>
        <p class="site-footer__credits-label">References</p>
        <ul>
          <li
            v-for="item in referenceCredits"
            :key="`${item.credit}-${item.work}`"
          >
            <span>{{ item.credit }}</span>
            <a
              v-if="item.href"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
            >{{ item.work }}</a>
            <span v-else>{{ item.work }}</span>
          </li>
        </ul>
      </details>

      <p class="site-footer__fonts">
        <span>Type</span>
        {{ portfolio.fonts.join(' · ') }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  z-index: 1;
  background: var(--color-footer-bg);
  color: var(--color-footer-fg);
  border-top: 2px solid var(--color-ticker-accent);
  padding: var(--space-2xl) var(--space-md) var(--space-3xl);
}

.site-footer__inner {
  max-width: var(--content-max);
  margin: 0 auto;
}

.site-footer__brand {
  margin: 0;
  font-family: var(--font-led);
  font-size: clamp(1.75rem, 5vw, 3rem);
  letter-spacing: var(--letter-spacing-tight);
  text-transform: uppercase;
  line-height: 1;
}

.site-footer__meta {
  margin: var(--space-sm) 0 0;
  font-family: var(--font-label);
  font-size: var(--text-label);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  color: var(--color-footer-muted);
}

.site-footer__disclaimer {
  margin: var(--space-lg) 0 0;
  max-width: 46rem;
  font-size: var(--text-tickets-lede);
  line-height: 1.45;
}

.site-footer__disclaimer em {
  font-style: italic;
  color: var(--color-accent-magenta);
}

.site-footer__author {
  font-weight: var(--font-weight-bold);
}

.site-footer__links {
  margin: var(--space-lg) 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md) var(--space-xl);
  font-family: var(--font-label);
  font-size: var(--text-label);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.site-footer__links a {
  color: inherit;
  text-underline-offset: 0.2em;
}

.site-footer__links a:hover,
.site-footer__links a:focus-visible {
  color: var(--color-accent-magenta);
}

.site-footer__credits {
  margin: var(--space-xl) 0 0;
}

.site-footer__credits summary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  list-style: none;
  font-family: var(--font-label);
  font-size: var(--text-label);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}

.site-footer__credits summary::-webkit-details-marker {
  display: none;
}

.site-footer__credits-mark::before {
  content: "+";
  color: var(--color-accent-magenta);
}

.site-footer__credits[open] .site-footer__credits-mark::before {
  content: "−";
}

.site-footer__credits ul {
  margin: var(--space-md) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-sm);
  max-width: 36rem;
}

.site-footer__credits-label {
  margin: var(--space-lg) 0 0;
  font-family: var(--font-label);
  font-size: var(--text-label);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  color: var(--color-footer-muted);
}

.site-footer__credits li {
  display: grid;
  grid-template-columns: minmax(8rem, 12rem) 1fr;
  gap: var(--space-sm);
  font-size: var(--text-label);
  letter-spacing: 0.04em;
}

.site-footer__credits li span:first-child {
  text-transform: uppercase;
  color: var(--color-footer-muted);
}

.site-footer__credits a {
  color: inherit;
  text-underline-offset: 0.2em;
}

.site-footer__credits a:hover,
.site-footer__credits a:focus-visible {
  color: var(--color-accent-magenta);
}

.site-footer__fonts {
  margin: var(--space-xl) 0 0;
  font-size: var(--text-label);
  letter-spacing: 0.04em;
  color: var(--color-footer-muted);
  line-height: 1.5;
}

.site-footer__fonts span {
  display: block;
  margin-bottom: var(--space-xs);
  font-family: var(--font-label);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  color: var(--color-footer-fg);
}
</style>
