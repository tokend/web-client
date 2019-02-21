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
    this.initialPreissuedAmount = record.initialPreissuedAmount
    this.pendingIssuance = record.pendingIssuance

    this.details = record.creatorDetails
    this.name = _get(record, 'creatorDetails.name')
    this.externalSystemType = _get(record, 'creatorDetails.externalSystemType')

    this.logo = _get(record, 'creatorDetails.logo')
    this.logoKey = _get(record, 'creatorDetails.logo.key')
    this.logoName = _get(record, 'creatorDetails.logo.name')
    this.logoType = _get(record, 'creatorDetails.logo.type')

    this.terms = _get(record, 'creatorDetails.terms')
    this.termsKey = _get(record, 'creatorDetails.terms.key')
    this.termsName = _get(record, 'creatorDetails.terms.name')
    this.termsType = _get(record, 'creatorDetails.terms.type')

    this.policies = this._policies()
    this.policy = this._policy()

    this.balance = this._getBalance(balances)
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }

  _getBalance (balances) {
    const balance = balances.find(balance => balance.asset === this.code)
    if (balance) {
      return {
        value: balance.balance,
        currency: balance.asset,
        id: balance.balanceId,
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

  get nameAndCode () {
    const name = this.name || this.code
    return `${name} (${this.code})`
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
