import { RequestRecord } from './request.record'
import config from '../../../src/config'
import _get from 'lodash/get'
import { DocumentContainer } from '../helpers/DocumentContainer'
import { Keypair } from 'tokend-js-sdk'
export class SaleRequestRecord extends RequestRecord {
  constructor (record = { details: { sale: {} } }) {
    super(record)
    this._details = record.details['sale']
    this.baseAsset = this._details.base_asset || ''
    this.baseAssetForHardCap = this._details.base_asset_for_hard_cap || ''
    this.defaultQuoteAsset = this._details.default_quote_asset || ''
    this.startTime = this._details.start_time || ''
    this.endTime = this._details.end_time || ''
    this.softCap = this._details.soft_cap || ''
    this.hardCap = this._details.hard_cap || ''
    this.quoteAssets =
      (this._details.quote_assets || []).map(a => a.quote_asset)
    this.name = _get(this._details, 'details.name') || ''
    this.description = _get(this._details, 'details.description') || ''
    this.descriptionID = _get(this._details, 'details.description') || ''
    this.shortDescription =
      _get(this._details, 'details.short_description') || ''
    this.youtubeId = _get(this._details, 'details.youtube_video_id') || ''
    this.logo = _get(this._details, 'details.logo')
      ? new DocumentContainer(_get(this._details, 'details.logo'))
      : null
    this.logoUrl = this._getLogoUrl() || ''

    this.saleIndex = this._getIndex()
  }

  _getIndex () {
    return Keypair.random().accountId()
  }

  _getLogoUrl () {
    const key = _get(this._details, 'details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  getDetailsForSave () {
    return {
      details: {
        sale: {
          request_id: this.id,
          base_asset: this.baseAsset,
          base_asset_for_hard_cap: this.baseAssetForHardCap,
          default_quote_asset: this.defaultQuoteAsset,
          start_time: this.startTime,
          end_time: this.endTime,
          soft_cap: this.softCap,
          hard_cap: this.hardCap,
          quote_assets: this.quoteAssets.filter(i => i).map((item) => ({
            quote_asset: item,
            price: '1'
          })),
          details: {
            name: this.name,
            description: this.descriptionID,
            descriptionID: this.descriptionID,
            short_description: this.shortDescription,
            youtube_video_id: this.youtubeId,
            logo: this.logo ? (this.logo).getDetailsForSave() : null
          },
          logoUrl: this.logoUrl,
          saleIndex: this.saleIndex
        }
      }
    }
  }
}
