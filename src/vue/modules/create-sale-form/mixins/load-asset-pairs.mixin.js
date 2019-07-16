import { api, loadingDataViaLoop } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Asset } from '../wrappers/asset'

const MAX_PAGE_LIMIT = 100

export default {
  methods: {
    async loadBaseAssetsByQuote (quoteAssetCode) {
      let result

      try {
        let response = await api.get('/v3/asset_pairs', {
          filter: { quote_asset: quoteAssetCode },
          page: { limit: MAX_PAGE_LIMIT },
          include: ['base_asset'],
        })
        let assetPairs = await loadingDataViaLoop(response)

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
