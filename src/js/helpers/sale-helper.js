import { BLOB_TYPES } from '@tokend/js-sdk'
import { api, base } from '@/api'
import { loadAllResponsePages } from '@/js/helpers/api-helpers'
import { AssetPairRecord } from '@/js/records/entities/asset-pair.record'

export async function createSaleDescriptionBlob (description, accountId) {
  const { data: blob } = await api.postWithSignature('/blobs', {
    data: {
      type: BLOB_TYPES.saleOverview,
      attributes: {
        value: JSON.stringify(description),
      },
      relationships: {
        owner: {
          data: { id: accountId },
        },
      },
    },
  })

  return blob.id
}

// eslint-disable-next-line max-len
export async function createBalancesIfNotExist ({ balanceAssets, quoteAssets, accountId }) {
  let operations = []

  for (const asset of quoteAssets) {
    if (!balanceAssets.includes(asset)) {
      operations.push(
        base.Operation.manageBalance({
          asset: asset,
          destination: accountId,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
      )
    }
  }

  if (operations.length) {
    await api.postOperations(...operations)
  }
}

export async function loadAssetsPairsByQuote (quoteAssetCode) {
  const MAX_PAGE_LIMIT = 100
  let result = await api.get('/v3/asset_pairs', {
    filter: { quote_asset: quoteAssetCode },
    page: { limit: MAX_PAGE_LIMIT },
  })
  result = await loadAllResponsePages(result)
  return result.map(item => new AssetPairRecord(item))
}
