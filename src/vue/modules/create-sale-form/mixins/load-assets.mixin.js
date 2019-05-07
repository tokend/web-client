
import { api } from '../_api'
import { Asset } from '../wrappers/asset'

export default {
  data: _ => ({
    assets: [],
  }),

  computed: {
    ownedAssets () {
      return this.assets.filter(a => a.owner === this.wallet.accountId)
    },

    baseAssets () {
      return this.assets.filter(a => a.isBaseAsset)
    },
  },

  methods: {
    async loadAssets () {
      const endpoint = `/v3/accounts/${this.wallet.accountId}`
      const { data: account } = await api().getWithSignature(endpoint, {
        include: ['balances.asset'],
      })

      this.assets = account.balances
        .map(b => b.asset)
        .map(a => new Asset(a))
    },
  },
}
