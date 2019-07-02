import { ASSET_POLICIES } from '@tokend/js-sdk'
import safeGet from 'lodash/get'

export class AssetRecord {
  constructor (record = {}, balances = []) {
    this._record = record

    this.code = record.id
    this.owner = safeGet(record, 'owner.id')
    this.assetType = record.assetType || record.type
    this.preissuedAssetSigner = record.preIssuanceAssetSigner

    this.availableForIssuance = record.availableForIssuance
    this.issued = record.issued
    this.maxIssuanceAmount = record.maxIssuanceAmount
    this.initialPreissuedAmount = record.initialPreissuedAmount
    this.pendingIssuance = record.pendingIssuance
    this.trailingDigitsCount = record.trailingDigits

    this.details = record.details
    this.name = safeGet(record, 'details.name')
    this.externalSystemType = safeGet(record, 'details.externalSystemType')
    this.isCoinpayments = safeGet(record, 'details.isCoinpayments')

    this.logo = safeGet(record, 'details.logo')
    this.logoKey = safeGet(record, 'details.logo.key')
    this.logoName = safeGet(record, 'details.logo.name')
    this.logoType = safeGet(record, 'details.logo.type')

    this.maturityDate = safeGet(record, 'details.maturityDate')
    this.annualReturn = safeGet(record, 'details.annualReturn')
    this.subtype = safeGet(record, 'details.subtype')

    this.terms = safeGet(record, 'details.terms')
    this.termsKey = safeGet(record, 'details.terms.key')
    this.termsName = safeGet(record, 'details.terms.name')
    this.termsType = safeGet(record, 'details.terms.type')

    this.policies = this._policies()
    this.policy = this._policy()

    this.balance = this._getBalance(balances)
    this.convertedBalance = this._getConvertedBalance(balances)

    this.stellarAssetCode = safeGet(record, 'details.stellar.assetCode') || ''
    this.stellarAssetType = safeGet(record, 'details.stellar.assetType') || ''
    this.stellarWithdraw = safeGet(record, 'details.stellar.withdraw') || false
    this.stellarDeposit = safeGet(record, 'details.stellar.deposit') || false

    this.description = safeGet(record, 'details.description') || ''
  }

  _getBalance (balances) {
    const balance = balances.find(balance => balance.asset.code === this.code)
    if (balance) {
      return {
        value: balance.balance,
        currency: balance.asset,
        id: balance.id,
      }
    } else {
      return {}
    }
  }

  _getConvertedBalance (balances) {
    const balance = balances.find(balance => balance.asset.code === this.code)
    if (balance) {
      return {
        value: balance.convertedBalance,
        currency: balance.convertedToAsset,
      }
    } else {
      return {}
    }
  }

  _policies () {
    const policies = safeGet(this._record, 'policies.flags') || []
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

  get isBaseInAtomicSwap () {
    return !!(this.policy & ASSET_POLICIES.canBeBaseInAtomicSwap)
  }

  get isQuoteInAtomicSwap () {
    return !!(this.policy & ASSET_POLICIES.canBeQuoteInAtomicSwap)
  }

  get isFiat () {
    return !!this.details.isFiat
  }

  get isRequiresKYC () {
    return this.assetType
  }
}
