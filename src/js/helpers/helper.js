import { BLOB_TYPES } from '@tokend/js-sdk'
import { api, base } from '@/api'
import { loadAllResponsePages } from '@/js/helpers/api-helpers'
import { AssetPairRecord } from '@/js/records/entities/asset-pair.record'
// eslint-disable-next-line max-len
// import { CreateSaleRequest } from '@/requests/create-sale-requests/wrappers/create-sale-request'

// const NEW_CREATE_SALE_REQUEST_ID = '0'
// const DEFAULT_SALE_TYPE = '0'
const MAX_PAGE_LIMIT = 100
// const DEFAULT_QUOTE_ASSET_PRICE = '1'

// const EMPTY_DOCUMENT = {
//   mime_type: '',
//   name: '',
//   key: '',
// }

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
  let result = await api.get('/v3/asset_pairs', {
    filter: { quote_asset: quoteAssetCode },
    page: { limit: MAX_PAGE_LIMIT },
  })
  result = await loadAllResponsePages(result)
  return result.map(item => new AssetPairRecord(item))
}

// async function collectDataForCreateSaleCreationRequest () {

// }

export async function getCreateSaleRequestById (id, accountId) {
  const endpoint = `/v3/create_sale_requests/${id}`
  const { data: record } = await api.getWithSignature(endpoint, {
    filter: {
      requestor: accountId,
    },
    include: ['request_details', 'request_details.default_quote_asset'],
  })

  //   return new CreateSaleRequest(record)
  return record
}
