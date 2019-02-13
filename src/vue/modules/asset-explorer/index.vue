<template>
  <div class="asset-explorer">
    <div class="asset-explorer__asset-list-wrp">
      <card-list-renderer :assets="assets" />
    </div>
    <div class="asset-explorer__collection-loader-wrp">
      <collection-loader
        :first-page-loader="loadAssetsPage"
        :page-limit="ASSETS_PER_PAGE"
        @first-page-load="setAssets"
        @next-page-load="concatAssets"
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

const ASSETS_PER_PAGE = 12

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
  data: _ => ({
    ASSETS_PER_PAGE,
  }),
  computed: {
    ...mapGetters('asset-explorer', {
      assets: types.assets,
    }),
  },
  async created () {
    initConfig(this.config)
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
  },
  methods: {
    ...mapMutations('asset-explorer', {
      setAssets: types.SET_ASSETS,
      concatAssets: types.CONCAT_ASSETS,
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('asset-explorer', {
      loadAssets: types.LOAD_ASSETS,
      loadBalances: types.LOAD_BALANCES,
    }),
    loadAssetsPage () {
      return this.loadAssets({
        page: {
          limit: ASSETS_PER_PAGE,
        },
      })
    },
  },
}
</script>

<style scoped>
.asset-explorer__collection-loader-wrp {
  margin-top: 1.5rem;
}
</style>
