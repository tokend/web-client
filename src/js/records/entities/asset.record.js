import { ASSET_POLICIES, Document } from '@tokend/js-sdk'

import get from 'lodash/get'
import { DOCUMENT_POLICIES } from '@/js/const/document-policies.const'

// TODO: cleanup from unused keys

export class AssetRecord {
  constructor (record = {}, balances = []) {
    this._record = record

    this.code = record.id
    this.owner = get(record, 'owner.id')
    this.assetType = record.assetType || record.type
    this.preissuedAssetSigner = record.preIssuanceAssetSigner

    this.availableForIssuance = record.availableForIssuance
    this.issued = record.issued
    this.maxIssuanceAmount = record.maxIssuanceAmount
    this.initialPreissuedAmount = record.initialPreissuedAmount
    this.pendingIssuance = record.pendingIssuance
    this.trailingDigitsCount = record.trailingDigits

    this.details = record.details
    this.name = get(record, 'details.name')
    this.externalSystemType = get(record, 'details.externalSystemType')
    this.isCoinpayments = get(record, 'details.isCoinpayments')

    const logo = get(record, 'details.logo') || {}
    this.logo = new Document(logo, DOCUMENT_POLICIES[logo.type])
    this.logoKey = logo.key

    const terms = get(record, 'details.terms') || {}
    this.terms = new Document(terms, DOCUMENT_POLICIES[terms.type])
    this.termsKey = terms.key

    this.maturityDate = get(record, 'details.maturityDate')
    this.annualReturn = get(record, 'details.annualReturn')
    this.subtype = get(record, 'details.subtype')

    this.policies = this._policies()
    this.policy = this._policy()

    this.balance = this._getBalance(balances)
    this.convertedBalance = this._getConvertedBalance(balances)

    this.stellarAssetCode = get(record, 'details.stellar.assetCode') || ''
    this.stellarAssetType = get(record, 'details.stellar.assetType') || ''
    this.stellarWithdraw = get(record, 'details.stellar.withdraw') || false
    this.stellarDeposit = get(record, 'details.stellar.deposit') || false

    this.erc20Address = get(record, 'details.erc20.address') || ''
    this.erc20Withdraw = get(record, 'details.erc20.withdraw') || false
    this.erc20Deposit = get(record, 'details.erc20.deposit') || false

    this.description = get(record, 'details.description') || ''
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
    const policies = get(this._record, 'policies.flags') || []
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

  get isUseStellarIntegration () {
    return this.stellarWithdraw || this.stellarDeposit
  }

  get isUseErc20Integration () {
    return this.erc20Withdraw || this.erc20Deposit
  }
}
