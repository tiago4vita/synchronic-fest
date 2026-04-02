/**
 * All raster images under `app/assets/img/` (build-time glob — add/remove files in that folder).
 * Change `orderGalleryPaths()` to set a custom order; default is filename A→Z.
 */
export interface GalleryImage {
  src: string
  alt: string
}

const raw = import.meta.glob<{ default: string }>(
  '../assets/img/*.{jpg,jpeg,png,webp,gif,avif}',
  { eager: true },
)

function fileBase(path: string): string {
  const name = path.split('/').pop() ?? path
  return name.replace(/\.[^.]+$/i, '')
}

function altFromFilename(base: string): string {
  const words = base.replace(/[-_]+/g, ' ').trim()
  return words || 'Venue photography'
}

/** Customize order here (paths are Vite keys, e.g. `../assets/img/foo.jpg`). */
function orderGalleryPaths(paths: string[]): string[] {
  return [...paths].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }))
}

const orderedPaths = orderGalleryPaths(Object.keys(raw))

export const galleryImages: readonly GalleryImage[] = orderedPaths.map((path) => {
  const mod = raw[path]
  const src = mod?.default ?? ''
  const base = fileBase(path)
  return {
    src,
    alt: `Venue photography: ${altFromFilename(base)}.`,
  }
})
