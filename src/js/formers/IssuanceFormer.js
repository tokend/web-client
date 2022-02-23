import { Former } from './Former'
import { str } from './op-build-helpers'
import { base, FEE_TYPES } from '@tokend/js-sdk'
import { getReceiverAccountId, getReceiverBalanceId } from '@/js/helpers/identity-helper'
import { calculateFees } from '@/js/helpers/fees-helper'
import { errors } from '@/js/errors'

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
    }
  }

  async buildOps () {
    const attrs = this.attrs
    const receiverAccountId = await getReceiverAccountId(attrs.receiver)
    const receiverBalanceId = await getReceiverBalanceId(
      receiverAccountId,
      attrs.assetCode,
    )
    if (!receiverBalanceId) {
      throw new errors.BalanceNotFoundError()
    }

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
}
