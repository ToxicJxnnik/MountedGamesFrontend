/// <reference types="vite/client" />

// Vue i18n type augmentation
declare module 'vue' {
  import type { DefineComponent } from 'vue'
  import type { ComponentCustomProperties } from 'vue'

  interface ComponentCustomProperties {
    $t: (key: string, params?: Record<string, any>) => string
    $i18n: any
  }
}

export {}
