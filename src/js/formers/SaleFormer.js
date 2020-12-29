import { Former } from './Former'
import { Document, base, SALE_TYPES } from '@tokend/js-sdk'
import { DateUtil, MathUtil } from '@/js/utils'

import {
  createSaleDescriptionBlobId,
  createBalancesIfNotExist,
  loadAssetsPairsByQuote,
} from '@/js/helpers/sale-helper'

/**
 * Collects the attributes for sale operations
 * @class
 * @implements {Former}
 */
export class SaleFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      saleType: '',
      saleName: '',
      baseAssetCode: '',
      capAssetCode: '',
      startTime: '',
      endTime: '',
      softCap: '',
      hardCap: '',
      assetsToSell: '',
      quoteAssetsCodes: [],
      isWhitelisted: false,
      saleLogo: new Document(),
      shortDescription: '',
      youtubeVideo: '',
      fullDescription: '',
      saleDescriptionBlobId: '',
      creatorAccountId: '',
      balancesAssetsCodes: [],
      assetPairs: '',
      requestId: '0',
    }
  }

  /**
 *
 * @param {Object} source
 * @param {String} saleType: number of sale type
 * @param {String} name: sale name
 * @param {String} baseAsset: base asset code
 * @param {String} defaultQuoteAsset: cap asset code
 * @param {String} startTime: start time
 * @param {String} endTime: end time
 * @param {String} softCap: soft cap
 * @param {String} hardCap: hard cap
 * @param {String} baseAssetForHardCap: assets to sell
 * @param {Array} quoteAssets: assets accepted for investments
 * @param {Boolean} isWhitelisted: is whitelisted
 * @param {Object} logo: sale logo
 * @param {String} shortDescription: short sale description
 * @param {String} youtubeVideoId: youTube video id
 * @param {String} description: full sale description
 */
  populate (source) {
    this.attrs.saleType = +source.saleType
    this.attrs.saleName = source.name
    this.attrs.baseAssetCode = source.baseAsset
    this.attrs.capAssetCode = source.defaultQuoteAsset
    this.attrs.startTime = source.startTime
    this.attrs.endTime = source.endTime
    this.attrs.softCap = source.softCap
    this.attrs.hardCap = source.hardCap
    this.attrs.assetsToSell = source.baseAssetForHardCap
    this.attrs.quoteAssetsCodes = source.quoteAssets
    this.attrs.isWhitelisted = source.isWhitelisted
    this.attrs.saleLogo = source.logo
    this.attrs.shortDescription = source.shortDescription
    this.attrs.youtubeVideo = source.youtubeVideoId
    this.attrs.fullDescription = source.description
  }

  async buildOps () {
    await Document.uploadDocuments([this.attrs.saleLogo])
    return [await this._buildOp()]
  }

  async _buildOp () {
    this.attrs.saleDescriptionBlobId = await createSaleDescriptionBlobId(
      this.attrs.fullDescription,
      this.attrs.creatorAccountId
    )

    await createBalancesIfNotExist({
      balanceAssets: this.attrs.balancesAssetsCodes,
      quoteAssets: this.attrs.quoteAssetsCodes,
      accountId: this.attrs.creatorAccountId,
    })
    this.attrs.assetPairs = await loadAssetsPairsByQuote(
      this.attrs.capAssetCode
    )

    const opts = this._createSaleRequestOpts()
    return base.SaleRequestBuilder.createSaleCreationRequest(opts)
  }

  _createSaleRequestOpts () {
    const saleLogo = this.attrs.saleLogo
    const defaultSaleType = '0'

    return {
      requestID: this.attrs.requestId || '0',
      saleEnumType: this.attrs.saleType,
      saleType: defaultSaleType,
      startTime: DateUtil.toTimestamp(this.attrs.startTime),
      endTime: DateUtil.toTimestamp(this.attrs.endTime),
      baseAsset: this.attrs.baseAssetCode,
      defaultQuoteAsset: this.attrs.capAssetCode,
      softCap: this.attrs.softCap,
      hardCap: this.attrs.hardCap,
      requiredBaseAssetForHardCap: this.attrs.assetsToSell,
      quoteAssets: this._getQuoteAssets(),
      creatorDetails: {
        name: this.attrs.saleName,
        short_description: this.attrs.shortDescription,
        description: this.attrs.saleDescriptionBlobId,
        logo: saleLogo || new Document(),
        youtube_video_id: this.attrs.youtubeVideo,
      },
      saleRules: [{
        forbids: this.attrs.isWhitelisted,
      }],
    }
  }

  _getQuoteAssets () {
    const basePrice = MathUtil.divide(
      this.attrs.hardCap,
      this.attrs.assetsToSell
    )

    let assetPairs = this.attrs.quoteAssetsCodes.map((item) => ({
      asset: item,
      price: this._getPrice(item, basePrice),
    }))

    return assetPairs
  }

  _getPrice (assetCode, basePrice) {
    let result

    const capAssetCode = this.attrs.capAssetCode
    if (capAssetCode !== assetCode) {
      if (this.attrs.saleType === SALE_TYPES.immediate) {
        let assetPair = this.attrs.assetPairs.filter(item =>
          item.baseAndQuote === `${assetCode}/${capAssetCode}`
        )
        result = MathUtil.divide(basePrice, assetPair[0].price)
      } else {
        const defaultQuoteAssetPrice = '1'
        result = defaultQuoteAssetPrice
      }
    } else {
      result = basePrice
    }

    return result
  }
}
