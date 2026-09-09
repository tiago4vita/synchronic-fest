/**
 * Ticket tiers — art lives in ~/assets/tickets (bundled; not the gitignored gallery folder).
 */
import ticketEarlyBird from '~/assets/tickets/ticket_early-bird.png'
import ticketGeneralAdmission from '~/assets/tickets/ticket_general-admission.png'
import ticketVip from '~/assets/tickets/ticket_vip.png'

export type TicketFinish = 'standard' | 'holo'

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
