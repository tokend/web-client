<template>
  <div>
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template slot="heading">
          {{ 'poll-requests.details-title' | globalize }}
        </template>
        <request-viewer
          :request="selectedRequest"
          @cancel="(isDrawerShown = false) || initFirstPageLoader()"
        />
      </drawer>

      <requests-table
        :requests="requests"
        :is-loaded="isLoaded"
        @select="showRequestDetails"
      />
    </template>

    <p v-if="isLoadingFailed">
      {{ 'poll-requests.loading-error-msg' | globalize }}
    </p>

    <collection-loader
      class="poll-requests__loader"
      v-show="requests.length && isLoaded"
      :first-page-loader="firstPageLoader"
      @first-page-load="setRequests"
      @next-page-load="concatRequests"
    />
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'
import CollectionLoader from '@/vue/common/CollectionLoader'
import RequestsTable from './components/requests-table'
import RequestViewer from './components/request-viewer'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'poll-requests',
  components: {
    CollectionLoader,
    RequestsTable,
    Drawer,
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
    ...mapGetters('poll-requests', {
      requests: types.requests,
    }),
  },
  async created () {
    this.initFirstPageLoader()
    Bus.on('polls:updateRequestsList', () =>
      this.initFirstPageLoader()
    )
  },
  methods: {
    ...mapMutations('poll-requests', {
      setRequests: types.SET_REQUESTS,
      concatRequests: types.CONCAT_REQUESTS,
    }),
    ...mapActions('poll-requests', {
      loadCreateAssetRequests: types.LOAD_REQUESTS,
    }),
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
      this.selectedRequest = request
      this.isDrawerShown = true
    },
  },
}
</script>

<style scoped lang="scss">
.poll-requests__loader {
  margin-top: 1rem;
}
</style>
