import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class SaleRequestRecord extends RequestRecord {
  constructor (record, details = {}) {
    super(record)

    this.baseAsset = _get(this._record, 'details.createSale.baseAsset')
    this.name = _get(this._record, 'details.createSale.creatorDetails.name')
    this.defaultQuoteAsset = _get(
      this._record, 'details.createSale.defaultQuoteAsset'
    )
    this.startTime = _get(
      this._record, 'details.createSale.startTime'
    )
    this.endTime = _get(this._record, 'details.createSale.endTime')
    this.softCap = _get(this._record, 'details.createSale.softCap')
    this.hardCap = _get(this._record, 'details.createSale.hardCap')
    this.baseAssetForHardCap = _get(
      this._record, 'details.createSale.baseAssetForHardCap'
    )
    this.saleTypeStr = _get(this._record, 'details.createSale.saleType.name')
    this.saleType = _get(this._record, 'details.createSale.saleType.value')
    this.saleState = _get(this._record, 'details.createSale.state.value')
    this.saleStateStr = _get(this._record, 'details.createSale.state.name')

    this.details = _get(this._record, 'details.createSale.creatorDetails')
    this.description = _get(
      this._record, 'details.createSale.creatorDetails.description'
    )
    this.logo = _get(this._record, 'details.createSale.creatorDetails.logo')
    this.logoKey = _get(this._record, 'details.createSale.creatorDetails.logo.key')
    this.logoName = _get(this._record, 'details.createSale.creatorDetails.logo.name')
    this.logoType = _get(this._record, 'details.createSale.creatorDetails.logo.type')
    this.shortDescription = _get(
      this._record, 'details.createSale.creatorDetails.shortDescription'
    )
    this.youtubeVideoId = _get(
      this._record, 'details.createSale.creatorDetails.youtubeVideoId'
    )

    this.quoteAssets = this._getQuoteAssets()
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

  _getQuoteAssets () {
    return _get(this._record, 'details.createSale.quoteAssets', [])
      .map(asset => asset.quoteAsset)
  }
}
