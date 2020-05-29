import safeGet from 'lodash/get'

export class CreateAssetRequest {
  constructor (record) {
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

    this.erc20Address = safeGet(record, 'requestDetails.creatorDetails.erc20.address') || ''
    this.erc20Withdraw = safeGet(record, 'requestDetails.creatorDetails.erc20.withdraw') || false
    this.erc20Deposit = safeGet(record, 'requestDetails.creatorDetails.erc20.deposit') || false
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
}
