import { Request } from '../../shared/wrappers/request'

import { ASSET_POLICIES } from '@tokend/js-sdk'

import safeGet from 'lodash/get'

export class CreateAssetRequest extends Request {
  constructor (record) {
    super(record)

    this.assetCode = safeGet(record, 'requestDetails.asset.id')
    this.assetType = safeGet(record, 'requestDetails.type')
    this.assetName = safeGet(record, 'requestDetails.creatorDetails.name')

    this.initialPreissuedAmount = safeGet(
      record, 'requestDetails.initialPreissuedAmount'
    )
    this.maxIssuanceAmount = safeGet(record, 'requestDetails.maxIssuanceAmount')
    this.preIssuanceAssetSigner = safeGet(
      record, 'requestDetails.preIssuanceAssetSigner'
    )

    this.policy = safeGet(record, 'requestDetails.policies')

    this.terms = safeGet(record, 'requestDetails.creatorDetails.terms')
    this.termsKey = safeGet(record, 'requestDetails.creatorDetails.terms.key')

    this.logo = safeGet(record, 'requestDetails.creatorDetails.logo')
    this.logoKey = safeGet(record, 'requestDetails.creatorDetails.logo.key')

    this.stellarAssetCode = safeGet(record, 'requestDetails.creatorDetails.stellar.assetCode') || ''
    this.stellarAssetType = safeGet(record, 'requestDetails.creatorDetails.stellar.assetType') || ''
    this.stellarWithdraw = safeGet(record, 'requestDetails.creatorDetails.stellar.withdraw') || false
    this.stellarDeposit = safeGet(record, 'requestDetails.creatorDetails.stellar.deposit') || false

    this.erc20Withdraw = safeGet(record, 'requestDetails.creatorDetails.erc20.withdraw') || false
    this.erc20Deposit = safeGet(record, 'requestDetails.creatorDetails.erc20.deposit') || false
    this.erc20Address = safeGet(record, 'requestDetails.creatorDetails.erc20.address') || ''
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
