<template>
  <div class="asset-explorer">
    <div class="asset-explorer__asset-list-wrp">
      <card-list-renderer :assets="assets" />
    </div>
    <div class="asset-explorer__collection-loader-wrp">
      <collection-loader
        :first-page-loader="loadAssets"
        @first-page-load="setAssets"
        @next-page-load="setNextAssets"
      />
    </div>
  </div>
</template>

<script>
import CardListRenderer from './components/card-list-renderer'
import CollectionLoader from '@/vue/common/CollectionLoader'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'
import { initConfig } from './_config'

export default {
  name: 'asset-explorer',
  components: {
    CardListRenderer,
    CollectionLoader,
  },
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
    * @property config - the config for component to use
    * @property config.horizonURL - the url of horizon server (without version)
    * @property config.storageURL - the url of storage server
    */
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('asset-explorer', {
      assets: types.assets,
    }),
  },
  async created () {
    initConfig(this.config.horizonURL, this.config.storageURL)
    initApi(this.wallet)

    this.setBalancesOwnerId(this.wallet.accountId)
    await this.loadBalances()
  },
  methods: {
    ...mapMutations('asset-explorer', {
      setAssets: types.SET_ASSETS,
      setNextAssets: types.SET_NEXT_ASSETS,
      setBalancesOwnerId: types.SET_BALANCES_OWNER_ID,
    }),
    ...mapActions('asset-explorer', {
      loadAssets: types.LOAD_ASSETS,
      loadBalances: types.LOAD_BALANCES,
    }),
  },
}
</script>
