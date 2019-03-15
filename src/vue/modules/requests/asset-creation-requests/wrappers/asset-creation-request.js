import { Request } from '../../shared/wrappers/request'

import { ASSET_POLICIES } from '@tokend/js-sdk'

import saveGet from 'lodash/get'

export class AssetCreationRequest extends Request {
  constructor (record) {
    super(record)

    this.assetCode = record.reference

    this.assetCode = saveGet(record, 'requestDetails.asset')
    this.assetType = saveGet(record, 'requestDetails.type')
    this.assetName = saveGet(record, 'requestDetails.creatorDetails.name')

    this.initialPreissuedAmount = saveGet(
      record, 'requestDetails.initialPreissuedAmount'
    )
    this.maxIssuanceAmount = saveGet(record, 'requestDetails.maxIssuanceAmount')
    this.preIssuanceAssetSigner = saveGet(
      record, 'requestDetails.preIssuanceAssetSigner'
    )

    this.policies = saveGet(record, 'requestDetails.policies')

    this.terms = saveGet(record, 'requestDetails.creatorDetails.terms')
    this.termsKey = saveGet(record, 'requestDetails.creatorDetails.terms.key')
    this.termsName = saveGet(record, 'requestDetails.creatorDetails.terms.name')
    this.termsType = saveGet(record, 'requestDetails.creatorDetails.terms.type')

    this.logo = saveGet(record, 'requestDetails.creatorDetails.logo')
    this.logoKey = saveGet(record, 'requestDetails.creatorDetails.logo.key')
    this.logoName = saveGet(record, 'requestDetails.creatorDetails.logo.name')
    this.logoType = saveGet(record, 'requestDetails.creatorDetails.logo.type')
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }

  get isTransferable () {
    return !!(this.policies & ASSET_POLICIES.transferable)
  }

  get isWithdrawable () {
    return Boolean(this.policies & ASSET_POLICIES.withdrawable)
  }
}
