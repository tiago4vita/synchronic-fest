/**
 * Gallery rasters hosted on Supabase Storage (signed URLs — refresh tokens if they expire).
 */
export interface GalleryImage {
  src: string
  alt: string
}

function altFromFilename(base: string): string {
  const words = base.replace(/[-_]+/g, ' ').trim()
  return words || 'Venue photography'
}

const entries: ReadonlyArray<{ base: string; src: string }> = [
  {
    base: 'aleksandr-popov-6IIYwaB81lg-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/aleksandr-popov-6IIYwaB81lg-unsplash%201.png?token=eyJraWQiOiJmMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL2FsZWtzYW5kci1wb3Bvdi02SUlZd2FCODFsZy11bnNwbGFzaCAxLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODkxNzEzNTksImV4cCI6MTgyMDcwNzM1OX0.RUB6oXcV_6TmieP1irOfygD9TgWAmVhkSaf1-1jFusM',
  },
  {
    base: 'dima-kosh-8SmWbHAdz_g-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/dima-kosh-8SmWbHAdz_g-unsplash%201.png?token=eyJraWQiOiJmMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL2RpbWEta29zaC04U21XYkhBZHpfZy11bnNwbGFzaCAxLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODkxNzEzNjgsImV4cCI6MTgyMDcwNzM2OH0.JxtJzSl4TqrdRvP8Gv1pX_qmWOeN8a3wzvTSn0dH528',
  },
  {
    base: 'dima-kosh-lYj-bu6d0RI-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/dima-kosh-lYj-bu6d0RI-unsplash%201.png?token=eyJraWQiOiJmMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL2RpbWEta29zaC1sWWotYnU2ZDBSSS11bnNwbGFzaCAxLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODkxNzEzNzksImV4cCI6MTgyMDcwNzM3OX0.dQVus7cGcl83dCfFfBDkOLEEQ2ftcBz4CX8gqzFzClg',
  },
  {
    base: 'lachy-spratt-dv5vwLSOQK8-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/lachy-spratt-dv5vwLSOQK8-unsplash%201.png?token=eyJraWQiOiJmMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL2xhY2h5LXNwcmF0dC1kdjV2d0xTT1FLOC11bnNwbGFzaCAxLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODkxNzEzODYsImV4cCI6MTgyMDcwNzM4Nn0.yjED7J2vUzWy6DwR5Hcyf41RsWog2n-7HmbXyhi6Kpo',
  },
  {
    base: 'tom-depont-aFf-b44VB_w-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/tom-depont-aFf-b44VB_w-unsplash%201.png?token=eyJraWQiOiJmMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL3RvbS1kZXBvbnQtYUZmLWI0NFZCX3ctdW5zcGxhc2ggMS5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5MTcxMzkyLCJleHAiOjE4MjA3MDczOTJ9.yVA8kty7VzBmPdHuUTAPXarBWRwVNjgXHVCKxFZ78M0',
  },
]

export const galleryImages: readonly GalleryImage[] = entries.map(({ base, src }) => ({
  src,
  alt: `Venue photography: ${altFromFilename(base)}.`,
}))
