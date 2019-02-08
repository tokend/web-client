export function isValidJSON (str) {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}
