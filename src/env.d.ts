/// <reference types="vite/client" />
import { config } from '@config'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { WritableComputedRef } from 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $routes: typeof ROUTE_NAMES
    $icons: typeof ICON_NAMES
    $config: typeof config
    $locale: WritableComputedRef
  }
}

interface ImportMetaEnv {
  VITE_APP_API_URL: string
  VITE_APP_ENVIRONMENT: string
  VITE_APP_LOG_LEVEL: LogLevelDesc
}

declare global {
  interface Document {
    ENV: ImportMetaEnv
  }
}
