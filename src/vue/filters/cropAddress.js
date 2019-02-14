export function cropAddress (value) {
  return `${value.slice(0, 4)}…${value.slice(-4)}`
}
