import { Request } from '../../shared/wrappers/request'

import { ASSET_POLICIES } from '@tokend/js-sdk'

import saveGet from 'lodash/get'

export class AssetUpdateRequest extends Request {
  constructor (record) {
    super(record)

    this.assetCode = saveGet(record, 'requestDetails.asset.id')
    this.assetType = saveGet(record, 'requestDetails.type')
    this.assetName = saveGet(record, 'requestDetails.creatorDetails.name')

    this.policy = saveGet(record, 'requestDetails.policies')

    this.terms = saveGet(record, 'requestDetails.creatorDetails.terms')
    this.termsKey = saveGet(record, 'requestDetails.creatorDetails.terms.key')

    this.logo = saveGet(record, 'requestDetails.creatorDetails.logo')
    this.logoKey = saveGet(record, 'requestDetails.creatorDetails.logo.key')
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }

  get isTransferable () {
    return Boolean(this.policy & ASSET_POLICIES.transferable)
  }

  get isWithdrawable () {
    return Boolean(this.policy & ASSET_POLICIES.withdrawable)
  }
}
