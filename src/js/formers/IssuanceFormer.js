import { Former } from './Former'
import { str } from './op-build-helpers'
import { base, FEE_TYPES } from '@tokend/js-sdk'
import { createIssuance } from '@/js/helpers/issuance-helper'
import { calculateFees } from '@/js/helpers/fees-helper'
import { loadOwnedAssets } from '@/js/helpers/load-owned-assets-helper'

/**
 * Collects the attributes for issuance-related operations
 * @class
 * @implements {Former}
 */
export class IssuanceFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      assetCode: '',
      amount: '',
      receiver: '',
      reference: '',
      creatorDetails: {},
    }
  }

  async buildOps () {
    const attrs = this.attrs
    const receiverBalanceId = await createIssuance(this.attrs)
    const result = {
      asset: attrs.assetCode,
      amount: str(attrs.amount),
      receiver: receiverBalanceId,
      reference: attrs.reference,
      creatorDetails: {},
    }

    return base.CreateIssuanceRequestBuilder.createIssuanceRequest(result)
  }

  async calculateFees (accountId) {
    const response = await calculateFees({
      assetCode: this.attrs.assetCode,
      amount: this.attrs.amount,
      senderAccountId: accountId,
      type: FEE_TYPES.issuanceFee,
    })
    return response
  }

  loadOwnedAssets (accountId) {
    const result = loadOwnedAssets(accountId)
    return result
  }
}
