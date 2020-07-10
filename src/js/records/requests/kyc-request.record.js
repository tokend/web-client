import { RequestRecord } from '@/js/records/request-record'
import { BlobRecord } from '@/js/records/entities/blob.record'
import { createKycRecord } from '@/js/helpers/kyc-helpers'
import { KycGeneralRecord } from '@/js/records/entities/kyc-general.record'
import get from 'lodash/get'

export class KycRequestRecord extends RequestRecord {
  constructor (record = {}, kycBlob = {}) {
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

  setKyc (kycBlob) {
    if (!(kycBlob instanceof BlobRecord)) return
    this.kyc = createKycRecord(kycBlob)
    return this
  }

  get isGeneralKycRecord () {
    return this.kyc instanceof KycGeneralRecord
  }

  get isCorporateKycRecord () {
    return false // TODO
  }

  get isReset () {
    return Boolean(this.resetReason)
  }
}
