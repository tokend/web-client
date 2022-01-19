import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'

export const config = {
  API_URL: import.meta.env.VITE_APP_API_URL,
  HOST_URL: import.meta.env.VITE_APP_HOST_URL,
  APP_NAME: 'Vue Vite Template',
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
} as const
