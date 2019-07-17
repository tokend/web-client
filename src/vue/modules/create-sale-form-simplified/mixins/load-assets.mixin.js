import { api } from '@/api'
import { Asset } from '../wrappers/asset'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  data: _ => ({
    assets: [],
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    ownedAssets () {
      return this.assets.filter(a => a.owner === this.accountId)
    },

    baseAssets () {
      return this.assets.filter(a => a.isBaseAsset)
    },

    defaultQuoteAsset () {
      const asset = this.assets.find(a => a.isDefaultQuoteAsset)
      return asset ? asset.code : ''
    },
  },

  methods: {
    async loadAssets (accountId) {
      const endpoint = `/v3/accounts/${accountId}`
      const { data: account } = await api.getWithSignature(endpoint, {
        include: ['balances.asset'],
      })

      this.assets = account.balances
        .map(b => b.asset)
        .map(a => new Asset(a))
    },
  },
}
