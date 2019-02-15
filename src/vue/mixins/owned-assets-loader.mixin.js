import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  data: _ => ({
    ownedAssets: [],
  }),
  computed: {
    ...mapGetters([
      vuexTypes.account,
    ]),
  },
  methods: {
    async loadOwnedAssets () {
      try {
        const { data } = await Sdk.horizon.assets.getAll({
          owner: this.account.accountId,
        })
        this.ownedAssets = data.map(item => new AssetRecord(item))
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
