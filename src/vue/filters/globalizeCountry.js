import { globalize } from './globalize'

export function globalizeCountry (code, interpolationOps) {
  const key = `countries:${code}`
  return globalize(key, interpolationOps)
}
