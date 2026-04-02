<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <div
      class="bitmap-overlay"
      aria-hidden="true"
    />
  </div>
</template>

<style>
.app-shell {
  min-height: 100dvh;
}
</style>
