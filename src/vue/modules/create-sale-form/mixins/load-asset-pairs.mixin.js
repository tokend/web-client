import { api, loadingDataViaLoop } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { AssetPairRecord } from '@/js/records/entities/asset-pair.record'
import { mapGetters } from 'vuex'
const MAX_PAGE_LIMIT = 100

export default {
  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),
  },
  methods: {
    async loadBaseAssetsByQuote (quoteAssetCode) {
      let result

      try {
        let assetPairs = await this.loadAssetsPairsByQuote(quoteAssetCode)
        result = assetPairs.map(a => a.baseAssetCode)
          .map(item => this.assetByCode(item))
          .filter(item => item.isBaseAsset)
      } catch (e) {
        result = []
        ErrorHandler.processWithoutFeedback(e)
      }

      return result
    },
    async loadAssetsPairsByQuote (quoteAssetCode) {
      let result = await api.get('/v3/asset_pairs', {
        filter: { quote_asset: quoteAssetCode },
        page: { limit: MAX_PAGE_LIMIT },
      })
      result = await loadingDataViaLoop(result)
      return result.map(item => new AssetPairRecord(item))
    },
  },
}
