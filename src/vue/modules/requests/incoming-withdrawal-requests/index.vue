<template>
  <div class="incoming-withdrawal-requests">
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template slot="heading">
          {{ 'incoming-withdrawal-requests.details-title' | globalize }}
        </template>
        <request-viewer
          :request="selectedRequest"
          @request-updated="(isDrawerShown = false) || initFirstPageLoader()"
        />
      </drawer>

      <requests-table
        :requests="requests"
        :is-loaded="isLoaded"
        @select="showRequestDetails"
      />
    </template>

    <p v-if="isLoadingFailed">
      {{ 'incoming-withdrawal-requests.loading-error-msg' | globalize }}
    </p>

    <collection-loader
      class="incoming-withdrawal-requests__loader"
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

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'incoming-withdrawal-requests-module',
  components: {
    Drawer,
    CollectionLoader,
    RequestsTable,
    RequestViewer,
  },

  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    isDrawerShown: false,
    selectedRequest: {},
    firstPageLoader: () => {},
  }),

  computed: {
    ...mapGetters('incoming-withdrawal-requests', {
      requests: types.requests,
    }),
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('incoming-withdrawal-requests', {
      setRequests: types.SET_REQUESTS,
      concatRequests: types.CONCAT_REQUESTS,
    }),

    ...mapActions('incoming-withdrawal-requests', {
      loadIncomingWithdrawalRequests: types.LOAD_REQUESTS,
    }),

    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadIncomingWithdrawalRequests()
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
      this.selectedRequest = request
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
.incoming-withdrawal-requests__loader {
  margin-top: 1rem;
}
</style>
