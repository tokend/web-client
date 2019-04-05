import { api } from '../_api'

import { Asset } from '../wrappers/asset'

export default {
  methods: {
    async getAssetByCode (code) {
      const endpoint = `/v3/assets/${code}`
      const { data: record } = await api().get(endpoint)
      return new Asset(record)
    },
  },
}
