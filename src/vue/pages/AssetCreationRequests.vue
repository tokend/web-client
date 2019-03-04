<template>
  <div class="asset-creation-requests-page">
    <asset-creation-requests-module
      :wallet="wallet"
      :config="config"
    />
  </div>
</template>

<script>
import AssetCreationRequestsModule from '@modules/asset-creation-requests'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'asset-creation-requests-page',
  components: {
    AssetCreationRequestsModule,
  },

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),

    config () {
      return {
        horizonURL: config.HORIZON_SERVER,
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
