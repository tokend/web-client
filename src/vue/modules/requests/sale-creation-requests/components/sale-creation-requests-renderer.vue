<template>
  <div class="sale-creation-requests-renderer">
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
            :base-asset="baseAsset"
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
      class="sale-creation-requests-renderer__loader"
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
import SaleCreationRequestViewer from './sale-creation-request-viewer'
import SaleCreationRequestsTable from './sale-creation-requests-table'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from '../store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { Asset } from '../wrappers/asset'

export default {
  name: 'sale-creation-requests-renderer',
  components: {
    LoadSpinner,
    Drawer,
    CollectionLoader,
    SaleCreationRequestsTable,
    CreateSaleForm,
    SaleCreationRequestViewer,
  },

  props: {
    baseAsset: { type: Asset, required: true },
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

  watch: {
    baseAsset: function (value) {
      this.initFirstPageLoader()
    },
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('sale-creation-requests', {
      setAccountId: types.SET_ACCOUNT_ID,
      setRequests: types.SET_SALE_CREATION_REQUESTS,
      concatRequests: types.CONCAT_SALE_CREATION_REQUESTS,
    }),

    ...mapActions('sale-creation-requests', {
      loadSaleCreationRequests: types.LOAD_SALE_CREATION_REQUESTS,
    }),

    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadSaleCreationRequests(
          this.baseAsset.code
        )
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
.sale-creation-requests-renderer__loader {
  margin-top: 1rem;
}
</style>
