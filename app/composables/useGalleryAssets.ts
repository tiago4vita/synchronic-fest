import { computed, ref } from 'vue'
import { galleryImages } from '~/data/gallery-images'

const total = galleryImages.length

/** Singleton — boot overlay and rave section share the same load state */
const loadedCount = ref(0)
const ready = ref(false)
function preloadImage(src: string, timeoutMs = 45000): Promise<void> {
  return new Promise((resolve) => {
    const done = () => resolve()
    const failTimer = window.setTimeout(done, timeoutMs)
    const img = new Image()
    img.onload = () => {
      window.clearTimeout(failTimer)
      if (typeof img.decode === 'function') {
        img.decode().then(done).catch(done)
      }
      else {
        done()
      }
    }
    img.onerror = () => {
      window.clearTimeout(failTimer)
      done()
    }
    img.src = src
  })
}

let inflight: Promise<void> | null = null

/**
 * Shared gallery preload: run once, parallel fetch with progress. Used by boot overlay + rave section.
 */
export function useGalleryAssets() {
  const progressPercent = computed(() =>
    total === 0 ? 100 : Math.min(100, Math.round((loadedCount.value / total) * 100)),
  )

  function preloadAll(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.resolve()
    }
    if (ready.value) {
      return Promise.resolve()
    }
    if (inflight) {
      return inflight
    }

    inflight = (async () => {
      loadedCount.value = 0
      let done = 0
      await Promise.all(
        galleryImages.map(async (item) => {
          await preloadImage(item.src)
          done++
          loadedCount.value = done
        }),
      )
      ready.value = true
    })().finally(() => {
      inflight = null
    })

    return inflight
  }

  return {
    total,
    loadedCount,
    progressPercent,
    ready,
    preloadAll,
    /** Same list as `~/data/gallery-images` — exposed for consumers that need the list + shared preload */
    galleryImages,
  }
}
