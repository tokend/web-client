import safeGet from 'lodash/get'
import { SALE_DEFINITION_TYPES } from '@/js/const/sale-definition-types.const'

export class CreateSaleRequest {
  constructor (record) {
    this.name = safeGet(record, 'requestDetails.creatorDetails.name')

    this.baseAsset = safeGet(record, 'requestDetails.baseAsset.id')
    this.defaultQuoteAsset = safeGet(
      record, 'requestDetails.defaultQuoteAsset.id'
    )
    this.assetsToSell = safeGet(
      record, 'requestDetails.baseAssetForHardCap'
    )
    this.quoteAssets = this._getQuoteAssets(record)

    this.startTime = safeGet(record, 'requestDetails.startTime')
    this.endTime = safeGet(record, 'requestDetails.endTime')

    this.softCap = safeGet(record, 'requestDetails.softCap')
    this.hardCap = safeGet(record, 'requestDetails.hardCap')

    this.descriptionBlobId = safeGet(
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

    this.definitionType = safeGet(record, 'requestDetails.accessDefinitionType.value')
    this.saleType = safeGet(record, 'requestDetails.saleType.value') + ''
  }

  get isWhitelisted () {
    return this.definitionType === SALE_DEFINITION_TYPES.whitelist
  }

  _getQuoteAssets (record) {
    return safeGet(record, 'requestDetails.quoteAssets', [])
      .map(asset => asset.id)
  }
}
