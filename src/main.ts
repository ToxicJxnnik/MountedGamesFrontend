import './assets/styles/main.css'

import en from './locales/en.json'
import de from './locales/de.json'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createAuth0 } from '@auth0/auth0-vue'

import App from './App.vue'
import router from './router'

const i18n = createI18n({
  locale: localStorage.getItem('user-language') || 'de', // default to German, but load saved preference
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
app.use(
  createAuth0({
    domain: 'https://dev-226i7o1uuvc0jkwm.eu.auth0.com',
    clientId: 'xCA6NheNZdTaLZW8r6Pt8bdDUBfZUFmw',
    authorizationParams: {
      redirect_uri: window.location.origin + '/callback',
    },
  }),
)

app.mount('#app')
