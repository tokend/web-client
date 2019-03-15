import { ASSET_POLICIES } from '@tokend/js-sdk'
import _get from 'lodash/get'

export class AssetRecord {
  constructor (record = {}, balances = []) {
    this._record = record

    this.code = record.code
    this.owner = record.owner
    this.assetType = record.assetType || record.type
    this.preissuedAssetSigner = record.preissuedAssetSigner

    this.availableForIssuance = record.availableForIssuance
    this.issued = record.issued
    this.maxIssuanceAmount = record.maxIssuanceAmount
    this.initialPreissuedAmount = record.initialPreissuedAmount
    this.pendingIssuance = record.pendingIssuance

    this.details = record.details
    this.name = _get(record, 'details.name')
    this.externalSystemType = _get(record, 'details.externalSystemType')
    this.isCoinpayments = _get(record, 'details.isCoinpayments')

    this.logo = _get(record, 'details.logo')
    this.logoKey = _get(record, 'details.logo.key')
    this.logoName = _get(record, 'details.logo.name')
    this.logoType = _get(record, 'details.logo.type')

    this.maturityDate = _get(record, 'details.maturityDate')
    this.annualReturn = _get(record, 'details.annualReturn')
    this.subtype = _get(record, 'details.subtype')

    this.terms = _get(record, 'details.terms')
    this.termsKey = _get(record, 'details.terms.key')
    this.termsName = _get(record, 'details.terms.name')
    this.termsType = _get(record, 'details.terms.type')

    this.policies = this._policies()
    this.policy = this._policy()

    this.balance = this._getBalance(balances)
  }

  logoUrl (storageUrl) {
    if (this.details.logoUrl) {
      return this.details.logoUrl
    } else {
      return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
    }
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

  get record () {
    return this._record
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

  get isFiat () {
    return !!this.details.isFiat
  }

  get isRequiresKYC () {
    return this.assetType
  }
}
