<script setup lang="ts">
import ExpressionBackground from '~/components/expression-background.vue'
import LineupSideStreams from '~/components/lineup-side-streams.vue'
import { festival } from '~/data/site'
import { lineupDays, type LineupStage } from '~/data/lineup'

/** Split on b2b (case-insensitive); re-insert with primary accent (magenta) in template */
function b2bParts(displayName: string): string[] {
  return displayName.split(/\s+b2b\s+/i)
}

function nightOrdinal(day: number): string {
  return festival.nights.find((night) => night.day === day)?.ordinal ?? 'TH'
}

function stageLetter(stage: LineupStage): 'M' | 'L' {
  return stage === 'LAB' ? 'L' : 'M'
}
</script>

<template>
  <section
    class="lineup"
    aria-labelledby="lineup-heading"
  >
    <ExpressionBackground />
    <div
      class="lineup__grain"
      aria-hidden="true"
    />
    <div
      class="lineup__grid"
      aria-hidden="true"
    />
    <ClientOnly>
      <LineupDistantTrails />
    </ClientOnly>
    <LineupSideStreams />
    <div class="lineup__inner">
      <h2
        id="lineup-heading"
        class="lineup__title"
      >
        Lineup
      </h2>
      <p class="lineup__lede">
      </p>

      <div class="lineup__days">
        <div
          v-for="dayBlock in lineupDays"
          :key="dayBlock.id"
          class="lineup__day-block"
        >
          <FestivalDateLock
            class="lineup__day-date"
            :day="dayBlock.dayOfMonth"
            :ordinal="nightOrdinal(dayBlock.dayOfMonth)"
            :month="festival.monthShort"
            :year="festival.yearShort"
          />
          <table
            class="lineup__table"
            :aria-label="`${dayBlock.weekday} ${dayBlock.dayOfMonth} ${festival.monthShort} ${festival.yearShort}, ${festival.city}, schedule`"
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  class="lineup__th lineup__th--label lineup__th--artist-head"
                >
                  [ARTIST]
                </th>
                <th
                  scope="col"
                  class="lineup__th lineup__th--label lineup__th--from"
                >
                  [FROM]
                </th>
                <th
                  scope="col"
                  class="lineup__th lineup__th--label lineup__th--stage"
                >
                  [STAGE]
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in dayBlock.rows"
                :key="`${dayBlock.id}-${row.id}`"
                class="lineup__row"
              >
                <td class="lineup__cell lineup__cell--artist">
                  <span class="lineup__artist-line">
                    <span class="lineup__name">
                      <template
                        v-for="(part, i) in b2bParts(row.displayName)"
                        :key="`${row.id}-${i}`"
                      >
                        <template v-if="i > 0">
                          {{ ' ' }}<span class="lineup__b2b">b2b</span>{{ ' ' }}
                        </template>{{ part }}
                      </template>
                    </span>
                    <span
                      v-if="row.note"
                      class="lineup__note"
                    >{{ row.note }}</span>
                  </span>
                </td>
                <td class="lineup__cell lineup__cell--from">
                  {{ row.countryCode }}
                </td>
                <td class="lineup__cell lineup__cell--stage">
                  <span
                    class="lineup__stage-mark"
                    :class="row.stage === 'LAB' ? 'lineup__stage-mark--lab' : 'lineup__stage-mark--main'"
                    :aria-label="row.stage"
                  >
                    <span aria-hidden="true">{{ stageLetter(row.stage) }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lineup {
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding: var(--space-section) var(--space-md) var(--space-3xl);
  background: var(--color-bg-base);
}

/* Match hero: film grain + structural grid (mask tuned for a tall section) */
.lineup__grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: var(--grain-opacity);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

.lineup__grid {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image:
    linear-gradient(to right, var(--color-ui-grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-ui-grid-line) 1px, transparent 1px);
  background-size: 4rem 4rem;
  opacity: 0.32;
  /* Taller ellipse than hero so the grid reads through the full lineup block */
  mask-image: radial-gradient(ellipse 105% 85% at 50% 42%, black 18%, transparent 72%);
  -webkit-mask-image: radial-gradient(ellipse 105% 85% at 50% 42%, black 18%, transparent 72%);
}

.lineup__inner {
  position: relative;
  z-index: 3;
  max-width: var(--content-max);
  margin: 0 auto;
}

.lineup__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letter-spacing-tight);
  text-transform: uppercase;
}

.lineup__lede {
  margin: var(--space-md) 0 var(--space-2xl);
  max-width: 36ch;
  font-size: var(--text-hero-lg);
  color: var(--color-fg-muted);
  line-height: 1.5;
}

.lineup__days {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

.lineup__day-block {
  margin: 0;
}

.lineup__day-date {
  margin: 0 0 var(--space-lg);
}

.lineup__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-family: var(--font-display);
  font-size: clamp(0.78rem, 1.35vw, 0.95rem);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-fg-primary);
  line-height: 1.12;
}

.lineup__th {
  padding: 0 0 var(--space-md);
  font-family: var(--font-label);
  font-weight: var(--font-weight-semiregular);
  text-align: left;
  vertical-align: bottom;
  line-height: 1.1;
  color: var(--color-fg-muted);
}

.lineup__th--label {
  font-family: var(--font-label);
  font-size: 0.65em;
  letter-spacing: 0.14em;
}

/* Wide column gaps — artist | from | stage */
.lineup__th--artist-head,
.lineup__cell--artist {
  width: fit-content;
  padding-right: clamp(0.75rem, 2vw, 1.75rem);
}

.lineup__th--from,
.lineup__cell--from {
  width: 9%;
  padding-right: clamp(0.75rem, 2vw, 1.75rem);
}

.lineup__th--stage,
.lineup__cell--stage {
  width: var(--size-lineup-stage-mark);
  padding-right: 0;
}

.lineup__cell--from {
  font-family: var(--font-label);
}

.lineup__cell--stage {
  vertical-align: middle;
}

.lineup__stage-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--size-lineup-stage-mark);
  height: var(--size-lineup-stage-mark);
  border-radius: 50%;
  font-family: var(--font-helvetica);
  font-size: var(--text-lineup-stage-mark);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--color-fg-on-accent);
}

.lineup__stage-mark--main {
  background: var(--color-lineup-stage-main);
}

.lineup__stage-mark--lab {
  background: var(--color-lineup-stage-lab);
}

.lineup__cell {
  padding: var(--space-xs) clamp(0.5rem, 1.5vw, 1rem) var(--space-xs) 0;
  vertical-align: top;
  line-height: 1.12;
  word-break: break-word;
}

.lineup__artist-line {
  display: inline;
}

.lineup__name {
  display: inline;
  font-size: var(--text-lineup-name);
  font-weight: var(--font-weight-regular);
  letter-spacing: -0.035em;
  line-height: 1.1;
  color: var(--color-fg-primary);
}

.lineup__b2b {
  display: inline;
  font-family: var(--font-label);
  font-size: 1.5rem;
  font-weight: var(--font-weight-regular);
  letter-spacing: -0.05rem;
  text-transform: lowercase;
  color: var(--color-lineup-b2b);
}

.lineup__note {
  display: inline;
  font-family: var(--font-label);
  font-size: 1.5rem;
  font-weight: var(--font-weight-regular);
  letter-spacing: -0.05rem;
  text-transform: uppercase;
  margin-left: 0.5rem;
  color: var(--color-ui-annotation);
}

@media (prefers-reduced-motion: reduce) {
  .lineup__grid {
    opacity: 0.18;
  }
}

@media (max-width: 52rem) {
  .lineup__table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .lineup__table thead,
  .lineup__table tbody,
  .lineup__table tr {
    display: table;
    width: max(52rem, 100%);
    table-layout: fixed;
  }
}
</style>
