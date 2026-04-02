/**
 * Curated fictional festival copy (English). Tune dates / city when the narrative settles.
 */

export const festival = {
  name: 'SIGNAL',
  nameSuffix: 'FEST',
  tagline: 'Underground electronic · 2026',
  dates: '20 — 21 November',
  location: 'Warehouse District',
  city: 'Berlin',
} as const

export const tickerAnnouncements: string[] = [
  '◆ LIVE: ACID GREEN ROOM OPENS MIDNIGHT',
  '◆ AFTER-PARTY — INDUSTRIAL HALL — 04:00',
  '◆ SECRET GUEST — STAGE B — SATURDAY',
  '◆ EARLY BIRD ENDS — FRIDAY 23:59 CET',
  '◆ NEW: IMMERSIVE LIGHT LAB — NORTH WING',
  '◆ WORKSHOPS — SYNTH + MODULAR — DAY PASS',
  '◆ BACKSTAGE MEET & GREET — LIMITED SLOTS',
  '◆ TICKET TIER UP — IN 3 DAYS',
]

/** Ticker strip between gallery and lineup (separate feed). */
export const lineupTickerAnnouncements: string[] = [
  '◆ LINEUP SUBJECT TO CHANGE — CHECK THE APP',
  '◆ MAIN STAGE — DAY 1 OPENS 18:00 · DAY 2 OPENS 17:00',
  '◆ B2B SETS — SEE GRID FOR PAIRINGS',
  '◆ NO RE-ENTRY AFTER 02:00 — PLAN AHEAD',
  '◆ HEARING PROTECTION — FREE AT INFO',
  '◆ ACCESS INFO — GATE C — PRM ENTRANCE',
]
