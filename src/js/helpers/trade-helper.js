import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { store, vuexTypes } from '@/vuex'

export async function createBalanceIfNotExists (assetCode) {
  if (!getBalanceId(assetCode)) {
    const operation = base.Operation.manageBalance({
      destination: store.getters[vuexTypes.accountId],
      asset: assetCode,
      action: base.xdr.ManageBalanceAction.createUnique(),
    })
    await api.postOperations(operation)
  }
}

export function getBalanceId (assetCode) {
  let balance = store.getters[vuexTypes.accountBalances]
    .find(i => i.asset.code === assetCode)

  if (!balance) {
    return
  }

  return balance.id
}
