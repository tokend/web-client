import { Request } from '../../shared/wrappers/request'

import safeGet from 'lodash/get'

export class SaleCreationRequest extends Request {
  constructor (record) {
    super(record)

    this.id = safeGet(record, 'requestDetails.id')
    this.name = safeGet(record, 'requestDetails.creatorDetails.name')

    this.baseAsset = safeGet(record, 'requestDetails.baseAsset.id')
    this.defaultQuoteAsset = safeGet(
      record, 'requestDetails.defaultQuoteAsset.id'
    )
    this.baseAssetForHardCap = safeGet(
      record, 'requestDetails.baseAssetForHardCap'
    )
    this.quoteAssets = this._getQuoteAssets(record)

    this.startTime = safeGet(record, 'requestDetails.startTime')
    this.endTime = safeGet(record, 'requestDetails.endTime')

    this.softCap = safeGet(record, 'requestDetails.softCap')
    this.hardCap = safeGet(record, 'requestDetails.hardCap')

    this.description = safeGet(
      record, 'requestDetails.creatorDetails.description'
    )
    this.shortDescription = safeGet(
      record, 'requestDetails.creatorDetails.shortDescription'
    )

    this.logo = safeGet(record, 'requestDetails.creatorDetails.logo')
    this.logoKey = safeGet(record, 'requestDetails.creatorDetails.logo.key')

    this.youtubeVideoId = safeGet(
      record, 'requestDetails.creatorDetails.youtubeVideoId'
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
    return safeGet(record, 'requestDetails.quoteAssets', [])
      .map(asset => asset.id)
  }
}
