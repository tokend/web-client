<template>
  <div class="balance-explorer">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template slot="heading">
          {{ 'assets.drawer-title' | globalize }}
        </template>
        <asset-attributes-viewer
          :asset="selectedAsset"
          :config="config"
        />
      </drawer>

      <div class="balance-explorer__asset-list-wrp">
        <card-list-renderer
          v-if="assets.length"
          :assets="assets"
          :config="config"
          @select="selectAsset"
        />

        <no-data-message
          v-else
          icon-name="trending-up"
          title-id="assets.no-balances-title"
          message-id="assets.no-balances-msg"
        />
      </div>
    </template>

    <template v-else-if="isLoadFailed">
      <p class="balance-explorer__error-msg">
        {{ 'assets.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="assets.balances-loading-msg" />
    </template>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import CardListRenderer from '../shared/components/card-list-renderer'
import AssetAttributesViewer from '../shared/components/asset-attributes-viewer'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'balance-explorer',
  components: {
    Drawer,
    LoadSpinner,
    NoDataMessage,
    CardListRenderer,
    AssetAttributesViewer,
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
    isLoaded: false,
    isLoadFailed: false,
    isDrawerShown: false,
    selectedAsset: {},
  }),
  computed: {
    ...mapGetters('balance-explorer', {
      assets: types.assets,
    }),
  },
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
  },

  methods: {
    ...mapMutations('balance-explorer', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),

    ...mapActions('balance-explorer', {
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES,
    }),

    async loadBalances () {
      try {
        await this.loadAccountBalances()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    selectAsset (asset) {
      this.selectedAsset = asset
      this.isDrawerShown = true
    },
  },
}
</script>
