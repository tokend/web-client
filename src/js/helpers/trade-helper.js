import { api } from '@/api'
import { base } from '@tokend/js-sdk'

// eslint-disable-next-line max-len
export async function createAssetBalanceIfNotExists (assetCode, creatorAccountId, accountBalances) {
  if (!getAssetBalanceId(assetCode, accountBalances)) {
    const operation = base.Operation.manageBalance({
      destination: creatorAccountId,
      asset: assetCode,
      action: base.xdr.ManageBalanceAction.createUnique(),
    })
    await api.postOperations(operation)
  }
}

export function getAssetBalanceId (assetCode, accountBalances) {
  return accountBalances.find(i => i.asset.code === assetCode)
}
