<template>
  <div class="asset-update-requests">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'asset-update-requests.update-asset-title' | globalize }}
          </template>
          <asset-update-form
            :request="selectedRequest"
            @close="isDrawerShown = false"
            @request-updated="initFirstPageLoader"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'asset-update-requests.details-title' | globalize }}
          </template>
          <asset-update-request-viewer
            :request="selectedRequest"
            @update-ask="isUpdateMode = true"
            @cancel="(isDrawerShown = false) || initFirstPageLoader()"
          />
        </template>
      </drawer>

      <asset-update-requests-table
        :requests="requests"
        @select="showRequestDetails"
      />
    </template>

    <p v-else-if="isLoadingFailed">
      {{ 'asset-update-requests.loading-error-msg' | globalize }}
    </p>

    <load-spinner v-else message-id="asset-update-requests.loading-msg" />

    <collection-loader
      class="asset-update-requests__loader"
      v-show="requests.length && isLoaded"
      :first-page-loader="firstPageLoader"
      @first-page-load="setRequests"
      @next-page-load="concatRequests"
    />
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import CollectionLoader from '@/vue/common/CollectionLoader'

import AssetUpdateForm from '@/vue/forms/AssetUpdateForm'
import AssetUpdateRequestViewer from './components/asset-update-request-viewer'
import AssetUpdateRequestsTable from './components/asset-update-requests-table'

import { initApi } from './_api'
import { initConfig } from './_config'

import { Wallet } from '@tokend/js-sdk'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'asset-update-requests-module',
  components: {
    LoadSpinner,
    Drawer,
    CollectionLoader,
    AssetUpdateRequestsTable,
    AssetUpdateForm,
    AssetUpdateRequestViewer,
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
    isLoadingFailed: false,
    isDrawerShown: false,
    isUpdateMode: false,
    selectedRequest: {},
    firstPageLoader: () => {},
  }),

  computed: {
    ...mapGetters('asset-update-requests', {
      requests: types.assetUpdateRequests,
    }),
  },

  created () {
    initApi(this.wallet, this.config)
    initConfig(this.config)

    this.setAccountId(this.wallet.accountId)
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('asset-update-requests', {
      setAccountId: types.SET_ACCOUNT_ID,
      setRequests: types.SET_ASSET_UPDATE_REQUESTS,
      concatRequests: types.CONCAT_ASSET_UPDATE_REQUESTS,
    }),

    ...mapActions('asset-update-requests', {
      loadAssetUpdateRequests: types.LOAD_ASSET_UPDATE_REQUESTS,
    }),

    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadAssetUpdateRequests()
        this.isLoaded = true
        return response
      } catch (e) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadRequests()
    },

    showRequestDetails (request) {
      this.isUpdateMode = false
      this.selectedRequest = request
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
.asset-update-requests__loader {
  margin-top: 1rem;
}
</style>
