import { api } from '@/api'
import { AssetRecord } from '@/js/records/entities/asset.record'

export default {
  data: _ => ({
    ownedAssets: [],
  }),

  methods: {
    async loadOwnedAssets (ownerAccountId) {
      const endpoint = `/v3/accounts/${ownerAccountId}`
      const { data: account } = await api.get(endpoint, {
        include: ['balances.asset'],
      })

      this.ownedAssets = account.balances
        .map(b => b.asset)
        .map(a => new AssetRecord(a))
        .filter(a => a.owner === ownerAccountId)
    },
  },
}
