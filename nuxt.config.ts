// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['@fontsource-variable/montserrat', '~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: 'WorkFlow — управление заявками',
      meta: [
        { name: 'description', content: 'Демо-приложение WorkFlow: реестр заявок, детали, фильтры и история изменений.' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
