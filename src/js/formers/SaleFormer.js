import { Former } from './Former'
import { Document } from '@tokend/js-sdk'
import { api, base } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { DateUtil, MathUtil, SALE_TYPES } from '@/js/utils'

import { createSaleDescriptionBlob,
  createBalancesIfNotExist,
  loadAssetsPairsByQuote } from '@/js/helpers/helper'

import { store } from '@/vuex'

const NEW_CREATE_SALE_REQUEST_ID = '0'
const DEFAULT_SALE_TYPE = '0'

const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

/**
 * Collects the attributes for sale operations
 * @class
 * @implements {Former}
 */
export class SaleFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      type: '',
      name: '',
      baseAsset: {},
      capAsset: {},
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
      description: '',
      saleDescriptionBlobId: '',
      accountId: '',
      assets: [],
      assetPairs: '',
      requestId: '',
    }
  }

  /**
 *
 * @param {Object} source
 * @param {}
 */
  populate (source) {
    this.attrs.type = +source.saleType
    this.attrs.name = source.name
    this.attrs.baseAsset = source.baseAsset
    this.attrs.capAsset = source.defaultQuoteAsset
    this.attrs.startTime = source.startTime
    this.attrs.endTime = source.endTime
    this.attrs.softCap = source.softCap
    this.attrs.hardCap = source.hardCap
    this.attrs.assetsToSell = source.assetsToSell
    this.attrs.quoteAssets = source.quoteAssets
    this.attrs.isWhitelisted = source.isWhitelisted
    this.attrs.saleLogo = source.logo
    this.attrs.saleLogo.key = source.logoKey
    this.attrs.shortDescription = source.shortDescription
    this.attrs.youtubeVideo = source.youtubeVideoId || ''
    this.attrs.description = source.description || ''
  }

  async buildOps () {
    await Document.uploadDocuments([this.attrs.saleLogo])
    return [this._buildOp()]
  }

  async _buildOp () {
    this.attrs.saleDescriptionBlobId = await createSaleDescriptionBlob(
      this.attrs.description,
      this.attrs.accountId
    )

    await createBalancesIfNotExist({
      balanceAssets: this.attrs.assets.map(asset => asset.code),
      quoteAssets: this.attrs.quoteAssets,
      accountId: this.attrs.accountId,
    })

    this.attrs.assetPairs =
      await loadAssetsPairsByQuote(
        this.attrs.capAsset.code
      )
    // eslint-disable-next-line max-len
    return base.SaleRequestBuilder.createSaleCreationRequest(this._saleRequestOpts)
  }

  _createSaleRequestOpts () {
    const saleLogo = this.attrs.saleLogo

    return {
      requestID: this.attrs.requestId || NEW_CREATE_SALE_REQUEST_ID,
      saleEnumType: this.attrs.type,
      saleType: DEFAULT_SALE_TYPE,
      startTime: DateUtil.toTimestamp(this.attrs.startTime),
      endTime: DateUtil.toTimestamp(this.attrs.endTime),
      baseAsset: this.attrs.baseAsset.code,
      defaultQuoteAsset: this.attrs.capAsset.code,
      softCap: this.attrs.softCap,
      hardCap: this.attrs.hardCap,
      requiredBaseAssetForHardCap: this.attrs.assetsToSell,
      quoteAssets: this._getQuoteAssets(),
      creatorDetails: {
        name: this.attrs.name,
        short_description: this.attrs.shortDescription,
        description: this.attrs.saleDescriptionBlobId,
        logo: saleLogo ? saleLogo.toJSON() : EMPTY_DOCUMENT,
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
    let quoteAssets = []
    return quoteAssets.map((item) => ({
      asset: item,
      price: this._getPrice(item, basePrise),
    }))
  }

  _getPrice (assetCode, basePrise) {
    const DEFAULT_QUOTE_ASSET_PRICE = '1'
    let result

    const capAsset = this.informationStepForm.capAsset.code
    if (capAsset !== assetCode) {
      if (this.attrs.type === SALE_TYPES.immediate) {
        let assetPair = this.attrs.assetPairs.filter(item =>
          item.baseAndQuote === `${assetCode}/${capAsset}`
        )
        result = MathUtil.divide(basePrise, assetPair[0].price)
      } else {
        result = DEFAULT_QUOTE_ASSET_PRICE
      }
    } else {
      result = basePrise
    }
    return result
  }

  async loadBaseAssetsByQuote (quoteAssetCode) {
    let result

    try {
      let assetPairs = await this.loadAssetsPairsByQuote(quoteAssetCode)
      result = assetPairs.map(a => a.baseAssetCode)
        .map(item => store.getters.assetByCode(item))
        .filter(item => item.isBaseAsset)
    } catch (e) {
      result = []
      ErrorHandler.processWithoutFeedback(e)
    }

    return result
  }

  async getSaleDescription (blobId, accountId) {
    try {
      const endpoint = `/accounts/${accountId}/blobs/${blobId}`
      const { data: blob } = await api.getWithSignature(endpoint)

      return JSON.parse(blob.value)
    } catch {
      return ''
    }
  }
}
