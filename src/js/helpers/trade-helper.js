import { api } from '@/api'
import { base } from '@tokend/js-sdk'

// eslint-disable-next-line max-len
export async function createAssetPairBalancesIfNotExists (pair, creatorAccountId, accountBalances) {
  if (!getAssetBalanceId(pair.baseAssetCode, accountBalances)) {
    const operation = base.Operation.manageBalance({
      destination: creatorAccountId,
      asset: pair.baseAssetCode,
      action: base.xdr.ManageBalanceAction.createUnique(),
    })
    await api.postOperations(operation)
  }

  if (!getAssetBalanceId(pair.quoteAssetCode, accountBalances)) {
    const operation = base.Operation.manageBalance({
      destination: creatorAccountId,
      asset: pair.quoteAssetCode,
      action: base.xdr.ManageBalanceAction.createUnique(),
    })
    await api.postOperations(operation)
  }
}

export function getAssetBalanceId (assetCode, accountBalances) {
  return accountBalances.find(i => i.asset.code === assetCode)
}
