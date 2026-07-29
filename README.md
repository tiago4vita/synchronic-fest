# Synchronic

**A portfolio piece dressed as a festival.**

This is not a real event. **Synchronic** is a fictional two-night electronic festival set in Berlin — a front-end playground where I get to push typography, motion, and editorial art direction without pretending I'm selling tickets.

I built it to show what I care about: **design systems, performance-minded interactivity, and sites that feel like something** — not another generic landing page with a hero button and three feature cards.

---

## The dream lineup (not real)

The schedule is **100% fiction**. Every artist name is someone I actually want to hear in the same warehouse at some point — **Fred Again.. b2b Four Tet b2b Skrillex** on MAIN, **Brutalismus 3000** and **Kobosil** back-to-back, **Ecco2k** doing a special set in the LAB… you get it.

If any of this ever happened in real life, I would lose my mind. Until then, it lives here as curated type on a grid.

---

## What's on the site

### Boot sequence
A cold-start terminal overlay on first load — ASCII logo, fake boot logs, progress bar tied to **gallery asset preloading**. Scroll stays locked until everything is ready, then a hard cut into the main site.

### Hero
Full-viewport typographic intro: **Synchronic Festival**, dates, Berlin. Film grain, cyan grid mask, and a **multilingual expression background** (JP / KR / Arabic / Portuguese decorative streams scrolling in horizontal bands and vertical pillars).

### News ticker
Broadcast-style **marquee strips** — one overlapping the hero, one between gallery and lineup — looping fictional venue notices. Screen-reader summary included; motion respects `prefers-reduced-motion`.

### Rave photo gallery
Scroll-driven **horizontal photo rail** with three caption beats. Images are preloaded and decoded before reveal so nothing flashes empty. Captions shift accent color (magenta → acid → cyan) as you move through the section.

### Lineup
Editorial **schedule table** — two days, MAIN vs LAB, country tags, magenta **b2b** markers, optional set notes. Side **vertical streams** on magenta (day 1) and yellow (day 2) rails scroll artist names and chaotic party phrases in opposite directions.

### Cursor trail (hero only)
Move your pointer over the hero: a **grid of flickering glyphs** (Japanese kana, symbols, characters) spawns in your wake and fades out. Client-only; disabled when reduced motion is on.

### Global texture
Fixed **bitmap halftone overlay** across the whole page — subtle print/digital grit on top of everything.

---

## Design direction

- **Look:** Black & white foundation, **magenta-led** accents, acid yellow and cyan as supporting channels — editorial, maximal, Berlin warehouse energy.
- **Type:** [Zalando Sans Expanded](https://fontsource.org/fonts/zalando-sans-expanded) (display) + **Inter** (body/UI) + **Noto** for mixed-script decorative layers.
- **Benchmark:** Production polish in the spirit of sites like [Nameless Festival](https://namelessfestival.it) — craft reference, not a copy.

---

## Stack

| | |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) + Vue 3 + TypeScript |
| Fonts | Fontsource (Zalando Sans Expanded Variable) + Google Fonts (Inter, Noto JP/KR/Arabic) |
| Deploy | Static generation (`nuxt generate`) → GitHub Pages |
| Planned libs | `@chenglou/pretext`, `@fiddle-digital/string-tune` — wired in for future typographic / audio experiments |

No Tailwind. Custom CSS tokens in `app/assets/css/tokens.css`.

---

## Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Production / static preview:**

```bash
npm run generate
npm run preview
```

Pushes to `main` deploy via GitHub Actions (`.github/workflows/deploy-github-pages.yml`).

---

## Project structure (quick map)

```
app/
├── components/     # Hero, ticker, gallery, lineup, boot overlay, cursor trail…
├── composables/    # Gallery preload logic
├── data/           # Fictional copy, lineup, expression streams
├── assets/css/     # Tokens, fonts, bitmap overlay
└── pages/index.vue # Single-page flow
```

---

## About

Built by **Tiago Vita** as a portfolio site — freelance-friendly proof of front-end craft, design taste, and the kind of weird detail I actually enjoy shipping.

MIT License. Festival brand, lineup, and copy are fictional. Artist names belong to their respective owners; no affiliation implied.

If you're hiring for creative front-end work and this resonates, [get in touch](mailto:tiago.parejavita4@gmail.com).
