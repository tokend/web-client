import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Asset } from '../wrappers/asset'

const ASSET_PAIRS_PAGE_LIMIT = 100

export default {
  methods: {
    async loadBaseAssetsByQuote (quoteAssetCode) {
      let result

      try {
        let pageResponse = await api.getWithSignature('/v3/asset_pairs', {
          filter: { quote_asset: quoteAssetCode },
          page: { limit: ASSET_PAIRS_PAGE_LIMIT },
          include: ['base_asset'],
        })
        let assetPairs = pageResponse.data

        // TODO: replace by api method when it will be added
        while (pageResponse.data.length === ASSET_PAIRS_PAGE_LIMIT) {
          pageResponse = await pageResponse.fetchNext()
          assetPairs.push(...pageResponse.data)
        }

        result = assetPairs.map(a => a.baseAsset)
          .map(a => new Asset(a))
          .filter(a => a.isBaseAsset)
      } catch (e) {
        result = []
        ErrorHandler.processWithoutFeedback(e)
      }

      return result
    },
  },
}
