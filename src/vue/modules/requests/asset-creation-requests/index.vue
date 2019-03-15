<template>
  <div class="asset-creation-requests">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'asset-creation-requests.update-asset-title' | globalize }}
          </template>
          <asset-create-form :request="selectedRequest" />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'asset-creation-requests.details-title' | globalize }}
          </template>
          <asset-creation-request-viewer
            :request="selectedRequest"
            @update="isUpdateMode = true"
          />
        </template>
      </drawer>

      <asset-creation-requests-table
        :requests="requests"
        @select="showRequestDetails"
      />
    </template>

    <p v-else-if="isLoadingFailed">
      {{ 'asset-creation-requests.loading-error-msg' | globalize }}
    </p>

    <loader v-else message-id="asset-creation-requests.loading-msg" />

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
import AssetCreateForm from '@/vue/forms/AssetCreateForm'
import AssetCreationRequestViewer from './components/asset-creation-request-viewer'

import { initApi } from './_api'
import { initConfig } from './_config'
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
    AssetCreateForm,
    AssetCreationRequestViewer,
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
    ...mapGetters('asset-creation-requests', {
      requests: types.assetCreationRequests,
    }),
  },

  created () {
    initApi(this.wallet, this.config)
    initConfig(this.config)

    this.setAccountId(this.wallet.accountId)
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('asset-creation-requests', {
      setAccountId: types.SET_ACCOUNT_ID,
      setRequests: types.SET_ASSET_CREATION_REQUESTS,
      concatRequests: types.CONCAT_ASSET_CREATION_REQUESTS,
    }),

    ...mapActions('asset-creation-requests', {
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

    showRequestDetails (request) {
      this.isUpdateMode = false
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
