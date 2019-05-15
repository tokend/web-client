<template>
  <div class="requests-renderer">
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
            :base-asset="baseAsset"
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
      class="requests-renderer__loader"
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
import RequestViewer from './request-viewer'
import RequestsTable from './requests-table'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from '../store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { Asset } from '../wrappers/asset'

export default {
  name: 'requests-renderer',
  components: {
    LoadSpinner,
    Drawer,
    CollectionLoader,
    RequestsTable,
    CreateSaleForm,
    RequestViewer,
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
    ...mapGetters('create-sale-requests', {
      requests: types.requests,
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
    ...mapMutations('create-sale-requests', {
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
.requests-renderer__loader {
  margin-top: 1rem;
}
</style>
