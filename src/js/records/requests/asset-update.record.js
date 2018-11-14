import { ASSET_POLICIES } from '@tokend/js-sdk/lib/index'
import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class AssetUpdateRequestRecord extends RequestRecord {
  constructor (record, details) {
    super(record)

    this.assetCode = _get(record, 'details.assetUpdate.code')
    this.assetName = _get(this._record, 'details.assetCreate.details.name')

    this.details = _get(this._record, 'details.assetUpdate.details')
    this.terms = _get(this._record, 'details.assetUpdate.details.terms')
    this.termsKey = _get(this._record, 'details.assetUpdate.details.terms.key')
    this.termsName = _get(
      this._record, 'details.assetUpdate.details.terms.name'
    )
    this.termsType = _get(
      this._record, 'details.assetUpdate.details.terms.type'
    )
    this.logo = _get(this._record, 'details.assetUpdate.details.logo')
    this.logoKey = _get(this._record, 'details.assetUpdate.details.logo.key')
    this.logoName = _get(this._record, 'details.assetUpdate.details.logo.name')
    this.logoType = _get(this._record, 'details.assetUpdate.details.logo.type')
    this.externalSystemType = _get(
      this._record, 'details.assetUpdate.details.externalSystemType'
    )

    this.policies = (_get(record, 'details.assetUpdate.policies') || [])
      .map(p => p.value)

    this.attachedDetails = details
  }

  logoUrl (storageUrl) {
    return this.logoKey ? '' : `${storageUrl}/${this.logoKey}`
  }

  termsUrl (storageUrl) {
    return this.termsKey ? '' : `${storageUrl}/${this.termsKey}`
  }

  _policies () {
    return _get(this._record, 'details.assetUpdate.policies', [])
      .map(policy => policy.value)
  }

  _policy () {
    return _get(this._record, 'details.assetUpdate.policies', [])
      .reduce((s, p) => s | p, 0)
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
    return !!(this.policy & ASSET_POLICIES.withdrawable)
  }
}
