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
} as const

export const tickerAnnouncements: string[] = [
  '◆ LOCK IN — MAGENTA ROOM OPENS AFTER MIDNIGHT',
  '◆ AFTERPARTY — INDUSTRIAL HALL — 04:00 · NO GUEST LIST AT THE DOOR',
  '◆ SECRET GUEST — STAGE B — SATURDAY · YOU’LL HEAR IT FIRST',
  '◆ EARLY BIRD DIES FRIDAY 23:59 CET — DON’T WHINE LATER',
  '◆ NEW: IMMERSIVE LIGHT LAB — NORTH WING · GO GET LOST',
  '◆ SYNTH + MODULAR WORKSHOPS — DAY PASS · NERDS WELCOME',
  '◆ BACKSTAGE MEET & GREET — TINY SLICE OF SLOTS',
  '◆ TIER JUMPS IN 3 DAYS — YOU’VE BEEN WARNED',
]

/** Ticker strip between gallery and lineup (separate feed). */
export const lineupTickerAnnouncements: string[] = [
  '◆ LINEUP SHIFTS — CHECK THE APP BEFORE YOU COMMIT',
  '◆ MAIN — DAY 1 FROM 18:00 · DAY 2 FROM 17:00',
  '◆ B2B PAIRINGS ON THE GRID — READ CLOSELY',
  '◆ NO RE-ENTRY AFTER 02:00 — PLAN LIKE YOU MEAN IT',
  '◆ HEARING PROTECTION — FREE AT INFO · USE IT',
  '◆ ACCESS — GATE C · PRM ENTRANCE MARKED',
]
