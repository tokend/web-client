import { BLOB_TYPES } from '@tokend/js-sdk'
import { api, base } from '@/api'

export async function createSaleDescriptionBlobId (description, accountId) {
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
