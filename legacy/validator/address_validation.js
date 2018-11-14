import WAValidator from 'wallet-address-validator'

export function validateAddress (address, asset = 'ETH') {
  if (isETHAddress(address)) return true
  if (isBTCAddress(address)) return true
  return false
}

function isETHAddress (address) {
  return /^(0x)?[0-9a-f]{40}$/i.test(address)
}

function isBTCAddress (address) {
  return WAValidator.validate(address, 'BTC', 'both')
}
