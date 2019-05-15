import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  data: _ => ({
    ownedAssets: [],
  }),
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },
  methods: {
    async loadOwnedAssets () {
      try {
        const endpoint = `/v3/accounts/${this.accountId}`
        const { data: account } = await api.get(endpoint, {
          include: ['balances.asset'],
        })

        this.ownedAssets = account.balances
          .map(b => b.asset)
          .map(a => new AssetRecord(a))
          .filter(a => a.owner === this.accountId)
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
