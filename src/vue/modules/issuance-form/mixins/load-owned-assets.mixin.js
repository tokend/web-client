import { api } from '@/api'
import { Asset } from '../wrappers/asset'

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
        .map(a => new Asset(a))
        .filter(a => a.owner === ownerAccountId)
    },
  },
}
