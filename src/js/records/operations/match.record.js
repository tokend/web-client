import { OpRecord } from '../op-record'
import _get from 'lodash/get'

const DIRECTIONS_VERBOSE = {
  in: 'in',
  out: 'out'
}

export class MatchRecord extends OpRecord {
  /**
   * @param record
   * @param {object} details
   * @param {string} details.asset
   * @param {bool} details.isSaleMatch
   * @param {string} details.balanceId
   * @param {string} details.accountId
   */

  constructor (record, details) {
    super(record)
    this.asset = details.asset
    this.isSaleMatch = details.isSaleMatch
    this.balanceId = details.balanceId
    this.accountId = details.accountId

    this.participants = record.participants
    this.participant = this._getParticipant()
    this.effects = this._getEffects()
  }

  _getParticipant () {
    return this.participants
      .find(participant => participant.accountId === this.accountId &&
                           participant.balanceId === this.balanceId) || {}
  }

  _getEffects () {
    return _get(this.participant, 'effects', []).map(
      effect => new MatchEffect(effect, {
        isSaleMatch: this.isSaleMatch,
        asset: this.asset,
        date: this.date,
        name: this.name,
        feeAsset: this.asset
      })
    )
  }
}

export class MatchEffect {
  constructor (effect, opts) {
    this._effect = effect
    this.asset = opts.asset
    this.name = opts.name
    this.date = opts.date
    this.feeAsset = opts.feeAsset
    this.isSaleMatch = opts.isSaleMatch

    this.baseAsset = effect.baseAsset
    this.quoteAsset = effect.quoteAsset
    this.counterparty = `${effect.baseAsset} fund`
    this.isBuy = effect.isBuy
    this.matches = effect.matches

    this.quoteAmount = this._getQuoteAmount()
    this.baseAmount = this._getBaseAmount()
    this.price = this._getPrice()
    this.feePaid = this._getFeePaid()
    this.amount = this._getAmount()
    this.direction = this._getDirection()

    this.name = this._getName()
  }

  _getQuoteAmount () {
    return this._effect.matches.reduce(
      (sum, match) => match.quoteAmount + sum, 0
    )
  }

  _getBaseAmount () {
    return this._effect.matches.reduce(
      (sum, match) => match.baseAmount + sum, 0
    )
  }

  _getAmount () {
    if (this.asset === this.quoteAsset) {
      return this.quoteAmount
    }
    return this.baseAmount
  }

  _getPrice () {
    return this.matches[0].price
  }

  _getFeePaid () {
    return this.matches.reduce((sum, match) => match.feePaid + sum, 0)
  }

  _getDirection () {
    if (this.asset === this.quoteAsset) {
      return this.isBuy ? DIRECTIONS_VERBOSE.out : DIRECTIONS_VERBOSE.in
    }
    return this.isBuy ? DIRECTIONS_VERBOSE.in : DIRECTIONS_VERBOSE.out
  }

  _getName () {
    if (!this.isSaleMatch) {
      return 'Order match'
    } else if (this.direction === DIRECTIONS_VERBOSE.in) {
      return 'Tokens received'
    } else {
      return 'Investment'
    }
  }
}
