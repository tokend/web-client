import _get from 'lodash/get'

export class LimitsRecord {
  constructor (record = {}, details) {
    this._record = record

    this.assetCode =
      _get(record, 'limit.assetCode') ||
      _get(record, 'statistics.assetCode') ||
      details.assetCode ||
      null

    this.annualOut = _get(record, 'limit.annualOut') || null
    this.dailyOut = _get(record, 'limit.dailyOut') || null
    this.weeklyOut = _get(record, 'limit.weeklyOut') || null
    this.monthlyOut = _get(record, 'limit.monthlyOut') || null

    this.annualSpent = _get(record, 'statistics.annualOut') || null
    this.dailySpent = _get(record, 'statistics.dailyOut') || null
    this.weeklySpent = _get(record, 'statistics.weeklyOut') || null
    this.monthlySpent = _get(record, 'statistics.monthlyOut') || null

    this.statsOpType =
      _get(record, 'limit.statsOpType') ||
      _get(record, 'statistics.statsOpType') ||
      details.statsOpType ||
      null
  }
}
