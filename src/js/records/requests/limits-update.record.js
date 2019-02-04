import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class LimitsUpdateRequestRecord extends RequestRecord {
  constructor (record) {
    super(record)

    this.requestType = _get(record, 'details.limitsUpdate.details.requestType')
    this.asset = _get(record, 'details.limitsUpdate.details.asset')
  }
}
