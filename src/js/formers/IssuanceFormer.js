import { Former } from './Former'
import { str } from './op-build-helpers'
import { Document, base, FEE_TYPES } from '@tokend/js-sdk'
import { createIssuance, calculateFees, loadOwnedAssets } from '@/js/helpers/issuance-helper'

/**
 * Collects the attributes for asset-related operations
 * @class
 * @implements {Former}
 */
export class IssuanceFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      asset: '',
      amount: '',
      receiver: '',
      reference: '',
      creatorDetails: {},
    }
  }

  async buildOps () {
    await Document.uploadDocumentsDeep(this.attrs)
    const result = await this._buildOp()
    return result
  }

  async _buildOp () {
    const attrs = this.attrs
    const receiverBalanceId = await createIssuance(this.attrs)
    const a = {
      asset: attrs.asset,
      amount: str(attrs.amount),
      receiver: receiverBalanceId,
      reference: attrs.reference,
      creatorDetails: {},
    }
    return base.CreateIssuanceRequestBuilder
      .createIssuanceRequest(a)
  }

  async calculateFees (accountId) {
    const response = await calculateFees({
      assetCode: this.attrs.asset,
      amount: this.attrs.amount,
      senderAccountId: accountId,
      type: FEE_TYPES.issuanceFee,
    })
    return response
  }

  populate (source) {
    this.attrs = this.attrs || this._defaultAttrs

    this.attrs.asset = source.asset.code
    this.attrs.amount = source.amount
    this.attrs.receiver = source.receiver
    this.attrs.reference = source.reference
  }

  loadOwnedAssets (accountId) {
    return loadOwnedAssets(accountId)
  }
}
