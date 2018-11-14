import { DEFAULT_MAX_AMOUNT } from '../const/const'
import { subtract } from '../utils/math.util'
import _get from 'lodash/get'

export class LimitRecord {
  constructor (record) {
    this._record = record
    this.id = _get(record, 'limit.id') || 0
    this.statsOpType = _get(record, 'limit.stats_op_type') || ''
    this.tokenCode = _get(record, 'limit.asset_code') || ''
    this.dailyLimit = _get(record, 'limit.daily_out') || null
    this.weeklyLimit = _get(record, 'limit.weekly_out') || null
    this.monthlyLimit = _get(record, 'limit.monthly_out') || null
    this.annualLimit = _get(record, 'limit.annual_out') || null
    this.isConvertNeeded = _get(record, 'limit.is_convert_needed') || ''
    this.dailySpent = _get(record, 'statistics.daily_outcome') || null
    this.weeklySpent = _get(record, 'statistics.weekly_outcome') || null
    this.monthlySpent = _get(record, 'statistics.monthly_outcome') || null
    this.annualSpent = _get(record, 'statistics.annual_outcome') || null

    if (this.dailyLimit === DEFAULT_MAX_AMOUNT) this.dailyLimit = null
    if (this.weeklyLimit === DEFAULT_MAX_AMOUNT) this.weeklyLimit = null
    if (this.monthlyLimit === DEFAULT_MAX_AMOUNT) this.monthlyLimit = null
    if (this.annualLimit === DEFAULT_MAX_AMOUNT) this.annualLimit = null
    if (this.dailySpent === DEFAULT_MAX_AMOUNT) this.dailySpent = null
    if (this.weeklySpent === DEFAULT_MAX_AMOUNT) this.weeklySpent = null
    if (this.monthlySpent === DEFAULT_MAX_AMOUNT) this.monthlySpent = null
    if (this.annualSpent === DEFAULT_MAX_AMOUNT) this.annualSpent = null
  }

  get dailyLeft () {
    return subtract(this.dailyLimit, this.dailySpent || 0)
  }

  get weeklyLeft () {
    return subtract(this.weeklyLimit, this.weeklySpent || 0)
  }

  get monthlyLeft () {
    return subtract(this.monthlyLimit, this.monthlySpent || 0)
  }

  get annualLeft () {
    return subtract(this.annualLimit, this.annualSpent || 0)
  }

  get limitOuts () {
    return {
      dailyOut: this.dailyLimit,
      weeklyOut: this.weeklyLimit,
      monthlyOut: this.monthlyLimit,
      annualOut: this.annualLimit
    }
  }
}
