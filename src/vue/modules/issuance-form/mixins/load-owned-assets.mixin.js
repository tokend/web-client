import { api } from '../_api'
import { Asset } from '../wrappers/asset'

export default {
  data: _ => ({
    ownedAssets: [],
  }),

  methods: {
    async loadOwnedAssets (ownerAccountId) {
      const { data: assets } = await api().get('/v3/assets', {
        page: { limit: 100 },
        filter: { owner: ownerAccountId },
      })

      this.ownedAssets = assets.map(a => new Asset(a))
    },
  },
}
