import { api } from '@/api'
import { base } from '@tokend/js-sdk'

// eslint-disable-next-line max-len
export async function createAssetPairBalancesIfNotExists (pair, creatorAccountId, accountBalances) {
  if (!getAssetBalanceId(pair.baseAsset.code, accountBalances)) {
    const operation = base.Operation.manageBalance({
      destination: creatorAccountId,
      asset: pair.baseAsset.code,
      action: base.xdr.ManageBalanceAction.createUnique(),
    })
    await api.postOperations(operation)
  }

  if (!getAssetBalanceId(pair.quoteAsset.code, accountBalances)) {
    const operation = base.Operation.manageBalance({
      destination: creatorAccountId,
      asset: pair.quoteAsset.code,
      action: base.xdr.ManageBalanceAction.createUnique(),
    })
    await api.postOperations(operation)
  }
}

export function getAssetBalanceId (assetCode, accountBalances) {
  return accountBalances.find(i => i.asset.code === assetCode)
}
