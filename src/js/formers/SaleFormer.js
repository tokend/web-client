import { Former } from './Former'
import { Document, base, SALE_TYPES } from '@tokend/js-sdk'
import { DateUtil, MathUtil } from '@/js/utils'

import {
  createSaleDescriptionBlobId,
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
      saleType: 0,
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
      requestId: '0',
    }
  }

  /**
 *
 * @param {Object} source
 * @param {String} saleId: number of sale
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
    this.attrs = this._defaultAttrs
    this.attrs.requestId = source.id
    this.attrs.saleType = source.saleType
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
    this.attrs.saleLogo = new Document(source.logo)
    this.attrs.shortDescription = source.shortDescription
    this.attrs.youtubeVideo = source.youtubeVideoId
    this.attrs.saleDescriptionBlobId = source.description
  }

  async buildOps () {
    await Document.uploadDocuments([this.attrs.saleLogo])
    return [await this._buildOp()]
  }

  async _buildOp () {
    this.attrs.saleDescriptionBlobId = await createSaleDescriptionBlobId(
      this.attrs.fullDescription
    )

    let assetPairs = await loadAssetsPairsByQuote(
      this.attrs.capAssetCode
    )

    const opts = this._createSaleRequestOpts(assetPairs)
    return base.SaleRequestBuilder.createSaleCreationRequest(opts)
  }

  _createSaleRequestOpts (assetPairs) {
    const saleLogo = this.attrs.saleLogo

    return {
      requestID: this.attrs.requestId || '0',
      saleEnumType: +this.attrs.saleType,
      saleType: '0',
      startTime: DateUtil.toTimestamp(this.attrs.startTime),
      endTime: DateUtil.toTimestamp(this.attrs.endTime),
      baseAsset: this.attrs.baseAssetCode,
      defaultQuoteAsset: this.attrs.capAssetCode,
      softCap: this.attrs.softCap,
      hardCap: this.attrs.hardCap,
      requiredBaseAssetForHardCap: this.attrs.assetsToSell,
      quoteAssets: this._getQuoteAssets(assetPairs),
      creatorDetails: {
        name: this.attrs.saleName,
        short_description: this.attrs.shortDescription,
        description: this.attrs.saleDescriptionBlobId,
        logo: new Document(saleLogo) || new Document(),
        youtube_video_id: this.attrs.youtubeVideo,
      },
      saleRules: [{
        forbids: this.attrs.isWhitelisted,
      }],
    }
  }

  _getQuoteAssets (assetPairs) {
    const basePrice = MathUtil.divide(
      this.attrs.hardCap,
      this.attrs.assetsToSell
    )

    let quoteAssetsCodesAndPrices = this.attrs.quoteAssetsCodes.map((item) => ({
      asset: item,
      price: this._getPrice(item, basePrice, assetPairs),
    }))

    return quoteAssetsCodesAndPrices
  }

  _getPrice (assetCode, basePrice, assetPairs) {
    let result

    const capAssetCode = this.attrs.capAssetCode
    if (capAssetCode !== assetCode) {
      if (this.attrs.saleType === SALE_TYPES.immediate) {
        let assetPair = assetPairs.filter(item =>
          item.baseAndQuote === `${assetCode}/${capAssetCode}`
        )
        result = MathUtil.divide(basePrice, assetPair[0].price)
      } else {
        result = '1'
      }
    } else {
      result = basePrice
    }

    return result
  }
}
