<script setup lang="ts">
import ExpressionBackground from '~/components/expression-background.vue'
import LineupSideStreams from '~/components/lineup-side-streams.vue'
import { lineupDays, ordinalSuffix } from '~/data/lineup'

/** Split on b2b (case-insensitive); re-insert with primary accent (magenta) in template */
function b2bParts(displayName: string): string[] {
  return displayName.split(/\s+b2b\s+/i)
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
    <LineupSideStreams />
    <div class="lineup__inner">
      <h2
        id="lineup-heading"
        class="lineup__title"
      >
        Lineup
      </h2>
      <p class="lineup__lede">
        Curated fiction — names set in type, not in stone.
      </p>

      <div class="lineup__days">
        <div
          v-for="dayBlock in lineupDays"
          :key="dayBlock.id"
          class="lineup__day-block"
        >
          <table
            class="lineup__table"
            :aria-label="`${dayBlock.weekday} ${dayBlock.monthBracket} ${dayBlock.dayOfMonth}, schedule`"
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
                  class="lineup__th lineup__th--label lineup__th--day"
                >
                  [DAY]
                </th>
                <th
                  scope="col"
                  class="lineup__th lineup__th--label lineup__th--month"
                >
                  [MONTH]
                </th>
                <th
                  scope="col"
                  class="lineup__th lineup__th--label lineup__th--date"
                >
                  [DATE]
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
                v-for="(row, rowIndex) in dayBlock.rows"
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
                <td
                  v-if="rowIndex === 0"
                  class="lineup__cell lineup__cell--day lineup__cell--date-span"
                  :rowspan="dayBlock.rows.length"
                >
                  {{ dayBlock.weekday }}
                </td>
                <td
                  v-if="rowIndex === 0"
                  class="lineup__cell lineup__cell--month lineup__cell--date-span"
                  :rowspan="dayBlock.rows.length"
                >
                  {{ dayBlock.monthBracket }}
                </td>
                <td
                  v-if="rowIndex === 0"
                  class="lineup__cell lineup__cell--date lineup__cell--date-span"
                  :rowspan="dayBlock.rows.length"
                >
                  {{ dayBlock.dayOfMonth }}<sup class="lineup__ordinal">{{ ordinalSuffix(dayBlock.dayOfMonth) }}</sup>
                  {{ ' ' }}{{ dayBlock.yearShort }}
                </td>
                <td class="lineup__cell lineup__cell--from">
                  {{ row.countryCode }}
                </td>
                <td class="lineup__cell lineup__cell--stage">
                  {{ row.stage }}
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
  font-weight: var(--font-weight-bold);
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

.lineup__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-family: var(--font-display);
  font-size: clamp(0.78rem, 1.35vw, 0.95rem);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-fg-primary);
  line-height: 1.12;
}

.lineup__th {
  padding: 0 0 var(--space-xs);
  font-family: var(--font-label);
  font-weight: var(--font-weight-semibold);
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

/* Wide column gaps — engineered grid (order: artist | day | month | date | from | stage) */
.lineup__th--artist-head,
.lineup__cell--artist {
  width: fit-content;
  padding-right: clamp(0.75rem, 2vw, 1.75rem);
}

.lineup__th--day,
.lineup__cell--day {
  width: 6%;
  padding-right: clamp(0.75rem, 2vw, 1.75rem);
}

.lineup__th--month,
.lineup__cell--month {
  width: 8%;
  padding-right: clamp(0.75rem, 2vw, 1.75rem);
}

.lineup__th--date,
.lineup__cell--date {
  width: 12%;
  padding-right: clamp(0.75rem, 2vw, 1.75rem);
}

.lineup__th--from,
.lineup__cell--from {
  width: 9%;
  padding-right: clamp(0.75rem, 2vw, 1.75rem);
}

.lineup__th--stage,
.lineup__cell--stage {
  width: 10%;
  padding-right: clamp(0.5rem, 1.5vw, 1rem);
}

.lineup__cell--date-span {
  vertical-align: top;
}

.lineup__cell--day,
.lineup__cell--month,
.lineup__cell--date,
.lineup__cell--from,
.lineup__cell--stage {
  font-family: var(--font-label);
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

.lineup__ordinal {
  font-family: var(--font-label);
  font-size: 0.65em;
  font-weight: var(--font-weight-bold);
  line-height: 0;
}

.lineup__name {
  display: inline;
  font-size: var(--text-lineup-name);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.035em;
  line-height: 1.1;
  color: var(--color-fg-primary);
}

.lineup__b2b {
  display: inline;
  font-family: var(--font-label);
  font-size: 0.52em;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: lowercase;
  vertical-align: 0.2em;
  color: var(--color-lineup-b2b);
}

.lineup__note {
  display: inline;
  margin-left: 0.35em;
  font-family: var(--font-label);
  font-size: clamp(0.65rem, 1.15vw, 0.8rem);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.06em;
  line-height: 1.15;
  text-transform: uppercase;
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
