import { ASSET_POLICIES } from '@tokend/js-sdk'
import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class AssetCreateRequestRecord extends RequestRecord {
  constructor (record, details = {}) {
    super(record)

    this.assetName = _get(
      this._record, 'details.assetCreate.details.name'
    )
    this.assetCode = _get(
      this._record, 'details.assetCreate.code'
    )
    this.preissuedAssetSigner = _get(
      this._record, 'details.assetCreate.preIssuedAssetSigner'
    )
    this.maxIssuanceAmount = _get(
      this._record, 'details.assetCreate.maxIssuanceAmount'
    )
    this.initialPreissuedAmount = _get(
      this._record, 'details.assetCreate.initialPreissuedAmount'
    )

    this.policies = this._policies()
    this.policy = this._policy()

    this.details = _get(this._record, 'details.assetCreate.details')
    this.terms = _get(this._record, 'details.assetCreate.details.terms')
    this.termsKey = _get(this._record, 'details.assetCreate.details.terms.key')
    this.termsName = _get(
      this._record, 'details.assetCreate.details.terms.name'
    )
    this.termsType = _get(
      this._record, 'details.assetCreate.details.terms.type'
    )
    this.logo = _get(this._record, 'details.assetCreate.details.logo')
    this.logoKey = _get(this._record, 'details.assetCreate.details.logo.key')
    this.logoName = _get(this._record, 'details.assetCreate.details.logo.name')
    this.logoType = _get(this._record, 'details.assetCreate.details.logo.type')
    this.externalSystemType = _get(
      this._record, 'details.assetCreate.details.externalSystemType'
    )

    this.attachedDetails = details
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }

  _policies () {
    return _get(this._record, 'details.assetCreate.policies', [])
      .map(policy => policy.value)
  }

  _policy () {
    return _get(this._record, 'details.assetCreate.policies', [])
      .map(p => p.value)
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
