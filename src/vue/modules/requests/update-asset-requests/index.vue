<template>
  <div class="update-asset-requests">
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isAssetFormShown">
          <template slot="heading">
            {{ 'update-asset-requests.update-asset-title' | globalize }}
          </template>
          <asset-form
            :former="former"
            @submitted="onRequestUpdate()"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'update-asset-requests.details-title' | globalize }}
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

import AssetForm from '@modules/asset-form'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'
import UpdateList from '@/vue/mixins/update-list.mixin'
import { AssetFormer } from '@/js/formers/AssetFormer'

export default {
  name: 'update-asset-requests-module',
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
    selectedRequest: {},
    former: new AssetFormer(),
    firstPageLoader: () => {},
  }),

  computed: {
    ...mapGetters('update-asset-requests', {
      requests: types.requests,
    }),
  },

  created () {
    this.initFirstPageLoader()
    this.listenUpdateList('updateAssetRequests:updateList', this.initFirstPageLoader)
  },

  beforeDestroy () {
    this.resetUpdateListEvent('updateAssetRequests:updateList')
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
      this.isAssetFormShown = false
      this.selectedRequest = request
      this.isDrawerShown = true
    },

    showUpdateForm () {
      this.former = new AssetFormer(this.selectedRequest).useUpdateOpBuilder()
      this.isAssetFormShown = true
    },

    onRequestUpdate () {
      this.isDrawerShown = false
      this.emitUpdateList('updateAssetRequests:updateList')
    },
  },
}
</script>

<style lang="scss" scoped>
.update-asset-requests__loader {
  margin-top: 1rem;
}
</style>
