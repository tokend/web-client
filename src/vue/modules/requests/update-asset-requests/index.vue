<template>
  <div class="update-asset-requests">
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'update-asset-requests.update-asset-title' | globalize }}
          </template>
          <update-asset-form-module
            :request-id="selectedRequest.id"
            @close="isDrawerShown = false"
            @request-updated="initFirstPageLoader"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'update-asset-requests.details-title' | globalize }}
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
        :is-loaded="isLoaded"
        @select="showRequestDetails"
      />
    </template>

    <p v-if="isLoadingFailed">
      {{ 'update-asset-requests.loading-error-msg' | globalize }}
    </p>

    <collection-loader
      class="update-asset-requests__loader"
      v-show="requests.length && isLoaded"
      :first-page-loader="firstPageLoader"
      @first-page-load="setRequests"
      @next-page-load="concatRequests"
    />
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import CollectionLoader from '@/vue/common/CollectionLoader'

import RequestViewer from './components/request-viewer'
import RequestsTable from './components/requests-table'

import UpdateAssetFormModule from '@modules/update-asset-form'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'update-asset-requests-module',
  components: {
    Drawer,
    CollectionLoader,
    RequestsTable,
    RequestViewer,
    UpdateAssetFormModule,
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
    ...mapGetters('update-asset-requests', {
      requests: types.requests,
    }),
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('update-asset-requests', {
      setRequests: types.SET_REQUESTS,
      concatRequests: types.CONCAT_REQUESTS,
    }),

    ...mapActions('update-asset-requests', {
      loadUpdateAssetRequests: types.LOAD_REQUESTS,
    }),

    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadUpdateAssetRequests()
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
.update-asset-requests__loader {
  margin-top: 1rem;
}
</style>
