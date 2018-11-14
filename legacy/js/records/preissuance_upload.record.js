import _get from 'lodash/get'
import { RequestRecord } from './request.record'

export class PreIssuanceRequestRecord extends RequestRecord {
  constructor (record, attachedDetails = {}) {
    super(record)
    this._record = record
    this.amount = _get(this._record, 'details.pre_issuance_create.amount')
    this.asset = _get(this._record, 'details.pre_issuance_create.asset')
    this.reference = _get(this._record, 'details.pre_issuance_create.reference')
    this.signature = _get(this._record, 'details.pre_issuance_create.signature')
    this.details = _get(this._record, 'details')
    this.attachedDetails = attachedDetails
  }

  attachDetails (details) {
    this.attachedDetails = { ...this.attached, ...details }
  }
}
