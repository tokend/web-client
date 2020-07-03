const US_RESIDENCES = ['UM', 'US', 'VI']

export function isUSResidence (countryCode) {
  return US_RESIDENCES.includes(countryCode)
}
