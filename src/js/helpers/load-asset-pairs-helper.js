import { ErrorHandler } from '@/js/helpers/error-handler'
import { store } from '@/vuex'
import { api } from '@/api'
import { AssetPairRecord } from '@/js/records/entities/asset-pair.record'
import { loadAllResponsePages } from '@/js/helpers/api-helpers'

export async function loadBaseAssetsByQuote (quoteAssetCode) {
  let result

  try {
    let assetPairs = await loadAssetsPairsByQuote(quoteAssetCode)
    result = assetPairs.map(a => a.baseAssetCode)
      .map(item => store.getters.assetByCode(item))
      .filter(item => item.isBaseAsset)
  } catch (e) {
    result = []
    ErrorHandler.processWithoutFeedback(e)
  }
  return result
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
