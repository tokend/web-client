import moment from 'moment'
import _get from 'lodash/get'

const STATES = {
  Open: 1,
  Closed: 2,
  Cancelled: 4,
  Promotion: 8,
  Voting: 16
}

export class SaleRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.owner = _get(record, 'ownerId')
    this.baseAsset = _get(record, 'baseAsset')
    this.defaultQuoteAsset = _get(record, 'defaultQuoteAsset')
    this.quoteAssets = _get(record, 'quoteAssets.quoteAssets') || []
    this.baseHardCap = _get(record, 'baseHardCap')
    this.startTime = _get(record, 'startTime')
    this.endTime = _get(record, 'endTime')
    this.softCap = _get(record, 'softCap')
    this.hardCap = _get(record, 'hardCap')
    this.currentCap = _get(record, 'currentCap')

    this.statistics = _get(record, 'statistics')
    this.investors = _get(record, 'statistics.investors')
    this.averageInvestment = _get(record, 'statistics.averageAmount')

    this.state = _get(record, 'state')
    this.stateValue = _get(record, 'state.value')
    this.stateStr = _get(record, 'state.name')

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

  /** quote assets: **/

  get quoteAssetCodes () {
    return this.quoteAssets.map(asset => asset.asset)
  }

  get quoteAssetPrices () {
    return this.quoteAssets.reduce(
      (prices, asset) => {
        prices[asset.asset] = asset.price; return prices
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
  get isCanceled () { return this._isInState(STATES.Cancelled) }
  get isUpcoming () { return moment(this.startTime).isAfter(moment()) }

  /** progress info: **/

  get daysToGo () {
    return moment(this.endTime).diff(moment(), 'days')
  }

  get startsIn () {
    return moment(this.startTime).diff(moment().startOf('day'), 'days')
  }

  get hardCapProgress () {
    return Math.round(this.currentCap / this.hardCap / 100) * 10000
  }

  get softCapProgress () {
    return Math.round(this.currentCap / this.softCap / 100) * 10000
  }
}
