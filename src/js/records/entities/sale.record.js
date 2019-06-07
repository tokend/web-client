import moment from 'moment'
import _get from 'lodash/get'

import { SALE_DEFINITION_TYPES } from '@/js/const/sale-definition-types.const'

const STATES = {
  Open: 1,
  Closed: 2,
  Canceled: 4,
  Promotion: 8,
  Voting: 16,
}

export class SaleRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.owner = _get(record, 'owner.id')
    this.baseAsset = _get(record, 'baseAsset.id')
    this.defaultQuoteAsset = _get(record, 'defaultQuoteAsset.asset.id')
    this.quoteAssets = _get(record, 'quoteAssets') || []
    this.baseHardCap = _get(record, 'baseHardCap')
    this.startTime = _get(record, 'startTime')
    this.endTime = _get(record, 'endTime')
    this.softCap = _get(record, 'defaultQuoteAsset.softCap')
    this.hardCap = _get(record, 'defaultQuoteAsset.hardCap')
    this.currentCap = _get(record, 'defaultQuoteAsset.currentCap')

    this.state = _get(record, 'saleState')
    this.stateValue = _get(record, 'saleState.value')
    this.stateStr = _get(record, 'saleState.name')

    this.definitionType = _get(record, 'accessDefinitionType.value')

    this.details = _get(this._record, 'details')
    this.name = _get(record, 'details.name')
    this.description = _get(record, 'details.description')
    this.shortDescription = _get(record, 'details.shortDescription')
    this.youtubeVideoId = _get(record, 'details.youtubeVideoId')
    this.logo = _get(this._record, 'details.logo')
    this.logoKey = _get(this._record, 'details.logo.key')
    this.logoName = _get(this._record, 'details.logo.name')
    this.logoType = _get(this._record, 'details.logo.type')
  }

  /** URLs **/

  get youtubeVideoUrl () {
    if (this.youtubeVideoId) {
      return `https://www.youtube.com/watch?v=${this.youtubeVideoId}`
    } else {
      return ''
    }
  }

  get isWhitelisted () {
    return this.definitionType === SALE_DEFINITION_TYPES.whitelist
  }

  /** quote assets: **/

  get quoteAssetCodes () {
    return this.quoteAssets.map(asset => asset.asset)
  }

  get quoteAssetPrices () {
    return this.quoteAssets.reduce(
      (prices, asset) => {
        prices[asset.asset.id] = asset.price
        return prices
      }, {})
  }

  get currentCaps () {
    return this.quoteAssets.reduce(
      (caps, asset) => {
        caps[asset.asset] = asset.currentCap; return caps
      }, {})
  }

  get totalCurrentCaps () {
    return this.quoteAssets.reduce(
      (caps, asset) => {
        caps[asset.asset] = asset.totalCurrentCap; return caps
      }, {})
  }

  get hardCaps () {
    return this.quoteAssets.reduce(
      (caps, asset) => {
        caps[asset.asset] = asset.hardCap; return caps
      }, {})
  }

  acceptsQuote (assetCode) {
    return this.quoteAssetCodes.indexOf(assetCode) !== -1
  }

  get acceptsBTC () { return this.acceptsQuote('BTC') }
  get acceptsETH () { return this.acceptsQuote('ETH') }
  get acceptsDAI () { return this.acceptsQuote('DAI') }
  get acceptsDASH () { return this.acceptsQuote('DASH') }

  /** states: **/

  _isInState (state) {
    return this.state.value === state
  }

  get isPromotion () { return this._isInState(STATES.Promotion) }
  get isVoting () { return this._isInState(STATES.Voting) }
  get isOpened () { return this._isInState(STATES.Open) }
  get isClosed () { return this._isInState(STATES.Closed) }
  get isCanceled () { return this._isInState(STATES.Canceled) }
  get isUpcoming () { return moment(this.startTime).isAfter(moment()) }

  /** progress info: **/

  get daysToGo () {
    return moment(this.startTime).diff(moment(), 'days')
  }

  get daysToEnd () {
    return moment(this.endTime).diff(moment(), 'days')
  }

  get daysAfterEnd () {
    if (this.daysToEnd >= 0) {
      return 0
    } else {
      return Math.abs(this.daysToEnd)
    }
  }

  get startsIn () {
    return moment(this.startTime).diff(moment().startOf('day'), 'days')
  }

  get hardCapProgress () {
    return Math.round(this.currentCap / this.hardCap * 10000) / 100
  }

  get softCapProgress () {
    return Math.round(this.currentCap / this.softCap * 10000) / 100
  }
}
