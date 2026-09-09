<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import ticketBg from '~/assets/vid/bg_mov.mp4'
import { ticketTiers } from '~/data/tickets'

const ORBIT_COPY = 'Choose your ticket and get ready for two unforgettable days of music'

const video = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  const el = video.value
  if (!el) return

  el.muted = true

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const sync = () => {
    if (motion.matches) {
      el.pause()
      return
    }
    void el.play()
  }

  sync()
  motion.addEventListener('change', sync)
  onUnmounted(() => motion.removeEventListener('change', sync))
})
</script>

<template>
  <section
    id="tickets"
    class="tickets"
    aria-labelledby="tickets-heading"
  >
    <div
      class="tickets__media"
      aria-hidden="true"
    >
      <video
        ref="video"
        class="tickets__video"
        :src="ticketBg"
        muted
        loop
        autoplay
        playsinline
        preload="auto"
        disablepictureinpicture
      />
    </div>

    <div
      class="tickets__orbit"
      aria-hidden="true"
    >
      <svg
        class="tickets__orbit-svg"
        viewBox="0 0 100 100"
      >
        <defs>
          <path
            id="tickets-orbit-path"
            d="M 50,50 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
          />
        </defs>
        <text
          class="tickets__orbit-text"
          dominant-baseline="middle"
        >
          <textPath
            href="#tickets-orbit-path"
            startOffset="0"
            textLength="314.16"
            lengthAdjust="spacing"
          >
            {{ ORBIT_COPY }} · {{ ORBIT_COPY }} ·
          </textPath>
        </text>
      </svg>
    </div>

    <div class="tickets__inner">
      <h2
        id="tickets-heading"
        class="sr-only"
      >
        {{ ORBIT_COPY }}
      </h2>

      <div class="tickets__grid">
        <TicketCard
          v-for="(ticket, index) in ticketTiers"
          :key="ticket.id"
          :ticket="ticket"
          :motion-index="index"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tickets {
  position: relative;
  z-index: 1;
  isolation: isolate;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  padding: var(--space-section) var(--space-md);
  background: var(--color-tickets-bg);
  color: var(--color-tickets-fg);
}

.tickets__media {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.tickets__video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: grayscale(100%);
  transition: filter 560ms var(--ease-out-expo);
}

.tickets:hover .tickets__video {
  filter: grayscale(0%);
}

.tickets__orbit {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: var(--ticket-orbit-size);
  height: var(--ticket-orbit-size);
  transform: translate(-50%, -50%);
  pointer-events: none;
  mix-blend-mode: difference;
  animation: tickets-orbit-spin var(--ticket-orbit-duration) linear infinite;
}

.tickets__orbit-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.tickets__orbit-text {
  font-family: var(--font-display);
  font-size: 0.295rem;
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.14px;
  fill: var(--color-tickets-fg);
}

.tickets__inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 90rem;
  margin: 0 auto;
}

.tickets__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, var(--ticket-card-max-width)));
  justify-content: center;
  align-items: start;
  gap: var(--ticket-gap);
  width: min(100%, var(--ticket-row-max));
  margin-inline: auto;
}

@keyframes tickets-orbit-spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tickets__video {
    transition: none;
  }

  .tickets__orbit {
    animation: none;
    transform: translate(-50%, -50%);
  }
}

@media (max-width: 48rem) {
  .tickets {
    min-height: unset;
    padding-block: var(--space-3xl);
  }

  .tickets__grid {
    grid-template-columns: minmax(0, var(--ticket-card-max-width));
    width: min(100%, var(--ticket-card-max-width));
    gap: var(--space-2xl);
  }
}
</style>
