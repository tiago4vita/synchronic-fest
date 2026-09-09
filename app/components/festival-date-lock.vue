<script setup lang="ts">
defineProps<{
  day: number
  ordinal: string
  month: string
  year: string
  city?: string
}>()
</script>

<template>
  <p class="festival-date-lock">
    <span class="festival-date-lock__when">
      <span class="festival-date-lock__day">
        {{ day }}<span class="festival-date-lock__ordinal">{{ ordinal }}</span>
      </span>
      <span>{{ month }} {{ year }}</span>
    </span>
    <span v-if="city">{{ city }}</span>
  </p>
</template>

<style scoped>
.festival-date-lock {
  margin: 0;
  display: flex;
  align-items: start;
  column-gap: var(--space-hero-date-city);
  font-family: var(--font-helvetica);
  font-size: var(--text-hero-date);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letter-spacing-hero-date);
  line-height: 1;
  text-transform: uppercase;
  color: var(--color-fg-primary);
}

.festival-date-lock__when {
  display: flex;
  align-items: start;
  column-gap: 0.5em;
}

.festival-date-lock__day {
  display: inline-flex;
  align-items: flex-start;
}

.festival-date-lock__ordinal {
  font-size: var(--text-hero-ordinal);
  line-height: 2;
  margin-inline-start: 0.08em;
}
</style>
