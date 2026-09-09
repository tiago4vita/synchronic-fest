<script setup lang="ts">
import { ticketTiers } from '~/data/tickets'
</script>

<template>
  <section
    id="tickets"
    class="tickets"
    aria-labelledby="tickets-heading"
  >
    <div class="tickets__inner">
      <header class="tickets__intro">
        <h2
          id="tickets-heading"
          class="tickets__title"
        >
          Don't miss the <em>premiere</em> edition
        </h2>
        <p class="tickets__lede">
          Choose your ticket and get ready for two <em>unforgettable</em> days of music and connection.
        </p>
      </header>

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
  min-height: 100dvh;
  display: flex;
  align-items: center;
  padding: var(--space-section) var(--space-md);
  background: var(--color-tickets-bg);
  color: var(--color-tickets-fg);
}

.tickets__inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 90rem;
  margin: 0 auto;
}

.tickets__intro {
  text-align: center;
  margin: 0 auto var(--space-2xl);
}

.tickets__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-tickets-title);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letter-spacing-tight);
  line-height: 1.05;
  color: var(--color-tickets-fg);
}

.tickets__title em,
.tickets__lede em {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: var(--font-weight-regular);
  color: var(--color-tickets-accent);
}

.tickets__lede {
  margin: var(--space-md) auto 0;
  max-width: 42rem;
  font-family: var(--font-body);
  font-size: var(--text-tickets-lede);
  font-weight: var(--font-weight-regular);
  line-height: 1.45;
  color: var(--color-tickets-fg);
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

@media (max-width: 48rem) {
  .tickets {
    min-height: unset;
    padding-block: var(--space-3xl);
  }

  .tickets__title {
    font-size: clamp(2.25rem, 11vw, 3.5rem);
  }

  .tickets__grid {
    grid-template-columns: minmax(0, var(--ticket-card-max-width));
    width: min(100%, var(--ticket-card-max-width));
    gap: var(--space-2xl);
  }
}
</style>
