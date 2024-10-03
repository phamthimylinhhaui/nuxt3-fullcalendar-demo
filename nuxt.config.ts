// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@samk-dev/nuxt-vcalendar'],
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.min.css'], // Vuetify và icon font
  // build: {
  //   transpile: ['vuetify'],
  // },
  // vite: {
  //   plugins: [vuetify()], // Plugin để sử dụng Vuetify với Vite
  // },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})