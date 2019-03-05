<template>
  <div class="asset-explorer">
    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'asset-explorer.drawer-title' | globalize }}
      </template>
      <asset-attributes-viewer
        :asset="selectedAsset"
        :config="config"
      />

      <template v-if="!selectedAsset.balance">
        <div class="asset-explorer__add-balance-btn-wrp">
          <add-balance-btn :asset="selectedAsset" />
        </div>
      </template>
    </drawer>

    <div class="asset-explorer__asset-list-wrp">
      <card-list-renderer
        :assets="assets"
        :config="config"
        @select="selectAsset"
      />
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
import Drawer from '@/vue/common/Drawer'
import CollectionLoader from '@/vue/common/CollectionLoader'

import CardListRenderer from '../shared/components/card-list-renderer'
import AssetAttributesViewer from '../shared/components/asset-attributes-viewer'
import AddBalanceBtn from './components/add-balance-btn'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

const ASSETS_PER_PAGE = 12

export default {
  name: 'asset-explorer',
  components: {
    Drawer,
    CollectionLoader,
    CardListRenderer,
    AssetAttributesViewer,
    AddBalanceBtn,
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
    isDrawerShown: false,
    selectedAsset: {},
    ASSETS_PER_PAGE,
  }),
  computed: {
    ...mapGetters('asset-explorer', {
      assets: types.assets,
    }),
  },
  async created () {
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
    selectAsset (asset) {
      this.selectedAsset = asset
      this.isDrawerShown = true
    },
  },
}
</script>

<style scoped>
.asset-explorer__collection-loader-wrp {
  margin-top: 1.5rem;
}

.asset-explorer__add-balance-btn-wrp {
  margin-top: 4.9rem;
  display: flex;
}
</style>
