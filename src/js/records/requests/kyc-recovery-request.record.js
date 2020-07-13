import { RequestRecord } from '@/js/records/request-record'
import { KycGeneralRecord } from '@/js/records/entities/kyc-general.record'
import { KycCorporateRecord } from '@/js/records/entities/kyc-corporate.record'
import get from 'lodash/get'

export class KycRecoveryRequestRecord extends RequestRecord {
  /**
   * @constructor
   * @param {object} [record]
   * @param {KycGeneralRecord|KycCorporateRecord} [kycRecord]
   */
  constructor (record = {}, kycRecord = {}) {
    super(record)
    this.kyc = kycRecord
    this.blobId = get(record, 'requestDetails.creatorDetails.blobId')
  }

  get isGeneralKycRecord () {
    return this.kyc instanceof KycGeneralRecord
  }

  get isCorporateKycRecord () {
    return this.kyc instanceof KycCorporateRecord
  }
}
