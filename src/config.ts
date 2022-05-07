import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'
import { pickBy, mapKeys } from 'lodash-es'

interface AppConfig {
  APP_NAME: string
  API_URL: string
  HOST_URL: string
  LOG_LEVEL: LogLevelDesc
  BUILD_VERSION: string
}

export const config: AppConfig = {
  API_URL: import.meta.env.VITE_API_URL,
  HOST_URL: import.meta.env.VITE_APP_HOST_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  LOG_LEVEL: 'trace',
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
} as const

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(document.ENV))

function _mapEnvCfg(env: ImportMetaEnv | typeof document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
