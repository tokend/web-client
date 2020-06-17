import { detect } from 'detect-browser'

export function isIos () {
  const res = detect()
  return res && res.os === 'iOS'
}

export function isAndroid () {
  const res = detect()
  return res && res.os === 'Android OS'
}
