import { errors } from '@/js/errors'
import { base } from '@tokend/js-sdk'
import { getReceiverBalanceId, getReceiverAccountId } from './identity-helper'

export async function createIssuance (attrs) {
  const receiverAccountId = await getReceiverAccountId(attrs.receiver)
  const receiverBalanceId = await getReceiverBalanceId(
    receiverAccountId, attrs.assetCode)

  if (receiverBalanceId) {
    await postIssuanceOperation(receiverBalanceId, attrs)
  } else {
    throw new errors.BalanceNotFoundError()
  }

  return receiverBalanceId
}

async function postIssuanceOperation (receiverBalanceId, attrs) {
  base.CreateIssuanceRequestBuilder.createIssuanceRequest({
    asset: attrs.assetCode,
    amount: attrs.amount.toString(),
    receiver: receiverBalanceId,
    reference: attrs.reference,
    creatorDetails: {},
  })
}
