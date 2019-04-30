
import { api } from '../_api'

export default {
  data: _ => ({
    kycRequiredAssetType: null,
    securityAssetType: null,
  }),

  methods: {
    async loadKycRequiredAssetType () {
      const endpoint = '/v3/key_values/asset_type:kyc_required'
      const { data } = await api().get(endpoint)
      this.kycRequiredAssetType = data.value.u32
    },
    async loadSecurityAssetType () {
      const endpoint = '/v3/key_values/asset_type:security'
      const { data } = await api().get(endpoint)
      this.securityAssetType = data.value.u32
    },
  },
}
