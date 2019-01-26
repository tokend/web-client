import { ASSET_POLICIES } from '@tokend/js-sdk'
import _get from 'lodash/get'

export class AssetRecord {
  constructor (record = {}, balances = []) {
    this._record = record

    this.code = record.code
    this.owner = record.owner
    this.preissuedAssetSigner = record.preissuedAssetSigner

    this.availableForIssuance = record.availableForIssuance
    this.issued = record.issued
    this.maxIssuanceAmount = record.maxIssuanceAmount
    this.pendingIssuance = record.pendingIssuance

    this.details = record.details
    this.name = _get(record, 'details.name')
    this.externalSystemType = _get(record, 'details.externalSystemType')

    this.logo = _get(record, 'details.logo')
    this.logoKey = _get(record, 'details.logo.key')
    this.logoName = _get(record, 'details.logo.name')
    this.logoType = _get(record, 'details.logo.type')

    this.terms = _get(record, 'details.terms')
    this.termsKey = _get(record, 'details.terms.key')
    this.termsName = _get(record, 'details.terms.name')
    this.termsType = _get(record, 'details.terms.type')

    this.policies = this._policies()
    this.policy = this._policy()
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }

  getBalance (balances) {
    const balance = balances.find(balance => balance.asset === this.code)
    if (balance) {
      return {
        value: balance.balance,
        currency: balance.asset,
      }
    } else {
      return {}
    }
  }

  _policies () {
    const policies = this._record.policies || []
    return policies.map(policy => policy.value)
  }

  _policy () {
    return this._policies().reduce((s, p) => s | p, 0)
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
