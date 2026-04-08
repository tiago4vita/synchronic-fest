<script setup lang="ts">
import { galleryImages } from '~/data/gallery-images'

useHead({
  link: galleryImages.map((item) => ({
    rel: 'preload' as const,
    as: 'image' as const,
    href: item.src,
  })),
})

const { preloadAll } = useGalleryAssets()

onBeforeMount(() => {
  void preloadAll()
})
</script>

<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <BootShellOverlay />
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
