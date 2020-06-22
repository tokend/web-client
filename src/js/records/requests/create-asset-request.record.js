import get from 'lodash/get'
import { ASSET_POLICIES } from '@tokend/js-sdk'
import { RequestRecord } from '@/js/records/request-record'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

export class CreateAssetRequest extends RequestRecord {
  constructor (record = {}) {
    super(record)

    const dts = record.requestDetails || {}

    this.assetType = dts.type
    this.assetCode = get(dts, 'asset.id')
    this.assetName = get(dts, 'creatorDetails.name')
    this.initialPreissuedAmount = dts.initialPreissuedAmount
    this.maxIssuanceAmount = dts.maxIssuanceAmount
    this.preIssuanceAssetSigner = dts.preIssuanceAssetSigner
    this.policy = dts.policies

    const terms = get(dts, 'creatorDetails.terms') || {}
    this.terms = DocumentContainer.fromObj(terms)
    this.termsKey = terms.key

    const logo = get(dts, 'creatorDetails.logo') || {}
    this.logo = DocumentContainer.fromObj(logo)
    this.logoKey = logo.key

    this.stellarAssetCode = get(dts, 'creatorDetails.stellar.assetCode') || ''
    this.stellarAssetType = get(dts, 'creatorDetails.stellar.assetType') || ''
    this.stellarWithdraw = get(dts, 'creatorDetails.stellar.withdraw') || false
    this.stellarDeposit = get(dts, 'creatorDetails.stellar.deposit') || false

    this.erc20Address = get(record, 'requestDetails.creatorDetails.erc20.address') || ''
    this.erc20Withdraw = get(record, 'requestDetails.creatorDetails.erc20.withdraw') || false
    this.erc20Deposit = get(record, 'requestDetails.creatorDetails.erc20.deposit') || false
  }

  get isErc20IntegrationEnabled () {
    return this.erc20Withdraw || this.erc20Deposit || this.erc20Address || false
  }

  get isStellarIntegrationEnabled () {
    return this.stellarAssetCode ||
      this.stellarAssetType ||
      this.stellarWithdraw ||
      this.stellarDeposit ||
      false
  }

  get isTransferable () {
    return Boolean(this.policy & ASSET_POLICIES.transferable)
  }

  get isWithdrawable () {
    return Boolean(this.policy & ASSET_POLICIES.withdrawable)
  }

  get isBaseInAtomicSwap () {
    return Boolean(this.policy & ASSET_POLICIES.canBeBaseInAtomicSwap)
  }

  get isQuoteInAtomicSwap () {
    return Boolean(this.policy & ASSET_POLICIES.canBeQuoteInAtomicSwap)
  }
}
