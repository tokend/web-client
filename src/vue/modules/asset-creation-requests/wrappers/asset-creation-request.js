import { REQUEST_STATES } from '@/js/const/request-states.const'
import { ASSET_POLICIES } from '@tokend/js-sdk'

import _get from 'lodash/get'

export class AssetCreationRequest {
  constructor (record) {
    this.id = record.id
    this.assetCode = record.reference

    this.createdAt = record.createdAt
    this.updatedAt = record.updatedAt

    this.state = record.state
    this.stateI = record.stateI
    this.rejectReason = record.rejectReason

    this.assetCode = _get(record, 'requestDetails.asset')
    this.assetType = _get(record, 'requestDetails.type')
    this.assetName = _get(record, 'requestDetails.creatorDetails.name')

    this.initialPreissuedAmount = _get(
      record, 'requestDetails.initialPreissuedAmount'
    )
    this.maxIssuanceAmount = _get(record, 'requestDetails.maxIssuanceAmount')
    this.preIssuanceAssetSigner = _get(
      record, 'requestDetails.preIssuanceAssetSigner'
    )

    this.policies = _get(record, 'requestDetails.policies')

    this.terms = _get(record, 'requestDetails.creatorDetails.terms')
    this.termsKey = _get(record, 'requestDetails.creatorDetails.terms.key')
    this.termsName = _get(record, 'requestDetails.creatorDetails.terms.name')
    this.termsType = _get(record, 'requestDetails.creatorDetails.terms.type')

    this.logo = _get(record, 'requestDetails.creatorDetails.logo')
    this.logoKey = _get(record, 'requestDetails.creatorDetails.logo.key')
    this.logoName = _get(record, 'requestDetails.creatorDetails.logo.name')
    this.logoType = _get(record, 'requestDetails.creatorDetails.logo.type')
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }

  get isTransferable () {
    return !!(this.policies & ASSET_POLICIES.transferable)
  }

  get isWithdrawable () {
    return Boolean(this.policies & ASSET_POLICIES.withdrawable)
  }

  get isApproved () {
    return this.stateI === REQUEST_STATES.approved
  }

  get isPending () {
    return this.stateI === REQUEST_STATES.pending
  }

  get isRejected () {
    return this.stateI === REQUEST_STATES.rejected
  }

  get isPermanentlyRejected () {
    return this.stateI === REQUEST_STATES.permanentlyRejected
  }

  get isCanceled () {
    return this.stateI === REQUEST_STATES.canceled
  }
}
