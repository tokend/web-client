import { RequestRecord } from '../request-record'

import _get from 'lodash/get'

export class PreIssuanceCreateRequestRecord extends RequestRecord {
  constructor (record, details = {}) {
    super(record)

    this.assetCode = _get(this._record, 'details.createPreIssuance.asset')
    this.amount = _get(this._record, 'details.createPreIssuance.amount')
    this.signature = _get(this._record, 'details.createPreIssuance.signature')
    this.reference = _get(this._record, 'details.createPreIssuance.reference')

    this.attachedDetails = details
  }
}
