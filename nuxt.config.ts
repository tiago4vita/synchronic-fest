// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/tokens.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'SIGNAL FEST — Underground electronic',
      meta: [
        {
          name: 'description',
          content:
            'Fictional festival experience — SIGNAL FEST 2026. Portfolio front-end & design.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
})
