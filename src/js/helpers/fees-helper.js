import { FEE_TYPES, PAYMENT_FEE_SUBTYPES, base } from '@tokend/js-sdk'
import { api } from '@/api'
import { getAccountIdByIdentifier } from '@/js/helpers/identity-helper'

import { Fee } from '@/vue/common/fees/fee'
import { FeesCollection } from '@/vue/common/fees/fees-collection'

/**
   * @param {object} opts
   * @param {string} opts.assetCode - Fee asset code.
   * @param {string} opts.amount - Amount of asset to calculate fees.
   * @param {FeeType} opts.type - Fee XDR enum type.
   * @param {string} opts.senderAccountId - Sender account ID.
   * @param {string} [opts.recipientAccountId] - Recipient account ID
   *                                             (only for payment type).
   * @returns {FeesCollection} - Fees collection.
   */
export async function calculateFees (opts) {
  let fees = []

  const sourceFee = await calculateFee({
    accountId: opts.senderAccountId,
    type: opts.type,
    subtype: PAYMENT_FEE_SUBTYPES.outgoing,
    assetCode: opts.assetCode,
    amount: opts.amount,
  })
  fees.push(sourceFee)

  if (opts.recipientAccountId) {
    const destinationFee = await calculateFee({
      accountId: opts.recipientAccountId,
      type: opts.type,
      subtype: PAYMENT_FEE_SUBTYPES.incoming,
      assetCode: opts.assetCode,
      amount: opts.amount,
    })
    fees.push(destinationFee)
  }

  return new FeesCollection({ fees, assetCode: opts.assetCode })
}

async function calculateFee ({ accountId, type, subtype, assetCode, amount }) {
  const endpoint = `/v3/accounts/${accountId}/calculated_fees`
  const params = {
    fee_type: type,
    asset: assetCode,
    amount,
  }

  if (type === FEE_TYPES.paymentFee) {
    params.subtype = subtype
  }

  const { data: fee } = await api.get(endpoint, params)

  return new Fee({
    type,
    subtype,
    assetCode,
    amount,
    fixed: fee.fixed,
    calculatedPercent: fee.calculatedPercent,
  })
}

export async function getCounterparty (recipient) {
  if (!base.Keypair.isValidPublicKey(recipient)) {
    return getAccountIdByIdentifier(recipient)
  } else {
    return recipient
  }
}
