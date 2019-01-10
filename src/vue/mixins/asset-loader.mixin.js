import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  data: _ => ({
    ownedAssets: []
  }),
  computed: {
    ...mapGetters([
      vuexTypes.account
    ])
  },
  methods: {
    async loadOwnedAssets () {
      try {
        const response = await Sdk.horizon.assets.getAll()
        this.ownedAssets = response.data
          .filter(asset => asset.owner === this.account.accountId)
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
    }
  }
}
