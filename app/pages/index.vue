<script setup lang="ts">
import { lineupTickerAnnouncements } from '~/data/site'
</script>

<template>
  <main class="page-home">
    <FestivalHero />
    <AnnouncementTicker placement="hero" />
    <RavePhotoSection />
    <AnnouncementTicker
      :items="lineupTickerAnnouncements"
      aria-label="Lineup and venue notices"
    />
    <LineupSection />
  </main>
</template>

<style scoped>
.page-home {
  min-height: 100dvh;
}
</style>
