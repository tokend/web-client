import { errors } from '@/js/errors'
import { api } from '@/api'
import { base, FEE_TYPES } from '@tokend/js-sdk'
import { email } from '@validators'
import { Fee } from '@/vue/common/fees/fee'
import { FeesCollection } from '@/vue/common/fees/fees-collection'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { Asset } from './asset-helper'

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

async function getReceiverBalanceId (receiverAccountId, assetCode) {
  const endpoint = `/v3/accounts/${receiverAccountId}`
  const { data: account } = await api.get(endpoint, {
    include: ['balances.asset'],
  })

  const balance = account.balances
    .find(item => item.asset.id === assetCode)

  return balance ? balance.id : ''
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

async function getReceiverAccountId (receiver) {
  let accountId

  if (email(receiver)) {
    accountId = await getAccountIdByEmail(receiver)
  } else {
    accountId = receiver
  }

  return accountId
}

async function getAccountIdByEmail (email) {
  const { data } = await api.get('/identities', {
    filter: { email },
    page: { limit: 1 },
  })

  if (data && data[0]) {
    return data[0].address
  } else {
    throw new errors.UserDoesntExistError()
  }
}

export async function loadOwnedAssets (ownerAccountId) {
  const endpoint = `/v3/accounts/${ownerAccountId}`
  const { data: account } = await api.get(endpoint, {
    include: ['balances.asset'],
  })

  const ownedAssets = account.balances
    .map(b => b.asset)
    .map(a => new Asset(a))
    .filter(a => a.owner === ownerAccountId)

  return ownedAssets
}

export async function calculateFees (opts) {
  const asset = await getAssetByCode(opts.assetCode)
  const masterAccountId = api.networkDetails.adminAccountId
  let fees = []

  const sourceFee = await calculateFee({
    assetCode: opts.assetCode,
    amount: opts.amount,
    senderAccountId: opts.senderAccountId,
    type: opts.type,
  })
  fees.push(sourceFee)

  if (opts.accountId) {
    const destinationFee = await calculateFee({
      assetCode: opts.assetCode,
      amount: opts.amount,
      senderAccountId: opts.senderAccountId,
      type: opts.type,
    })
    fees.push(destinationFee)
  }

  return new FeesCollection({ fees, asset, masterAccountId })
}

async function getAssetByCode (assetCode) {
  const { data: asset } = await api.get(`/v3/assets/${assetCode}`)
  return new AssetRecord(asset)
}

async function calculateFee ({ assetCode, amount, senderAccountId, type }) {
  const endpoint = `/v3/accounts/${senderAccountId}/calculated_fees`
  const params = {
    fee_type: type,
    asset: assetCode,
    amount,
  }

  if (type === FEE_TYPES.paymentFee) {
    params.subtype = type
  }

  const { data: fee } = await api.get(endpoint, params)

  return new Fee({
    type,
    assetCode,
    amount,
    fixed: fee.fixed,
    calculatedPercent: fee.calculatedPercent,
  })
}
