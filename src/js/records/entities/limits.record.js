import _get from 'lodash/get'
import { MathUtil } from '@/js/utils'

export class LimitsRecord {
  constructor (record = {}, details) {
    this._record = record

    this.assetCode =
      _get(record, 'limits.relationships.asset.data.id') ||
      _get(record, 'statistics.relationships.asset.data.id') ||
      details.assetCode ||
      null

    this.annualOut = _get(record, 'limits.attributes.annualOut') || null
    this.dailyOut = _get(record, 'limits.attributes.dailyOut') || null
    this.weeklyOut = _get(record, 'limits.attributes.weeklyOut') || null
    this.monthlyOut = _get(record, 'limits.attributes.monthlyOut') || null

    this.statsOpType =
      _get(record, 'limits.attributes.statsOpType') ||
      _get(record, 'statistics.attributes.operationType') ||
      details.statsOpType ||
      null

    this.id =
      _get(record, 'limits.id') ||
      _get(record, 'statistics.id') ||
      '0'
  }

  get annualLeft () {
    const annualOutcome = _get(this._record, 'statistics.attributes.annualOut')
    if (!annualOutcome) {
      return this.annualOut
    }

    return MathUtil.subtract(this.annualOut, annualOutcome)
  }

  get dailyLeft () {
    const dailyOutcome = _get(this._record, 'statistics.attributes.dailyOut')
    if (!dailyOutcome) {
      return this.dailyOut
    }

    return MathUtil.subtract(this.dailyOut, dailyOutcome)
  }

  get weeklyLeft () {
    const weeklyOutcome = _get(this._record, 'statistics.attributes.weeklyOut')
    if (!weeklyOutcome) {
      return this.weeklyOut
    }

    return MathUtil.subtract(this.weeklyOut, weeklyOutcome)
  }

  get monthlyLeft () {
    const monthlyOutcome = _get(this._record, 'statistics.attributes.monthlyOut')
    if (!monthlyOutcome) {
      return this.monthlyOut
    }

    return MathUtil.subtract(this.monthlyOut, monthlyOutcome)
  }
}
