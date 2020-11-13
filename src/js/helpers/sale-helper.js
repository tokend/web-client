import { BLOB_TYPES, base, Document } from '@tokend/js-sdk'
import { api } from '@/api'
import { AssetPairRecord } from '@/js/records/entities/asset-pair.record'
import { loadAllResponsePages } from '@/js/helpers/api-helpers'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Asset } from '../wrappers/asset'

const MAX_PAGE_LIMIT = 100

async function createSaleDescriptionBlob (description, accountId) {
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

export async function getSaleDescription (blobId, accountId) {
  try {
    const endpoint = `/accounts/${accountId}/blobs/${blobId}`
    const { data: blob } = await api.getWithSignature(endpoint)

    return JSON.parse(blob.value)
  } catch {
    return ''
  }
}

export async function submitCreateSaleRequest (accountId,
  shortBlurbStepForm, fullDescriptionStepForm, saleDescriptionBlobId, assets,
  informationStepForm, assetPairs, saleRequestOpts) {
//   await Document.uploadDocuments([this.shortBlurbStepForm.saleLogo])
  await Document.uploadDocuments([shortBlurbStepForm.saleLogo])

  saleDescriptionBlobId = await createSaleDescriptionBlob(
    fullDescriptionStepForm.description,
    accountId
  )

  await createBalancesIfNotExist({
    balanceAssets: assets.map(asset => asset.code),
    quoteAssets: informationStepForm.quoteAssets,
    accountId,
  })
  assetPairs =
    await loadAssetsPairsByQuote(
      informationStepForm.capAsset.code
    )
  const operation =
    base.SaleRequestBuilder.createSaleCreationRequest(saleRequestOpts)
  await api.postOperations(operation)
}

// eslint-disable-next-line max-len
async function createBalancesIfNotExist ({ balanceAssets, quoteAssets, accountId }) {
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

async function loadAssetsPairsByQuote (quoteAssetCode) {
  let result = await api.get('/v3/asset_pairs', {
    filter: { quote_asset: quoteAssetCode },
    page: { limit: MAX_PAGE_LIMIT },
  })
  result = await loadAllResponsePages(result)
  return result.map(item => new AssetPairRecord(item))
}

export async function loadBaseAssetsByQuote (quoteAssetCode) {
  // let result

  try {
    // let assetPairs = await loadAssetsPairsByQuote(quoteAssetCode)
    // result = assetPairs.map(a => a.baseAssetCode)
    //   .map(item => this.assetByCode(item))
    //   .filter(item => item.isBaseAsset)
  } catch (e) {
    // result = []
    ErrorHandler.processWithoutFeedback(e)
  }

  // return result
  return quoteAssetCode
}

export async function loadAssets (accountId, assets) {
  const endpoint = `/v3/accounts/${accountId}`
  const { data: account } = await api.getWithSignature(endpoint, {
    include: ['balances.asset'],
  })

  assets = account.balances
    .map(b => b.asset)
    .map(a => new Asset(a))
}
