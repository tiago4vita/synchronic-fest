/**
 * Ticket tiers — art lives in ~/assets/tickets (bundled; not the gitignored gallery folder).
 */
import ticketEarlyBird from '~/assets/tickets/ticket_early-bird.png'
import ticketGeneralAdmission from '~/assets/tickets/ticket_general-admission.png'
import ticketVip from '~/assets/tickets/ticket_vip.png'

export type TicketFinish = 'standard' | 'holo'

export type TicketTrailChroma = 'black' | 'vip'

export interface TicketTrailPair {
  cell: string
  glyph: string
}

/**
 * VIP trail cell/glyph pairs — high-contrast combos from the holographic ladder.
 * Darker fills carry light glyphs and the reverse, so characters stay readable.
 */
export const vipTrailPairs: readonly TicketTrailPair[] = [
  { cell: 'var(--color-vip-trail-blue)', glyph: 'var(--color-vip-trail-yellow)' },
  { cell: 'var(--color-vip-trail-blue)', glyph: 'var(--color-vip-trail-cyan)' },
  { cell: 'var(--color-vip-trail-blue)', glyph: 'var(--color-vip-trail-lime)' },
  { cell: 'var(--color-vip-trail-violet)', glyph: 'var(--color-vip-trail-yellow)' },
  { cell: 'var(--color-vip-trail-violet)', glyph: 'var(--color-vip-trail-lime)' },
  { cell: 'var(--color-vip-trail-violet)', glyph: 'var(--color-vip-trail-cyan)' },
  { cell: 'var(--color-vip-trail-red)', glyph: 'var(--color-vip-trail-cyan)' },
  { cell: 'var(--color-vip-trail-red)', glyph: 'var(--color-vip-trail-yellow)' },
  { cell: 'var(--color-vip-trail-orange)', glyph: 'var(--color-vip-trail-blue)' },
  { cell: 'var(--color-vip-trail-yellow)', glyph: 'var(--color-vip-trail-blue)' },
  { cell: 'var(--color-vip-trail-yellow)', glyph: 'var(--color-vip-trail-violet)' },
  { cell: 'var(--color-vip-trail-lime)', glyph: 'var(--color-vip-trail-violet)' },
  { cell: 'var(--color-vip-trail-lime)', glyph: 'var(--color-vip-trail-blue)' },
  { cell: 'var(--color-vip-trail-cyan)', glyph: 'var(--color-vip-trail-red)' },
  { cell: 'var(--color-vip-trail-cyan)', glyph: 'var(--color-vip-trail-blue)' },
  { cell: 'var(--color-vip-trail-purple)', glyph: 'var(--color-vip-trail-yellow)' },
  { cell: 'var(--color-vip-trail-purple)', glyph: 'var(--color-vip-trail-lime)' },
  { cell: 'var(--color-vip-trail-pink)', glyph: 'var(--color-vip-trail-lime)' },
  { cell: 'var(--color-vip-trail-pink)', glyph: 'var(--color-vip-trail-yellow)' },
]

export interface TicketTier {
  id: string
  name: string
  priceLabel: string
  image: string
  finish: TicketFinish
  /** Accessible name — art already carries the visual labels */
  label: string
}

export const ticketTiers: readonly TicketTier[] = [
  {
    id: 'general-admission',
    name: 'General Admission',
    priceLabel: '€59',
    image: ticketGeneralAdmission,
    finish: 'standard',
    label: 'General Admission, two-day festival pass, 59 euros',
  },
  {
    id: 'early-bird',
    name: 'Super Early Bird',
    priceLabel: '€49',
    image: ticketEarlyBird,
    finish: 'standard',
    label: 'Super Early Bird General Admission, two-day festival pass, 49 euros',
  },
  {
    id: 'vip',
    name: 'VIP',
    priceLabel: '€199',
    image: ticketVip,
    finish: 'holo',
    label: 'VIP, two-day festival pass, 199 euros',
  },
]
