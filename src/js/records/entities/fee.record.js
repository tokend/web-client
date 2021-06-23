import _get from 'lodash/get'

export class FeeRecord {
  constructor (record) {
    this.fixed = record.fixed
    this.percent = record.percent

    this.asset = _get(record, 'appliedTo.asset')

    this.type = _get(record, 'appliedTo.feeType')
    this.subtype = _get(record, 'appliedTo.subtype')

    this.lowerBound = _get(record, 'appliedTo.lowerBound')
    this.upperBound = _get(record, 'appliedTo.upperBound')
  }
}
