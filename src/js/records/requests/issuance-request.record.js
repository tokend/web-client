import { RequestRecord } from '@/js/records/request-record'
import _get from 'lodash/get'

export class IssuanceRequest extends RequestRecord {
  constructor (record) {
    super(record)
    this.amount = _get(record, 'requestDetails.amount')
    this.asset = _get(record, 'requestDetails.asset.id')
    this.date = record.createdAt
    this.reference = record.reference
    this.counterparty = _get(record, 'requestDetails.receiver.id')
  }
}
