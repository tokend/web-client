export function verbozify (str) {
  return str.charAt(0).toUpperCase() + str.slice(1).split('_').join(' ')
}
