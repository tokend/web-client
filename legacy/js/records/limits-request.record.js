import { RequestRecord } from './request.record'
import _get from 'lodash/get'

export class LimitsRequestRecord extends RequestRecord {
  constructor (record) {
    super(record)
    const details = _get(record, 'details.limits_update.details', '{}')
    this.details = details
    this.rawDocument = details.document || null
    this.tokenCode = details.asset || null
  }
}
