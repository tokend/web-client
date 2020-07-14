import { BlobRecord } from '@/js/records/entities/blob.record'
import { base, BLOB_TYPES } from '@tokend/js-sdk'
import { KycGeneralRecord } from '@/js/records/entities/kyc-general.record'
import { KycCorporateRecord } from '@/js/records/entities/kyc-corporate.record'
import { KycRecord } from '@/js/records/entities/kyc.record'
import { KycRequestRecord } from '@/js/records/requests/kyc-request.record'
import { KycRecoveryRequestRecord } from '@/js/records/requests/kyc-recovery-request.record'
import { getCurrentAccId } from '@/js/helpers/api-helpers'
import { createKycRecoverySigners } from '@/js/helpers/signers-helpers'

export function createKycRecord (blob) {
  if (!(blob instanceof BlobRecord)) {
    throw new TypeError(`Expected blob to be a BlobRecord, got ${typeof blob}`)
  }

  switch (blob.type) {
    case BLOB_TYPES.kycGeneral: return new KycGeneralRecord(blob)
    case BLOB_TYPES.kycCorporate: return new KycCorporateRecord(blob)
    default: return new KycRecord(blob)
  }
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

/** @param {KycRecoveryRequestRecord} [request] */
export function buildUnverifiedKycRecoveryOp (request) {
  const opts = {
    targetAccount: getCurrentAccId(),
    signers: createKycRecoverySigners(),
    creatorDetails: {},
  }
  const shouldUpdate = request instanceof KycRecoveryRequestRecord &&
    request.isExists &&
    !request.isPermanentlyRejected
  if (shouldUpdate) {
    return base.CreateKYCRecoveryRequestBuilder.update(opts, request.id)
  } else {
    return base.CreateKYCRecoveryRequestBuilder.create(opts)
  }
}
