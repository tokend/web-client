/// <reference types="vite/client" />
import { config } from '@config'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { WritableComputedRef } from 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $routes: typeof ROUTE_NAMES
    $icons: typeof ICON_NAMES
    $config: typeof config
    $locale: WritableComputedRef,
  }
}

interface ImportMetaEnv {
  VITE_APP_API_URL: string
  VITE_APP_HOST_URL: string
}

export declare type GlobalAppConfigValueType =
  | string
  | number
  | boolean
  | unknown

export declare type GlobalAppConfigType = Record<{
  string: GlobalAppConfigValueType
}>

declare global {
  interface Document {
    ENV: Record<string, unknown> | undefined
  }
}
