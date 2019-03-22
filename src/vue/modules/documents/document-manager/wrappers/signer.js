import safeGet from 'lodash/get'

export class Signer {
  constructor (rawSigner) {
    this.publicKey = rawSigner.id
    this.details = rawSigner.details
  }

  get isAllowedToUpdateMetadata () {
    return safeGet(this.details, 'isAllowedToUpdateMetadata')
  }
}
