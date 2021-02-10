import { BLOB_TYPES, base } from '@tokend/js-sdk'
import { api } from '@/api'
import { store, vuexTypes } from '@/vuex'
import { AssetPairRecord } from '@/js/records/entities/asset-pair.record'
import { loadAllResponsePages } from '@/js/helpers/api-helpers'

export async function createSaleDescriptionBlobId (description) {
  const { data: blob } = await api.postWithSignature('/blobs', {
    data: {
      type: BLOB_TYPES.saleOverview,
      attributes: {
        value: JSON.stringify(description),
      },
      relationships: {
        owner: {
          data: { id: store.getters[vuexTypes.accountId] },
        },
      },
    },
  })
  return blob.id
}

export async function createBalanceIfNotExist (assetCode) {
  let accountBalancesAssetsCodes =
      store.getters[vuexTypes.accountBalances].map(i => i.asset.code)
  if (!(accountBalancesAssetsCodes.includes(assetCode))) {
    let operation = base.Operation.manageBalance({
      asset: assetCode,
      destination: store.getters[vuexTypes.accountId],
      action: base.xdr.ManageBalanceAction.createUnique(),
    })
    await api.postOperations(operation)
  }
  await store.dispatch(vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS)
}

export async function loadAssetsPairsByQuote (quoteAssetCode) {
  let result = await api.get('/v3/asset_pairs', {
    filter: { quote_asset: quoteAssetCode },
    page: { limit: 100 },
  })
  result = await loadAllResponsePages(result)
  result = result.map(item => new AssetPairRecord(item))

  return result
}
