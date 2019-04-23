<template>
  <div class="create-sale-requests">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'create-sale-requests.update-sale-title' | globalize }}
          </template>
          <create-sale-form
            :request="selectedRequest"
            @close="isDrawerShown = false"
            @request-updated="initFirstPageLoader"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'create-sale-requests.details-title' | globalize }}
          </template>
          <request-viewer
            :request="selectedRequest"
            @update-click="isUpdateMode = true"
            @cancel="(isDrawerShown = false) || initFirstPageLoader()"
          />
        </template>
      </drawer>

      <requests-table
        :requests="requests"
        @select="showRequestDetails"
      />
    </template>

    <p v-else-if="isLoadingFailed">
      {{ 'create-sale-requests.loading-error-msg' | globalize }}
    </p>

    <load-spinner v-else message-id="create-sale-requests.loading-msg" />

    <collection-loader
      class="create-sale-requests__loader"
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
import RequestViewer from './components/request-viewer'
import RequestsTable from './components/requests-table'

import { Wallet } from '@tokend/js-sdk'

import { initApi } from './_api'
import { initConfig } from './_config'

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'create-sale-requests-module',
  components: {
    LoadSpinner,
    Drawer,
    CollectionLoader,
    RequestsTable,
    CreateSaleForm,
    RequestViewer,
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
    ...mapGetters('create-sale-requests', {
      requests: types.requests,
    }),
  },

  async created () {
    initApi(this.wallet, this.config)
    initConfig(this.config)

    this.setAccountId(this.wallet.accountId)
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('create-sale-requests', {
      setAccountId: types.SET_ACCOUNT_ID,
      setRequests: types.SET_REQUESTS,
      concatRequests: types.CONCAT_REQUESTS,
    }),

    ...mapActions('create-sale-requests', {
      loadCreateSaleRequests: types.LOAD_REQUESTS,
    }),

    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadCreateSaleRequests()
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
.create-sale-requests__asset-list {
  width: fit-content;
}

.create-sale-requests__renderer {
  margin-top: 2.1rem;
}

.create-sale-requests__loader {
  margin-top: 1rem;
}
</style>
