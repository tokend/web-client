<template>
  <div class="sale-creation-requests">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'sale-creation-requests.update-sale-title' | globalize }}
          </template>
          <create-sale-form
            :request="selectedRequest"
            @close="isDrawerShown = false"
            @request-updated="initFirstPageLoader"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'sale-creation-requests.details-title' | globalize }}
          </template>
          <sale-creation-request-viewer
            :request="selectedRequest"
            @update-ask="isUpdateMode = true"
            @cancel="(isDrawerShown = false) || initFirstPageLoader()"
          />
        </template>
      </drawer>

      <sale-creation-requests-table
        :requests="requests"
        @select="showRequestDetails"
      />
    </template>

    <p v-else-if="isLoadingFailed">
      {{ 'sale-creation-requests.loading-error-msg' | globalize }}
    </p>

    <load-spinner v-else message-id="sale-creation-requests.loading-msg" />

    <collection-loader
      class="sale-creation-requests__loader"
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

import CreateSaleForm from '@/vue/forms/CreateSaleForm'
import SaleCreationRequestViewer from './components/sale-creation-request-viewer'
import SaleCreationRequestsTable from './components/sale-creation-requests-table'

import { initApi } from './_api'
import { initConfig } from './_config'

import { Wallet } from '@tokend/js-sdk'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'sale-creation-requests-module',
  components: {
    LoadSpinner,
    Drawer,
    CollectionLoader,
    SaleCreationRequestsTable,
    CreateSaleForm,
    SaleCreationRequestViewer,
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
    ...mapGetters('sale-creation-requests', {
      requests: types.saleCreationRequests,
    }),
  },

  created () {
    initApi(this.wallet, this.config)
    initConfig(this.config)

    this.setAccountId(this.wallet.accountId)
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('sale-creation-requests', {
      setAccountId: types.SET_ACCOUNT_ID,
      setRequests: types.SET_SALE_CREATION_REQUESTS,
      concatRequests: types.CONCAT_SALE_CREATION_REQUESTS,
    }),

    ...mapActions('sale-creation-requests', {
      loadAssetCreationRequests: types.LOAD_SALE_CREATION_REQUESTS,
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
.sale-creation-requests__loader {
  margin-top: 1rem;
}
</style>
