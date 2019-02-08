import { ASSET_POLICIES } from '@tokend/js-sdk'
import safeGet from 'lodash/get'

export class AssetRecord {
  constructor (record) {
    this._record = record

    this.code = record.id

    this.issued = record.issued
    this.trailingDigits = record.trailingDigits
    this.pendingIssuance = record.pendingIssuance
    this.maxIssuanceAmount = record.maxIssuanceAmount
    this.availableForIssuance = record.availableForIssuance
    this.preIssuanceAssetSigner = record.preIssuanceAssetSigner

    this.policy = record.policies.int
    this.policies = record.policies
    this.details = record.details

    this.ownerId = record.owner.id

    this.name = safeGet(record, 'details.name')

    this.logo = safeGet(record, 'details.logo')
    this.logoKey = safeGet(record, 'details.logo.key')
    this.logoName = safeGet(record, 'details.logo.name')
    this.logoType = safeGet(record, 'details.logo.type')

    this.terms = safeGet(record, 'details.terms')
    this.termsKey = safeGet(record, 'details.terms.key')
    this.termsName = safeGet(record, 'details.terms.name')
    this.termsType = safeGet(record, 'details.terms.type')

    this.externalSystemType = null // TODO: missing on API
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }

  get isBaseAsset () {
    return !!(this.policy & ASSET_POLICIES.baseAsset)
  }

  get isDepositable () {
    return !!this.externalSystemType
  }

  get isIssuanceManualReviewRequired () {
    return !!(this.policy & ASSET_POLICIES.issuanceManualReviewRequired)
  }

  get isRequiresKYC () {
    return !!(this.policy & ASSET_POLICIES.requiresKyc)
  }

  get isStatsQuoteAsset () {
    return !!(this.policy & ASSET_POLICIES.statsQuoteAsset)
  }

  get isTwoStepWithdrawal () {
    return !!(this.policy & ASSET_POLICIES.twoStepWithdrawal)
  }

  get isTransferable () {
    return !!(this.policy & ASSET_POLICIES.transferable)
  }

  get isWithdrawable () {
    return !!(this.policy & ASSET_POLICIES.withdrawable) ||
      !!(this.policy & ASSET_POLICIES.withdrawableV2)
  }
}
