import safeGet from 'lodash/get'

export class UpdateAssetRequest {
  constructor (record) {
    this.id = record.id

    this.code = safeGet(record, 'requestDetails.asset.id')
    this.name = safeGet(record, 'requestDetails.creatorDetails.name')
    this.description = safeGet(record, 'requestDetails.creatorDetails.description')

    this.policy = safeGet(record, 'requestDetails.policies')

    this.terms = safeGet(record, 'requestDetails.creatorDetails.terms')
    this.termsKey = safeGet(record, 'requestDetails.creatorDetails.terms.key')

    this.logo = safeGet(record, 'requestDetails.creatorDetails.logo')
    this.logoKey = safeGet(record, 'requestDetails.creatorDetails.logo.key')

    this.stellarAssetCode = safeGet(record, 'requestDetails.creatorDetails.stellar.assetCode') || ''
    this.stellarAssetType = safeGet(record, 'requestDetails.creatorDetails.stellar.assetType') || ''
    this.stellarWithdraw = safeGet(record, 'requestDetails.creatorDetails.stellar.withdraw') || false
    this.stellarDeposit = safeGet(record, 'requestDetails.creatorDetails.stellar.deposit') || false
  }
}
