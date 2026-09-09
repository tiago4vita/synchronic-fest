<script setup lang="ts">
import { ref } from 'vue'
import type { TicketTier } from '~/data/tickets'

const props = defineProps<{
  ticket: TicketTier
  motionIndex: number
}>()

const { root, active, faceStyle, onPointerEnter, onPointerMove, onPointerLeave } =
  usePointerTilt()

const face = ref<HTMLElement | null>(null)

const delayStyle = {
  '--ticket-motion-delay': `${props.motionIndex * 0.28}s`,
} as Record<string, string>
</script>

<template>
  <article
    class="ticket-card"
    :class="{
      'ticket-card--active': active,
      'ticket-card--holo': ticket.finish === 'holo',
    }"
    :style="delayStyle"
    :aria-label="ticket.label"
  >
    <div
      ref="root"
      class="ticket-card__scene"
      @pointerenter="onPointerEnter"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <div class="ticket-card__float">
        <div
          class="ticket-card__rig"
          :style="faceStyle"
        >
          <div class="ticket-card__stack">
            <TicketCardTrail
              :active="active"
              :hole="face"
              :chroma="ticket.finish === 'holo' ? 'vip' : 'black'"
            />
            <div
              ref="face"
              class="ticket-card__face"
            >
              <img
                class="ticket-card__art"
                :src="ticket.image"
                alt=""
                width="335"
                height="494"
                draggable="false"
              >
              <span
                class="ticket-card__glint"
                aria-hidden="true"
              />
            </div>
          </div>
          <p
            class="ticket-card__price"
            aria-hidden="true"
          >
            {{ ticket.priceLabel }}
          </p>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.ticket-card {
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.ticket-card--active {
  z-index: 5;
}

.ticket-card__scene {
  width: 100%;
  overflow: visible;
  perspective: var(--ticket-perspective);
  perspective-origin: 50% 45%;
  cursor: pointer;
}

.ticket-card__float {
  width: 100%;
  overflow: visible;
  animation: ticket-idle 3.2s var(--ease-sharp) var(--ticket-motion-delay, 0s) infinite;
  transform-style: preserve-3d;
  pointer-events: none;
}

.ticket-card__rig {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: visible;
  transform-style: preserve-3d;
  transform-origin: center 42%;
  transform: rotateX(0deg) rotateY(0deg);
}

.ticket-card__stack {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: visible;
  transform-style: preserve-3d;
}

.ticket-card:not(.ticket-card--active) .ticket-card__rig {
  transition: transform var(--motion-base) var(--ease-out-expo);
}

.ticket-card__face {
  position: relative;
  z-index: 2;
  display: block;
  width: 100%;
  aspect-ratio: 335 / 494;
  height: auto;
  border-radius: var(--ticket-card-radius);
  transform: translateZ(1.25rem);
  transform-style: preserve-3d;
  box-shadow: 0 0.85rem 1.75rem rgb(0 0 0 / 0.38);
  overflow: hidden;
  pointer-events: none;
  transition: box-shadow var(--motion-base) var(--ease-out-expo);
}

.ticket-card--active .ticket-card__face {
  box-shadow:
    0 1.65rem 2.8rem rgb(0 0 0 / 0.55),
    0 0 0 0.08rem color-mix(in srgb, var(--color-tickets-fg) 18%, transparent);
}

.ticket-card__art {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  pointer-events: none;
  user-select: none;
}

.ticket-card__glint {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  overflow: hidden;
}

.ticket-card__glint::after {
  content: "";
  position: absolute;
  top: -20%;
  bottom: -20%;
  left: 0;
  width: 42%;
  background: linear-gradient(
    105deg,
    transparent 0%,
    rgb(255 255 255 / 0) 38%,
    rgb(255 255 255 / 0.28) 50%,
    rgb(255 255 255 / 0) 62%,
    transparent 100%
  );
  transform: translateX(-140%) skewX(-18deg);
  animation: ticket-glint 4.6s var(--ease-sharp) var(--ticket-motion-delay) infinite;
}

.ticket-card--holo .ticket-card__glint::after {
  width: 55%;
  background: linear-gradient(
    105deg,
    transparent 0%,
    color-mix(in srgb, var(--color-accent-magenta) 0%, transparent) 32%,
    color-mix(in srgb, var(--color-accent-cyan) 45%, white) 48%,
    color-mix(in srgb, var(--color-accent-magenta) 40%, white) 56%,
    transparent 72%
  );
}

.ticket-card__price {
  position: relative;
  z-index: 2;
  margin: var(--space-md) 0 0;
  font-family: var(--font-body);
  font-size: var(--text-tickets-price);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.04em;
  color: var(--color-tickets-fg);
  transform: translateZ(1.25rem);
  background-color: var(--color-tickets-bg);
}

@keyframes ticket-idle {
  0%,
  100% {
    transform: rotateY(-2.1deg);
  }
  50% {
    transform: rotateY(2.1deg);
  }
}

@keyframes ticket-glint {
  0%,
  62% {
    transform: translateX(-140%) skewX(-18deg);
  }
  78% {
    transform: translateX(240%) skewX(-18deg);
  }
  100% {
    transform: translateX(240%) skewX(-18deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticket-card__float,
  .ticket-card__glint::after {
    animation: none;
  }

  .ticket-card__scene {
    cursor: default;
  }
}
</style>
