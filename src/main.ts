import './assets/styles/main.css'

import en from './locales/en.json'
import de from './locales/de.json'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

const i18n = createI18n({
  locale: 'en', // default locale
  fallbackLocale: 'en',
  messages: {
    en,
    de,
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
