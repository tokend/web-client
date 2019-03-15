import { Request } from '../../shared/wrappers/request'

import saveGet from 'lodash/get'

export class SaleCreationRequest extends Request {
  constructor (record) {
    super(record)

    this.id = saveGet(record, 'requestDetails.id')
    this.name = saveGet(record, 'requestDetails.creatorDetails.name')

    this.baseAsset = saveGet(record, 'requestDetails.baseAsset.id')
    this.defaultQuoteAsset = saveGet(
      record, 'requestDetails.defaultQuoteAsset.id'
    )
    this.baseAssetForHardCap = saveGet(
      record, 'requestDetails.baseAssetForHardCap'
    )
    this.quoteAssets = this._getQuoteAssets(record)

    this.startTime = saveGet(record, 'requestDetails.startTime')
    this.endTime = saveGet(record, 'requestDetails.endTime')

    this.softCap = saveGet(record, 'requestDetails.softCap')
    this.hardCap = saveGet(record, 'requestDetails.hardCap')

    this.description = saveGet(
      record, 'requestDetails.creatorDetails.description'
    )
    this.shortDescription = saveGet(
      record, 'requestDetails.requestDetails.shortDescription'
    )

    this.logo = saveGet(record, 'requestDetails.creatorDetails.logo')
    this.logoKey = saveGet(record, 'requestDetails.creatorDetails.logo.key')

    this.youtubeVideoId = saveGet(
      record, 'requestDetails.requestDetails.youtubeVideoId'
    )
  }

  get youtubeVideoUrl () {
    if (this.youtubeVideoId) {
      return `https://www.youtube.com/watch?v=${this.youtubeVideoId}`
    } else {
      return ''
    }
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  _getQuoteAssets (record) {
    return saveGet(record, 'requestDetails.quoteAssets', [])
      .map(asset => asset.id)
  }
}
