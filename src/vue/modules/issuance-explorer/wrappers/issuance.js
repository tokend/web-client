import _get from 'lodash/get'
import { Request } from '@modules/requests/shared/wrappers/request'

export class Issuance extends Request {
  constructor (record) {
    super(record)
    this.amount = _get(record, 'requestDetails.amount')
    this.asset = _get(record, 'requestDetails.asset.id')
    this.date = record.createdAt
    this.reference = record.reference
    this.counterparty = _get(record, 'requestDetails.receiver.id')
  }
}
