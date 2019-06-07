<template>
  <div class="create-asset-requests">
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'create-asset-requests.update-asset-title' | globalize }}
          </template>
          <create-asset-form-module
            :request-id="selectedRequest.id"
            @close="isDrawerShown = false"
            @request-updated="initFirstPageLoader"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'create-asset-requests.details-title' | globalize }}
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
      {{ 'create-asset-requests.loading-error-msg' | globalize }}
    </p>

    <collection-loader
      class="create-asset-requests__loader"
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

import CreateAssetFormModule from '@modules/create-asset-form'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'create-asset-requests-module',
  components: {
    Drawer,
    CollectionLoader,
    RequestsTable,
    RequestViewer,
    CreateAssetFormModule,
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
    ...mapGetters('create-asset-requests', {
      requests: types.requests,
    }),
  },

  async created () {
    this.initFirstPageLoader()
    await this.loadAssetTypes()
  },

  methods: {
    ...mapMutations('create-asset-requests', {
      setRequests: types.SET_REQUESTS,
      concatRequests: types.CONCAT_REQUESTS,
    }),

    ...mapActions('create-asset-requests', {
      loadCreateAssetRequests: types.LOAD_REQUESTS,
      loadKycRequiredAssetType: types.LOAD_KYC_REQUIRED_ASSET_TYPE,
      loadSecurityAssetType: types.LOAD_SECURITY_ASSET_TYPE,
    }),

    async loadAssetTypes () {
      try {
        await this.loadKycRequiredAssetType()
        await this.loadSecurityAssetType()
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadCreateAssetRequests()
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
.create-asset-requests__loader {
  margin-top: 1rem;
}
</style>
