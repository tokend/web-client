import { api } from '@/api'
import { Asset } from './asset-helper'

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
