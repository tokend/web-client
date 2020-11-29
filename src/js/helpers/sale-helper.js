import { BLOB_TYPES } from '@tokend/js-sdk'
import { api, base } from '@/api'
import { CreateSaleRequest } from '@/vue/modules/requests/create-sale-requests/wrappers/create-sale-request'

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

export async function getCreateSaleRequestById (id, accountId) {
  const endpoint = `/v3/create_sale_requests/${id}`
  const { data: record } = await api.getWithSignature(endpoint, {
    filter: {
      requestor: accountId,
    },
    include: ['request_details', 'request_details.default_quote_asset'],
  })
  return new CreateSaleRequest(record)
}

export async function getSaleDescription (blobId, accountId) {
  try {
    const endpoint = `/accounts/${accountId}/blobs/${blobId}`
    const { data: blob } = await api.getWithSignature(endpoint)

    return JSON.parse(blob.value)
  } catch {
    return ''
  }
}
