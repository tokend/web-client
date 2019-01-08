import FormMixin from '@/vue/mixins/form.mixin'

import { Sdk } from '@/sdk'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  mixins: [FormMixin],
  data: _ => ({
    ownedAssets: []
  }),
  computed: {
    ...mapGetters([
      vuexTypes.account
    ])
  },
  methods: {
    async loadAssets () {
      const response = await Sdk.horizon.account.getDetails(
        this[vuexTypes.account].accountId
      )
      this.ownedAssets = response.data.map(balance =>
        balance.assetDetails).filter(asset =>
        asset.owner === this[vuexTypes.account].accountId)
    }
  }
}
