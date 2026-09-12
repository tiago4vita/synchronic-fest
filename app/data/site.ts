/**
 * Curated fictional festival copy (English). Sassy, niche, Berlin-anchored — see .cursor/rules.
 */

export const festival = {
  name: 'Synchronic',
  nameSuffix: 'FESTIVAL',
  tagline: 'Two nights, zero filler',
  dates: '20 — 21 November',
  location: 'Warehouse District',
  city: 'Berlin',
  monthShort: 'NOV',
  yearShort: '26',
  nights: [
    { day: 20, ordinal: 'TH' },
    { day: 21, ordinal: 'TH' },
  ],
} as const

export interface PortfolioCredit {
  credit: string
  work: string
  href?: string
  kind: 'source' | 'reference'
}

export const portfolio = {
  author: 'Tiago Vita',
  github: 'https://github.com/tiago4vita',
  email: 'tiago.parejavita4@gmail.com',
  fonts: [
    'Helvetica',
    'LED Light',
    'Pixelary',
    '04B 31',
    'Noto Sans JP',
    'Noto Sans KR',
    'Noto Sans Arabic',
  ],
  credits: [
    {
      credit: 'Fakemink',
      work: 'Easter Pink music video',
      href: 'https://youtu.be/KB5TKob9PeA?si=oKw0Dmi0_tIg4F6L',
      kind: 'source',
    },
    { credit: 'Aleksandr Popov', work: 'Photography', kind: 'source' },
    { credit: 'Dima Kosh', work: 'Photography', kind: 'source' },
    { credit: 'Lachy Spratt', work: 'Photography', kind: 'source' },
    { credit: 'Tom Depont', work: 'Photography', kind: 'source' },
    {
      credit: 'Nameless Festival',
      work: 'Reference site',
      href: 'https://www.namelessfestival.it/en',
      kind: 'reference',
    },
    {
      credit: 'Ministry of Sound',
      work: 'Reference site',
      href: 'https://ministryofsound.com/',
      kind: 'reference',
    },
    {
      credit: 'Mechatok',
      work: 'Expression On Your Face',
      href: 'https://youtu.be/gQehpVrU4-o?si=SFMkDrZVZ-GK2LR4',
      kind: 'reference',
    },
    {
      credit: 'Fiddle Digital',
      work: 'Reference site',
      href: 'https://fiddle.digital/',
      kind: 'reference',
    },
  ] satisfies readonly PortfolioCredit[],
} as const

export const tickerAnnouncements: string[] = [
  '◆ LOCK IN — MAGENTA ROOM OPENS AFTER MIDNIGHT',
  '◆ AFTERPARTY — INDUSTRIAL HALL — 04:00 · VIP ONLY',
  '◆ SPECIAL GUEST — STAGE MAIN — SATURDAY · YOU’LL HEAR IT FIRST',
  '◆ EARLY BIRD DIES FRIDAY 23:59 CET — DON’T WHINE LATER',
  '◆ NEW: IMMERSIVE STAGE LAB — NORTH WING · GO GET LOST',
  '◆ SYNTH + MODULAR WORKSHOPS — DAY PASS · NERDS WELCOME',
  '◆ BACKSTAGE MEET & GREET VIP ONLY',
  '◆ TIER JUMPS IN 3 DAYS — YOU’VE BEEN WARNED',
]

/** Ticker strip between gallery and lineup (separate feed). */
export const lineupTickerAnnouncements: string[] = [
  '◆ LINEUP SHIFTS — CHECK THE APP BEFORE YOU COMMIT',
  '◆ MAIN — DAY 1 FROM 18:00 · DAY 2 FROM 17:00',
  '◆ B2B PAIRINGS ON THE GRID',
  '◆ NO RE-ENTRY AFTER 02:00',
  '◆ HEARING PROTECTION — FREE AT INFO · USE IT',
  '◆ ACCESS — GATE C · VIP ENTRANCE MARKED',
]
