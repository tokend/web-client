// TODO: rewrite config to be patient to runtime replacement,
//  typescript autocompletion and security(optional)

import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'
import { GlobalAppConfigType, GlobalAppConfigValueType } from '@/env'
import { isEmpty } from 'lodash-es'

const externalConfig: GlobalAppConfigType = {}

function normalize(value: GlobalAppConfigValueType): GlobalAppConfigValueType {
  if (value === 'true') return true
  if (value === 'false') return false
  return value
}

const env: GlobalAppConfigType = isEmpty(document.ENV)
  ? import.meta.env
  : document.ENV

Object.keys(env).forEach(varName => {
  const value = normalize(env[varName])

  if (varName.startsWith('VITE_')) {
    const key = varName.replace('VITE_', '')
    externalConfig[key] = value
  } else {
    externalConfig[varName] = value
  }
})

export const config = Object.assign(
  {
    API_URL: import.meta.env.VITE_API_URL,
    HOST_URL: import.meta.env.VITE_APP_HOST_URL,
    APP_NAME: import.meta.env.VITE_APP_NAME,
    LOG_LEVEL: 'trace' as LogLevelDesc,
    BUILD_VERSION:
      packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
  },
  import.meta.env ? externalConfig : import.meta.env,
  document.ENV ? externalConfig : document.ENV,
)
