import safeGet from 'lodash/get'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

export class Asset {
  constructor (record) {
    this.code = record.id
    this.name = safeGet(record, 'details.name')

    this.policy = safeGet(record, 'policies.value')

    this.terms = safeGet(record, 'details.terms')
    this.termsKey = safeGet(record, 'details.terms.key')

    this.logo = DocumentContainer.fromObj(safeGet(record, 'details.logo'))
    this.logoKey = safeGet(record, 'details.logo.key')

    this.stellarAssetCode = safeGet(record, 'details.stellar.assetCode') || ''
    this.stellarAssetType = safeGet(record, 'details.stellar.assetType') || ''
    this.stellarWithdraw = safeGet(record, 'details.stellar.withdraw') || false
    this.stellarDeposit = safeGet(record, 'details.stellar.deposit') || false

    this.erc20Address = safeGet(record, 'details.erc20.address') || ''
    this.erc20Withdraw = safeGet(record, 'details.erc20.withdraw') || false
    this.erc20Deposit = safeGet(record, 'details.erc20.deposit') || false
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
