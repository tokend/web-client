export function abbreviate (value) {
  return value
    .split(' ')
    .reduce((res, cur) => res + cur.substr(0, 1).toUpperCase(), '')
}
