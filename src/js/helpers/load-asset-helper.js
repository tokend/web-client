import { api } from '@/api'
import { Asset } from '@/js/helpers/assets-helper'

export async function loadAssets (accountId) {
  const endpoint = `/v3/accounts/${accountId}`
  const { data: account } = await api.getWithSignature(endpoint, {
    include: ['balances.asset'],
  })

  const assets = account.balances
    .map(b => b.asset)
    .map(a => new Asset(a))

  return assets
}

export function findOwnedAssets (assets, accountId) {
  return assets.filter(a => a.owner === accountId)
}

export function findBaseAssets (assets) {
  return assets.filter(a => a.isBaseAsset)
}

export function findDefaultQuoteAsset (assets) {
  const asset = assets.find(a => a.isDefaultQuoteAsset)
  return asset ? asset.code : ''
}
