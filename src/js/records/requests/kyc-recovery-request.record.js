import { RequestRecord } from '@/js/records/request-record'
import { BlobRecord } from '@/js/records/entities/blob.record'
import { createKycRecord } from '@/js/helpers/kyc-helpers'
import { KycGeneralRecord } from '@/js/records/entities/kyc-general.record'

export class KycRecoveryRequestRecord extends RequestRecord {
  constructor (record = {}, kycBlob = {}) {
    super(record)
    this.setKyc(kycBlob)
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

  get isInProgress () {
    return Boolean(this.stateI)
  }

  get isInitiated () {
    return this.stateI === KycRecoveryRequestRecord.statesEnum.initiated
  }

  get isPending () {
    return this.stateI === KycRecoveryRequestRecord.statesEnum.pending
  }

  get isRejected () {
    return this.stateI === KycRecoveryRequestRecord.statesEnum.rejected
  }

  get isPermanentlyRejected () {
    return this.stateI ===
      KycRecoveryRequestRecord.statesEnum.permanentlyRejected
  }

  static get statesEnum () {
    return {
      none: 0,
      initiated: 1,
      pending: 2,
      rejected: 3,
      permanentlyRejected: 4,
    }
  }
}
