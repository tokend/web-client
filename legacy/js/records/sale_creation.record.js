import { RequestRecord } from './request.record'
import config from '../../../src/config'
import _get from 'lodash/get'

export class SaleCreationRecord extends RequestRecord {
  constructor (record, attachedDetails = {}) {
    super(record)
    this._record = record
    this.tokenCode = _get(this._record, 'details.sale.base_asset')
    this.saleName = _get(this._record, 'details.sale.details.name')
    this.defaultQuoteAsset = _get(this._record, 'details.sale.default_quote_asset')
    this.startTime = _get(this._record, 'details.sale.start_time')
    this.endTime = _get(this._record, 'details.sale.end_time')
    this.createdAt = record.created_at
    this.updatedAt = record.updated_at
    this.requestState = record.request_state
    this.requestType = this._getRequestType()
    this.saleLogo = _get(this._record, 'details.sale.details.logo')
    this.saleLogoUrl = this._getSaleLogoUrl()
    this.softCap = _get(this._record, 'details.sale.soft_cap')
    this.hardCap = _get(this._record, 'details.sale.hard_cap')
    this.baseAssetForHardCap = _get(this._record, 'details.sale.base_asset_for_hard_cap')
    this.shortDescription = _get(this._record, 'details.sale.details.short_description')
    this.youtubeVideoId = _get(this._record, 'details.sale.details.youtube_video_id')
    this.youtubeVideoUrl = this._getYoutubeVideoUrl()
    this.quoteAssets = this._getQuoteAssets()
    this.rejectReason = record.reject_reason
  }

  _getRequestType () {
    return _get(this._record, 'details.request_type').replace('_', ' ')
  }

  _getSaleLogoUrl () {
    const key = _get(this._record, 'details.sale.details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getYoutubeVideoUrl () {
    const youtubeId = _get(this._record, 'details.sale.details.youtube_video_id')
    return `https://www.youtube.com/watch?v=${youtubeId}`
  }

  _getQuoteAssets () {
    const quoteAssets = _get(this._record, 'details.sale.quote_assets')
    return quoteAssets.map(asset => asset.quote_asset)
  }
}
