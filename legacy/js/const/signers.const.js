import { xdr } from 'tokend-js-sdk'

export const defaultSignerParams = Object.freeze({
  weight: 255,
  identity: 0,
  signerType: signerTypeAll()
})

function signerTypeAll () {
  return xdr.SignerType.values()
    .map(value => value.value)
    .reduce((total, value) => value | total)
}
