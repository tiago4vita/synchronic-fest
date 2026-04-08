/**
 * Gallery rasters hosted on Supabase Storage (signed URLs — refresh tokens if they expire).
 * Order: filename A→Z (same as previous local glob sort).
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
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/aleksandr-popov-6IIYwaB81lg-unsplash.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL2FsZWtzYW5kci1wb3Bvdi02SUlZd2FCODFsZy11bnNwbGFzaC53ZWJwIiwiaWF0IjoxNzc1NjY5NDgwLCJleHAiOjE4MDcyMDU0ODB9.gAN0YiZrZAzbIFJHOZieJKqqqAjuDh4EEmaYCXovwWc',
  },
  {
    base: 'lachy-spratt-dv5vwLSOQK8-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/lachy-spratt-dv5vwLSOQK8-unsplash.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL2xhY2h5LXNwcmF0dC1kdjV2d0xTT1FLOC11bnNwbGFzaC53ZWJwIiwiaWF0IjoxNzc1NjY5NDg2LCJleHAiOjE4MDcyMDU0ODZ9.imRyNKIYWlOIa791hqiGTzl0qABc1z6KktV7b7lOrrM',
  },
  {
    base: 'laszlo-barta-bfiSa0-tGbo-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/laszlo-barta-bfiSa0-tGbo-unsplash.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL2xhc3psby1iYXJ0YS1iZmlTYTAtdEdiby11bnNwbGFzaC53ZWJwIiwiaWF0IjoxNzc1NjY5NDg4LCJleHAiOjE4MDcyMDU0ODh9.NdoXagCCDB0vMVQnWaLv9S6xucddNeo0e0nNDX45gxY',
  },
  {
    base: 'laszlo-barta-J-ckwWcibr0-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/laszlo-barta-J-ckwWcibr0-unsplash.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL2xhc3psby1iYXJ0YS1KLWNrd1djaWJyMC11bnNwbGFzaC53ZWJwIiwiaWF0IjoxNzc1NjY5NDkwLCJleHAiOjE4MDcyMDU0OTB9.qmNP0v43chr79QES4db-Xw4lQlPBAYom6QUJvnoIDvI',
  },
  {
    base: 'laszlo-barta-wPagn8MKGHA-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/laszlo-barta-wPagn8MKGHA-unsplash.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL2xhc3psby1iYXJ0YS13UGFnbjhNS0dIQS11bnNwbGFzaC53ZWJwIiwiaWF0IjoxNzc1NjY5NDkyLCJleHAiOjE4MDcyMDU0OTJ9.hmPqMHM0nJutn3aAxhwPiAUp95wt7PZRXAKFcjHTw0Q',
  },
  {
    base: 'mike-von-UIKenL-frjI-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/mike-von-UIKenL-frjI-unsplash.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL21pa2Utdm9uLVVJS2VuTC1mcmpJLXVuc3BsYXNoLndlYnAiLCJpYXQiOjE3NzU2Njk0OTQsImV4cCI6MTgwNzIwNTQ5NH0.mmYHO4rcLxoHTVV_MNDkVbBa6tCks5AezcoHZXoCIGE',
  },
  {
    base: 'moreno-matkovic-poi6sj0XOOI-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/moreno-matkovic-poi6sj0XOOI-unsplash.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL21vcmVuby1tYXRrb3ZpYy1wb2k2c2owWE9PSS11bnNwbGFzaC53ZWJwIiwiaWF0IjoxNzc1NjY5NDk2LCJleHAiOjE4MDcyMDU0OTZ9.DH0fe37Y876JHzSBItQZl3qenZ1eRKfcOf4QcPEsGyo',
  },
  {
    base: 'perry-avgerinos-R2dlVo7WQVs-unsplash',
    src:
      'https://oechlopuuncthoyizhrg.supabase.co/storage/v1/object/sign/synchronic/perry-avgerinos-R2dlVo7WQVs-unsplash.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMDc0YWRjZi03ZjRiLTQ2MjMtOTg5OC1lOGMxZjYwOWUzOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzeW5jaHJvbmljL3BlcnJ5LWF2Z2VyaW5vcy1SMmRsVm83V1FWcy11bnNwbGFzaC53ZWJwIiwiaWF0IjoxNzc1NjY5NDk4LCJleHAiOjE4MDcyMDU0OTh9.zSuKKWwB1LuTr6O7RebF7FJQlhQl9JvXY6aNTMT8Z84',
  },
]

export const galleryImages: readonly GalleryImage[] = entries.map(({ base, src }) => ({
  src,
  alt: `Venue photography: ${altFromFilename(base)}.`,
}))
