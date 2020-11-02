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
    return [this._buildOp()]
  }

  _buildOp () {
    const attrs = this.attrs
    createIssuance(this.attrs.receiver, this.attrs.asset)

    return base.CreateIssuanceRequestBuilder
      .createIssuanceRequest({
        asset: attrs.asset,
        amount: str(attrs.amount),
        receiver: attrs.receiver,
        reference: attrs.reference,
        creatorDetails: {},
      })
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
