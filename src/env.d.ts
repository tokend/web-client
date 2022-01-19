/// <reference types="vite/client" />
import { config } from '@config'
import { ROUTE_NAMES } from '@/enums'
import { WritableComputedRef } from 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $routes: typeof ROUTE_NAMES
    $config: typeof config
    $locale: WritableComputedRef,
  }
}
