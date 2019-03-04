<template>
  <div class="asset-creation-requests">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <asset-creation-request-drawer :request="selectedRequest" />
      </drawer>

      <asset-creation-requests-table
        :requests="requests"
        @select="showRequestDetails"
      />
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader message-id="asset-creation-requests.loading-msg" />
    </template>

    <template v-else>
      <p>
        {{ 'asset-creation-requests.loading-error-msg' | globalize }}
      </p>
    </template>

    <collection-loader
      class="asset-creation-requests__loader"
      v-show="requests.length && isLoaded"
      :first-page-loader="firstPageLoader"
      @first-page-load="setRequests"
      @next-page-load="concatRequests"
    />
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import CollectionLoader from '@/vue/common/CollectionLoader'

import AssetCreationRequestsTable from './components/asset-creation-requests-table'
import AssetCreationRequestDrawer from './components/asset-creation-request-drawer'

import { initApi } from './_api'
import { Wallet } from '@tokend/js-sdk'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'asset-creation-requests-module',
  components: {
    Loader,
    Drawer,
    CollectionLoader,
    AssetCreationRequestsTable,
    AssetCreationRequestDrawer,
  },

  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    isDrawerShown: false,
    selectedRequest: {},
    firstPageLoader: () => {},
  }),

  computed: {
    ...mapGetters('asset-creation-requests-module', {
      requests: types.assetCreationRequests,
    }),
  },

  created () {
    initApi(this.wallet, this.config)
    this.setAccountId(this.wallet.accountId)
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('asset-creation-requests-module', {
      setAccountId: types.SET_ACCOUNT_ID,
      setRequests: types.SET_ASSET_CREATION_REQUESTS,
      concatRequests: types.CONCAT_ASSET_CREATION_REQUESTS,
    }),

    ...mapActions('asset-creation-requests-module', {
      loadAssetCreationRequests: types.LOAD_ASSET_CREATION_REQUESTS,
    }),

    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadAssetCreationRequests()
        this.isLoaded = true
        return response
      } catch (e) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    initFirstPageLoader () {
      this.firstPageLoader = this.loadRequests
    },

    closeDetailsDrawer () {
      this.isDrawerShown = false
    },

    showRequestDetails (request) {
      this.selectedRequest = request
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
.asset-creation-requests__loader {
  margin-top: 1rem;
}
</style>
