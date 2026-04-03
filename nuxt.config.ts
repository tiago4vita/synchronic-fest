// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/tokens.css',
    '~/assets/css/bitmap-overlay.css',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Synchronic — Underground electronic',
      meta: [
        {
          name: 'description',
          content:
            'Synchronic — fictional festival experience, Berlin. Portfolio front-end & design.',
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
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;700&family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+KR:wght@400;700&display=swap',
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
