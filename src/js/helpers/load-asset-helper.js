import { api } from '@/api'
import { Asset } from '../wrappers/asset'

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

export function ownedAssets (assets, accountId) {
  return assets.filter(a => a.owner === accountId)
}

export function baseAssets (assets) {
  return assets.filter(a => a.isBaseAsset)
}

export function defaultQuoteAsset (assets) {
  const asset = assets.find(a => a.isDefaultQuoteAsset)
  return asset ? asset.code : ''
}
