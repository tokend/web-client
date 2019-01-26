import WAValidator from 'wallet-address-validator'

const ASSETS = {
  btc: 'BTC',
  eth: 'ETH',
}

export function validateAddress (address, asset) {
  switch (asset) {
    case ASSETS.btc:
      return isBTCAddress(address)
    case ASSETS.eth:
      return isETHAddress(address)
    default:
      return false
  }
}

function isETHAddress (address) {
  return /^(0x)?[0-9a-f]{40}$/i.test(address)
}

function isBTCAddress (address) {
  return WAValidator.validate(address, ASSETS.btc, 'both')
}
