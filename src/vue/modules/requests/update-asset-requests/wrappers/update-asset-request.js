import { Request } from '../../shared/wrappers/request'

import { ASSET_POLICIES } from '@tokend/js-sdk'

import safeGet from 'lodash/get'

export class UpdateAssetRequest extends Request {
  constructor (record) {
    super(record)

    this.assetCode = safeGet(record, 'requestDetails.asset.id')
    this.assetType = safeGet(record, 'requestDetails.type')
    this.assetName = safeGet(record, 'requestDetails.creatorDetails.name')

    this.policy = safeGet(record, 'requestDetails.policies')

    this.terms = safeGet(record, 'requestDetails.creatorDetails.terms')
    this.termsKey = safeGet(record, 'requestDetails.creatorDetails.terms.key')

    this.logo = safeGet(record, 'requestDetails.creatorDetails.logo')
    this.logoKey = safeGet(record, 'requestDetails.creatorDetails.logo.key')
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
