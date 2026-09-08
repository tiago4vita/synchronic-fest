/**
 * Fictional two-day schedule — display names as intended (styling applied in UI).
 */

export type LineupStage = 'MAIN' | 'LAB'

export interface LineupScheduleRow {
  /** Stable id for keys */
  id: string
  stage: LineupStage
  /** Shown under [FROM], e.g. [DE] */
  countryCode: string
  /** Primary display string */
  displayName: string
  /** Optional subtitle, e.g. special set */
  note?: string
}

export interface LineupDayBlock {
  id: string
  /** Short weekday label, e.g. FRI */
  weekday: string
  /** e.g. [NOV] */
  monthBracket: string
  dayOfMonth: number
  /** e.g. '26 */
  yearShort: string
  rows: LineupScheduleRow[]
}

/** Ordinal suffix for English day-of-month (20th, 21st, …). */
export function ordinalSuffix(day: number): string {
  const j = day % 10
  const k = day % 100
  if (k >= 11 && k <= 13) return 'th'
  if (j === 1) return 'st'
  if (j === 2) return 'nd'
  if (j === 3) return 'rd'
  return 'th'
}

/**
 * Friday / Saturday — MAIN vs LAB; wide grid alignment in `lineup-section.vue`.
 * `countryCode` = fictional origin / scene tag per act (bracketed in UI).
 */
export const lineupDays: LineupDayBlock[] = [
  {
    id: 'day-1',
    weekday: 'FRI',
    monthBracket: '[NOV]',
    dayOfMonth: 20,
    yearShort: "'26",
    rows: [
      { id: 'ihm', stage: 'MAIN', countryCode: 'FR', displayName: 'I Hate Models' },
      { id: 'peggy', stage: 'MAIN', countryCode: 'KR', displayName: 'Peggy Gou' },
      {
        id: 'fred-four-sk',
        stage: 'MAIN',
        countryCode: 'UK',
        displayName: 'Fred Again.. b2b Four Tet b2b Skrillex',
      },
      { id: 'klang', stage: 'MAIN', countryCode: 'DE', displayName: 'Klangkuenstler' },
      { id: 'sara-landry', stage: 'MAIN', countryCode: 'US', displayName: 'Sara Landry' },
      { id: 'heartstring', stage: 'MAIN', countryCode: 'DE', displayName: 'DJ Heartstring' },
      { id: 'boysnoize', stage: 'LAB', countryCode: 'DE', displayName: 'Boys Noize' },
      { id: 'shlomo', stage: 'LAB', countryCode: 'FR', displayName: 'Shlømo' },
      { id: 'mischluft', stage: 'LAB', countryCode: 'DE', displayName: 'Mischluft' },
      { id: 'autechre', stage: 'LAB', countryCode: 'UK', displayName: 'Autechre' },
      { id: 'kettama', stage: 'LAB', countryCode: 'IE', displayName: 'Kettama' },
    ],
  },
  {
    id: 'day-2',
    weekday: 'SAT',
    monthBracket: '[NOV]',
    dayOfMonth: 21,
    yearShort: "'26",
    rows: [
      { id: 'brutalismus3000', stage: 'MAIN', countryCode: 'DE', displayName: 'Brutalismus 3000' },
      { id: 'kobosil', stage: 'MAIN', countryCode: 'DE', displayName: 'Kobosil' },
      { id: 'horsegiirl', stage: 'MAIN', countryCode: 'DE', displayName: 'horsegiirL' },
      { id: 'mallgrab', stage: 'LAB', countryCode: 'AU', displayName: 'Mall Grab', note: 'Long set' },
      {
        id: 'yukimatsu',
        stage: 'MAIN',
        countryCode: 'JP',
        displayName: '¥ØU$UK€ ¥UK1MAT$U',
      },
      { id: 'pegassi', stage: 'LAB', countryCode: 'UK', displayName: 'Pegassi' },
      { id: 'atrip', stage: 'LAB', countryCode: 'SE', displayName: 'ATRIP' },
      { id: 'rhr', stage: 'LAB', countryCode: 'BR', displayName: 'RHR' },
      { id: 'mechatok', stage: 'MAIN', countryCode: 'DE', displayName: 'Mechatok' },
      {
        id: 'worm-eurohead',
        stage: 'LAB',
        countryCode: 'NL',
        displayName: 'DJ Worm b2b Eurohead',
      },
      {
        id: 'ecco2k',
        stage: 'MAIN',
        countryCode: 'SE',
        displayName: 'Ecco2k',
        note: 'Special set',
      },
    ],
  },
]
