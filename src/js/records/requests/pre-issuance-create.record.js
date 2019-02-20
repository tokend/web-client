import { RequestRecord } from '../request-record'

import _get from 'lodash/get'

export class PreIssuanceCreateRequestRecord extends RequestRecord {
  constructor (record, details = {}) {
    super(record)

    this.assetCode = _get(this._record, 'details.preIssuanceCreate.asset')
    this.amount = _get(this._record, 'details.preIssuanceCreate.amount')
    this.signature = _get(this._record, 'details.preIssuanceCreate.signature')
    this.reference = _get(this._record, 'details.preIssuanceCreate.reference')

    this.attachedDetails = details
  }
}
