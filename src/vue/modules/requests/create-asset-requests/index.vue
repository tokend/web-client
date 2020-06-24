<template>
  <div class="create-asset-requests">
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isAssetFormShown">
          <template slot="heading">
            {{ 'create-asset-requests.update-asset-title' | globalize }}
          </template>
          <asset-form
            :former="former"
            @submitted="onRequestUpdate()"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'create-asset-requests.details-title' | globalize }}
          </template>
          <request-viewer
            :request="selectedRequest"
            @update-click="showUpdateForm()"
            @cancel="onRequestUpdate()"
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
import { AssetRequest } from '@/js/records/requests/asset-request.record'

import AssetForm from '@modules/asset-form'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'
import UpdateList from '@/vue/mixins/update-list.mixin'
import { AssetFormer } from '@/js/formers/AssetFormer'

export default {
  name: 'create-asset-requests-module',
  components: {
    Drawer,
    CollectionLoader,
    RequestsTable,
    RequestViewer,
    AssetForm,
  },

  mixins: [UpdateList],

  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    isDrawerShown: false,
    isAssetFormShown: false,
    selectedRequest: new AssetRequest(),
    former: new AssetFormer(),
    firstPageLoader: () => { },
  }),

  computed: {
    ...mapGetters('create-asset-requests', {
      requests: types.requests,
    }),
  },

  async created () {
    this.initFirstPageLoader()
    await this.loadAssetTypes()
    this.listenUpdateList('createAssetRequests:updateList', this.initFirstPageLoader)
  },

  beforeDestroy () {
    this.resetUpdateListEvent('createAssetRequests:updateList')
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
      this.isAssetFormShown = false
      this.selectedRequest = request
      this.isDrawerShown = true
    },

    showUpdateForm () {
      this.former = new AssetFormer(this.selectedRequest).useCreateOpBuilder()
      this.isAssetFormShown = true
    },

    onRequestUpdate () {
      this.isDrawerShown = false
      this.emitUpdateList('createAssetRequests:updateList')
    },
  },
}
</script>

<style lang="scss" scoped>
.create-asset-requests__loader {
  margin-top: 1rem;
}
</style>
