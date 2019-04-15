
import { api } from '../_api'

export default {
  data: _ => ({
    kycRequiredAssetType: null,
  }),

  methods: {
    async loadKycRequiredAssetType () {
      const endpoint = '/v3/key_values/asset_type:kyc_required'
      const { data } = await api().get(endpoint)
      this.kycRequiredAssetType = data.value.u32
    },
  },
}
