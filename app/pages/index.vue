<script setup lang="ts">
import { lineupTickerAnnouncements } from '~/data/site'
</script>

<template>
  <div class="page-home">
    <main>
      <FestivalHero />
      <AnnouncementTicker placement="hero" />
      <RavePhotoSection />
      <AnnouncementTicker
        :items="lineupTickerAnnouncements"
        aria-label="Lineup and venue notices"
      />
      <LineupSection />
      <AnnouncementTicker
        :items="lineupTickerAnnouncements"
        aria-label="Lineup and venue notices"
      />
      <TicketSection />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.page-home {
  min-height: 100dvh;
}
</style>
