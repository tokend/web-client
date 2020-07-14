import { BlobRecord } from '@/js/records/entities/blob.record'
import { base, BLOB_TYPES } from '@tokend/js-sdk'
import { KycGeneralRecord } from '@/js/records/entities/kyc-general.record'
import { KycCorporateRecord } from '@/js/records/entities/kyc-corporate.record'
import { KycRecord } from '@/js/records/entities/kyc.record'
import { KycRequestRecord } from '@/js/records/requests/kyc-request.record'
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

/**
 * @param {object} [opts]
 * @param {string} [opts.requestId]
 * @param {string} [opts.blobId]
 */
export function buildKycRecoveryOp ({ requestId, blobId } = {}) {
  const opts = buildKycRecoveryOpOpts(blobId)

  return requestId && requestId !== '0'
    ? base.CreateKYCRecoveryRequestBuilder.update(opts, requestId)
    : base.CreateKYCRecoveryRequestBuilder.create(opts)
}

/** @param {string} [blobId] */
function buildKycRecoveryOpOpts (blobId) {
  if (blobId && typeof blobId !== 'string') {
    throw TypeError('blobId should be a string')
  }

  const creatorDetails = blobId ? { blob_id: blobId } : {}

  return {
    targetAccount: getCurrentAccId(),
    signers: createKycRecoverySigners(),
    creatorDetails,
  }
}
