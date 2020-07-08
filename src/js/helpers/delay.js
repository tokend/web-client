export function delay (ms) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise(resolve => setTimeout(resolve, ms))
}
