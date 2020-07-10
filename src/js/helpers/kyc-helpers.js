import { BlobRecord } from '@/js/records//entities/blob.record'
import { BLOB_TYPES } from '@tokend/js-sdk'
import { KycGeneralRecord } from '@/js/records/entities/kyc-general.record'
import { KycCorporateRecord } from '@/js/records/entities/kyc-corporate.record'
import { KycRecord } from '@/js/records/entities/kyc.record'
import { KycRequestRecord } from '@/js/records/requests/kyc-request.record'

export function createKycRecord (blob) {
  if (!(blob instanceof BlobRecord)) {
    throw new TypeError(`Expected blob to be a BlobRecord, got ${typeof blob}`)
  }

  if (blob.type === BLOB_TYPES.kycGeneral) {
    return new KycGeneralRecord(blob)
  }

  if (blob.type === BLOB_TYPES.kycCorporate) {
    return new KycCorporateRecord(blob)
  }

  return new KycRecord(blob)
}

export function isRoleUnset (kycRequest) {
  if (!(kycRequest instanceof KycRequestRecord)) return true
  return !kycRequest.isExists ||
    kycRequest.isReset ||
    (!kycRequest.prevApprovedReqId && kycRequest.isPermanentlyRejected) ||
    (!kycRequest.prevApprovedReqId && kycRequest.isCanceled)
}

const US_RESIDENCES = ['UM', 'US', 'VI']
export function isUSResidence (countryCode) {
  return US_RESIDENCES.includes(countryCode)
}
