import saveGet from 'lodash/get'

export class Asset {
  constructor (record) {
    this.code = saveGet(record, 'requestDetails.asset.id')
    this.name = saveGet(record, 'requestDetails.creatorDetails.name')

    this.logoKey = saveGet(record, 'requestDetails.creatorDetails.logo.key')
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }
}
