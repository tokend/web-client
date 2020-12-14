import { Former } from './Former'
import { Document, base, SALE_TYPES } from '@tokend/js-sdk'

import { DateUtil, MathUtil } from '@/js/utils'

import { createSaleDescriptionBlob,
  createBalancesIfNotExist } from '@/js/helpers/sale-helper'
import { api } from '@/api'
import { AssetPairRecord } from '@/js/records/entities/asset-pair.record'
import { loadAllResponsePages } from '@/js/helpers/api-helpers'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { store } from '@/vuex'
import { SALE_CONST } from '@/js/const/sale.const'

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
      baseAsset: '',
      capAsset: '',
      startTime: '',
      endTime: '',
      softCap: '',
      hardCap: '',
      assetsToSell: '',
      quoteAssets: [],
      isWhitelisted: false,
      saleLogo: new Document(),
      shortDescription: '',
      youtubeVideo: '',
      fullDescription: '',
      saleDescriptionBlobId: '',
      creatorAccountId: '',
      assets: [],
      assetPairs: '',
      requestId: '',
    }
  }

  /**
 *
 * @param {Object} source
 * @param {String} saleType: number of sale type
 * @param {String} name: sale name
 * @param {String} baseAsset: base asset
 * @param {String} defaultQuoteAsset: cap asset
 * @param {String} startTime: start time
 * @param {String} endTime: end time
 * @param {String} softCap: soft cap
 * @param {String} hardCap: hard cap
 * @param {String} baseAssetForHardCap: assets to sell
 * @param {Array} quoteAssets: assets accepted for investments
 * @param {Boolean} isWhitelisted: is whitelisted
 * @param {Object} logo: sale logo
 * @param {String} logoKey: sale logo key
 * @param {String} shortDescription: short sale description
 * @param {String} youtubeVideoId: youTube video id
 * @param {String} description: full sale description
 */
  populate (source) {
    this.attrs.saleType = +source.saleType
    this.attrs.saleName = source.name
    this.attrs.baseAsset = source.baseAsset
    this.attrs.capAsset = source.defaultQuoteAsset
    this.attrs.startTime = source.startTime
    this.attrs.endTime = source.endTime
    this.attrs.softCap = source.softCap
    this.attrs.hardCap = source.hardCap
    this.attrs.assetsToSell = source.baseAssetForHardCap
    this.attrs.quoteAssets = source.quoteAssets
    this.attrs.isWhitelisted = source.isWhitelisted
    this.attrs.saleLogo = source.logo
    this.attrs.saleLogo.key = source.logoKey
    this.attrs.shortDescription = source.shortDescription
    this.attrs.youtubeVideo = source.youtubeVideoId || ''
    this.attrs.fullDescription = source.description || ''
  }

  async buildOps () {
    await Document.uploadDocuments([this.attrs.saleLogo])
    return [await this._buildOp()]
  }

  async _buildOp () {
    this.attrs.saleDescriptionBlobId = await createSaleDescriptionBlob(
      this.attrs.fullDescription,
      this.attrs.creatorAccountId
    )

    await createBalancesIfNotExist({
      balanceAssets: this.attrs.assets.map(asset => asset.code),
      quoteAssets: this.attrs.quoteAssets,
      accountId: this.attrs.creatorAccountId,
    })
    this.attrs.assetPairs = await this._loadAssetsPairsByQuote(
      this.attrs.capAsset.code
    )

    const opts = this._createSaleRequestOpts()
    return base.SaleRequestBuilder.createSaleCreationRequest(opts)
  }

  _createSaleRequestOpts () {
    const saleLogo = this.attrs.saleLogo

    return {
      requestID: this.attrs.requestId || SALE_CONST.newCreateSaleRequestId,
      saleEnumType: this.attrs.saleType,
      saleType: SALE_CONST.defaultSaleType,
      startTime: DateUtil.toTimestamp(this.attrs.startTime),
      endTime: DateUtil.toTimestamp(this.attrs.endTime),
      baseAsset: this.attrs.baseAsset.code,
      defaultQuoteAsset: this.attrs.capAsset.code,
      softCap: this.attrs.softCap,
      hardCap: this.attrs.hardCap,
      requiredBaseAssetForHardCap: this.attrs.assetsToSell,
      quoteAssets: this._getQuoteAssets(),
      creatorDetails: {
        name: this.attrs.saleName,
        short_description: this.attrs.shortDescription,
        description: this.attrs.saleDescriptionBlobId,
        logo: saleLogo ? saleLogo.toJSON() : SALE_CONST.emptyDocument,
        youtube_video_id: this.attrs.youtubeVideo,
      },
      saleRules: [{
        forbids: this.attrs.isWhitelisted,
      }],
    }
  }

  _getQuoteAssets () {
    const basePrise = MathUtil.divide(
      this.attrs.hardCap,
      this.attrs.assetsToSell
    )

    let a = this.attrs.quoteAssets.map((item) => ({
      asset: item,
      price: this._getPrice(item, basePrise),
    }))
    return a
  }

  _getPrice (assetCode, basePrise) {
    let result

    const capAsset = this.attrs.capAsset.code
    if (capAsset !== assetCode) {
      if (this.attrs.saleType === SALE_TYPES.immediate) {
        let assetPair = this.attrs.assetPairs.filter(item =>
          item.baseAndQuote === `${assetCode}/${capAsset}`
        )
        result = MathUtil.divide(basePrise, assetPair[0].price)
      } else {
        result = SALE_CONST.defaultQuoteAssetPrice
      }
    } else {
      result = basePrise
    }

    return result
  }

  async _loadAssetsPairsByQuote (quoteAssetCode) {
    let result = await api.get('/v3/asset_pairs', {
      filter: { quote_asset: quoteAssetCode },
      page: { limit: SALE_CONST.maxPageLimit },
    })
    result = await loadAllResponsePages(result)
    return result.map(item => new AssetPairRecord(item))
  }

  async loadBaseAssetsByQuote (quoteAssetCode) {
    let result

    try {
      let assetPairs = await this._loadAssetsPairsByQuote(quoteAssetCode)
      result = assetPairs.map(a => a.baseAssetCode)
        .map(item => store.getters.assetByCode(item))
        .filter(item => item.isBaseAsset)
    } catch (e) {
      result = []
      ErrorHandler.processWithoutFeedback(e)
    }

    return result
  }
}
