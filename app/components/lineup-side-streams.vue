<script setup lang="ts">
import { computed } from 'vue'
import { lineupDays } from '~/data/lineup'

type StreamSeg = { kind: 'headline' | 'body'; text: string }

const phrasesDay1 = [
  'signal cuts through',
  'faces in the flood',
  'alone under strobes',
  'the room forgets time',
  'bass as architecture',
  'they watch from the rail',
  'ノイズの奥',
]

const phrasesDay2 = [
  'green flash flood',
  'warehouse cathedral',
  'til dawn we rise',
  'another frequency',
  'no ceiling only fog',
  'pulse in the floor',
  '다음 트랙',
]

function buildSegments(
  names: string[],
  phrases: string[],
  columnSeed: number,
  length = 28,
): StreamSeg[] {
  const out: StreamSeg[] = []
  let ni = columnSeed % Math.max(names.length, 1)
  let pi = (columnSeed * 2) % Math.max(phrases.length, 1)
  for (let k = 0; k < length; k++) {
    if (k % 3 === 1) {
      const phrase = phrases[pi % phrases.length] ?? ''
      out.push({ kind: 'body', text: phrase })
      pi++
    } else {
      const name = names[ni % names.length] ?? ''
      out.push({ kind: 'headline', text: name })
      ni++
    }
  }
  return out
}

const day1Names = computed(() => lineupDays[0]!.rows.map((r) => r.displayName))
const day2Names = computed(() => lineupDays[1]!.rows.map((r) => r.displayName))

const columnsDay1 = computed(() =>
  [0, 1, 2, 3].map((i) => ({
    id: `d1-${i}`,
    duration: 52 + i * 11,
    direction: i % 2 === 0 ? 'up' : 'down',
    segments: buildSegments(day1Names.value, phrasesDay1, i + 1),
  })),
)

const columnsDay2 = computed(() =>
  [0, 1, 2, 3].map((i) => ({
    id: `d2-${i}`,
    duration: 48 + i * 9,
    direction: i % 2 === 1 ? 'up' : 'down',
    segments: buildSegments(day2Names.value, phrasesDay2, i + 3),
  })),
)
</script>

<template>
  <div
    class="lineup-side-streams"
    aria-hidden="true"
  >
    <div class="lineup-side-streams__rail lineup-side-streams__rail--day1">
      <div
        v-for="col in columnsDay1"
        :key="col.id"
        class="lineup-side-streams__col"
      >
        <div
          class="lineup-side-streams__track"
          :class="col.direction === 'up' ? 'lineup-side-streams__track--up' : 'lineup-side-streams__track--down'"
          :style="{ animationDuration: `${col.duration}s` }"
        >
          <div
            v-for="dup in 2"
            :key="`a-${col.id}-${dup}`"
            class="lineup-side-streams__chunk"
          >
            <p
              v-for="(seg, idx) in col.segments"
              :key="`${col.id}-${dup}-${idx}`"
              class="lineup-side-streams__line"
              :class="seg.kind === 'headline' ? 'lineup-side-streams__line--head' : 'lineup-side-streams__line--body'"
            >
              <span class="lineup-side-streams__stack">
                <span
                  class="lineup-side-streams__echo lineup-side-streams__echo--near"
                  aria-hidden="true"
                >{{ seg.text }}</span>
                <span
                  class="lineup-side-streams__echo lineup-side-streams__echo--far"
                  aria-hidden="true"
                >{{ seg.text }}</span>
                <span class="lineup-side-streams__face">{{ seg.text }}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="lineup-side-streams__rail lineup-side-streams__rail--day2">
      <div
        v-for="col in columnsDay2"
        :key="col.id"
        class="lineup-side-streams__col"
      >
        <div
          class="lineup-side-streams__track"
          :class="col.direction === 'up' ? 'lineup-side-streams__track--up' : 'lineup-side-streams__track--down'"
          :style="{ animationDuration: `${col.duration}s` }"
        >
          <div
            v-for="dup in 2"
            :key="`b-${col.id}-${dup}`"
            class="lineup-side-streams__chunk"
          >
            <p
              v-for="(seg, idx) in col.segments"
              :key="`${col.id}-${dup}-${idx}`"
              class="lineup-side-streams__line"
              :class="seg.kind === 'headline' ? 'lineup-side-streams__line--head' : 'lineup-side-streams__line--body'"
            >
              <span class="lineup-side-streams__stack">
                <span
                  class="lineup-side-streams__echo lineup-side-streams__echo--near"
                  aria-hidden="true"
                >{{ seg.text }}</span>
                <span
                  class="lineup-side-streams__echo lineup-side-streams__echo--far"
                  aria-hidden="true"
                >{{ seg.text }}</span>
                <span class="lineup-side-streams__face">{{ seg.text }}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lineup-side-streams {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.lineup-side-streams__rail {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 6vw;
  max-height: 100%;
  overflow: hidden;
}

.lineup-side-streams__rail--day1 {
  justify-content: flex-start;
  padding-left: max(0px, env(safe-area-inset-left));
  background: var(--color-lineup-rail-day1-bg);
  color: var(--color-lineup-rail-day1-fg);
}

.lineup-side-streams__rail--day2 {
  justify-content: flex-end;
  padding-right: max(0px, env(safe-area-inset-right));
  background: var(--color-lineup-rail-day2-bg);
  color: var(--color-lineup-rail-day2-fg);
}

.lineup-side-streams__col {
  position: relative;
  flex: 0 0 clamp(1.35rem, 2.8vw, 2.1rem);
  margin-right: -0.5rem;
  overflow: visible;
}

.lineup-side-streams__rail--day2 .lineup-side-streams__col {
  margin-right: 0;
  margin-left: -0.5rem;
}

.lineup-side-streams__track {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  will-change: transform;
}

.lineup-side-streams__track--up {
  animation-name: lineup-stream-up;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 55s;
}

.lineup-side-streams__track--down {
  animation-name: lineup-stream-down;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 55s;
}

.lineup-side-streams__chunk {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  padding-block: var(--space-md);
}

.lineup-side-streams__line {
  margin: 0;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: var(--font-display);
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 1;
}

/* Same ink as foreground; blurred duplicates read as bitmap-style echo */
.lineup-side-streams__stack {
  display: grid;
  place-items: start center;
  isolation: isolate;
}

.lineup-side-streams__stack > * {
  grid-area: 1 / 1;
}

.lineup-side-streams__echo {
  color: inherit;
  pointer-events: none;
}

.lineup-side-streams__echo--near {
  filter: blur(2px);
  opacity: 0.4;
}

.lineup-side-streams__echo--far {
  filter: blur(4.5px);
  opacity: 0.34;
  transform: translate(-2px, 8px);
}

.lineup-side-streams__face {
  position: relative;
  z-index: 1;
}

/* Size contrast only — lines stack with gap, no overlap in the same column */
.lineup-side-streams__line--head {
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.05em;
  font-size: clamp(1.05rem, 2.75vw, 1.9rem);
}

.lineup-side-streams__line--body {
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.22em;
  font-size: clamp(0.76rem, 1.9vw, 1.04rem);
}

.lineup-side-streams__rail--day1 .lineup-side-streams__line--head,
.lineup-side-streams__rail--day1 .lineup-side-streams__line--body {
  color: var(--color-lineup-rail-day1-fg);
}

.lineup-side-streams__rail--day2 .lineup-side-streams__line--head,
.lineup-side-streams__rail--day2 .lineup-side-streams__line--body {
  color: var(--color-lineup-rail-day2-fg);
}

@keyframes lineup-stream-up {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}

@keyframes lineup-stream-down {
  from {
    transform: translateY(-50%);
  }
  to {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lineup-side-streams__track--up,
  .lineup-side-streams__track--down {
    animation-play-state: paused;
  }
}

@media (max-width: 52rem) {
  .lineup-side-streams {
    display: none;
  }
}
</style>
