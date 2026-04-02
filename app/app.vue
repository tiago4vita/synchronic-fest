<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <ClientOnly>
      <CursorGridTrail />
    </ClientOnly>
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
