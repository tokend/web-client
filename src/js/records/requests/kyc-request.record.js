import { RequestRecord } from '@/js/records/request-record'
import { KycGeneralRecord } from '@/js/records/entities/kyc-general.record'
import { KycCorporateRecord } from '@/js/records/entities/kyc-corporate.record'
import get from 'lodash/get'

export class KycRequestRecord extends RequestRecord {
  /**
   * @constructor
   * @param {object} [record]
   * @param {KycGeneralRecord|KycCorporateRecord} [kycRecord]
   */
  constructor (record = {}, kycRecord = {}) {
    super(record)

    const requestDetails = record.requestDetails || {}
    const creatorDetails = requestDetails.creatorDetails || {}

    this.kyc = kycRecord
    this.blobId = creatorDetails.blobId
    this.resetReason = creatorDetails.resetReason
    this.blockReason = creatorDetails.blockReason
    this.prevApprovedReqId = creatorDetails.latestApprovedRequestId

    this.externalDetails = (get(record, 'externalDetails.data') || []).pop()
  }

  get isGeneralKycRecord () {
    return this.kyc instanceof KycGeneralRecord
  }

  get isCorporateKycRecord () {
    return this.kyc instanceof KycCorporateRecord
  }

  get isReset () {
    return Boolean(this.resetReason)
  }
}
