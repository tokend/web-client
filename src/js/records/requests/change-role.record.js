import { RequestRecord } from '@/js/records/entities/request-record'
import { BlobRecord } from '@/js/records/entities/blob.record'
import get from 'lodash/get'

export class KycRequestRecord extends RequestRecord {
  constructor (record = {}, kycBlob) {
    super(record)
    this.setKyc(kycBlob)

    const requestDetails = record.requestDetails || {}
    const creatorDetails = requestDetails.creatorDetails || {}

    this.blobId = creatorDetails.blobId
    this.resetReason = creatorDetails.resetReason
    this.blockReason = creatorDetails.blockReason
    this.prevApprovedReqId = creatorDetails.latestApprovedRequestId

    // TODO: investigate
    this.externalDetails = (get(record, 'externalDetails.data') || []).pop()

    // TODO: remove
    this.creatorDetails = creatorDetails
    this.accountRoleToSet = requestDetails.accountRoleToSet
  }

  setKyc (kyc) {
    if (!(kyc instanceof BlobRecord)) return
    this.kyc = kyc.valueAsObject
    return this
  }
}
