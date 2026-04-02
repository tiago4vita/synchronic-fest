<script setup lang="ts">
import { computed } from 'vue'
import { tickerAnnouncements } from '~/data/site'

const props = withDefaults(
  defineProps<{
    /** Announcement strings; defaults to curated fictional feed */
    items?: string[]
  }>(),
  {
    items: undefined,
  },
)

const feed = computed(() => props.items ?? tickerAnnouncements)

const crawlText = computed(() =>
  feed.value.map((s) => s.trim()).join('     ·     '),
)

const srSummary = computed(() => feed.value.join('. '))
</script>

<template>
  <div
    class="announcement-ticker"
    role="region"
    aria-label="Festival announcements"
  >
    <p class="sr-only">
      Latest announcements: {{ srSummary }}
    </p>

    <div class="announcement-ticker__bar" aria-hidden="true">
      <div class="announcement-ticker__edge announcement-ticker__edge--left" />
      <div class="announcement-ticker__marquee">
        <div class="announcement-ticker__track">
          <span class="announcement-ticker__segment">
            {{ crawlText }}
          </span>
          <span class="announcement-ticker__segment">
            {{ crawlText }}
          </span>
        </div>
      </div>
      <div class="announcement-ticker__edge announcement-ticker__edge--right" />
    </div>
  </div>
</template>

<style scoped>
.announcement-ticker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.announcement-ticker__bar {
  display: flex;
  align-items: stretch;
  min-height: var(--ticker-height);
  background: var(--color-ticker-bg);
  border-top: 2px solid var(--color-ticker-accent);
  color: var(--color-ticker-fg);
}

.announcement-ticker__edge {
  flex: 0 0 0.35rem;
  background: var(--color-ticker-accent);
  opacity: 0.9;
}

.announcement-ticker__marquee {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.announcement-ticker__track {
  display: flex;
  width: max-content;
  animation: ticker-marquee var(--ticker-duration) linear infinite;
  font-family: var(--font-display);
  font-size: var(--text-ticker);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  padding: var(--space-sm) 0;
}

.announcement-ticker__segment {
  padding-right: var(--space-3xl);
}

@keyframes ticker-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .announcement-ticker__track {
    animation: none;
    flex-wrap: wrap;
    white-space: normal;
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    justify-content: center;
    text-align: center;
  }

  .announcement-ticker__segment {
    padding-right: 0;
  }

  .announcement-ticker__segment + .announcement-ticker__segment {
    display: none;
  }
}
</style>
