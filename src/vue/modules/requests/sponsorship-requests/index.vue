<template>
  <div>
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template slot="heading">
          {{ 'sponsorship-requests.details-title' | globalize }}
        </template>
        <request-viewer
          :request="selectedRequest"
          :is-incoming-requests="isIncomingRequests"
          @request-updated="closeDrawerAndUpdateList()"
        />
      </drawer>

      <requests-table
        :requests="requests"
        :is-loaded="isLoaded"
        :is-incoming-requests="isIncomingRequests"
        @select="showRequestDetails"
      />
    </template>

    <p v-if="isLoadingFailed">
      {{ 'sponsorship-requests.loading-error-msg' | globalize }}
    </p>

    <collection-loader
      class="sponsorship-requests__loader"
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

export default {
  name: 'sponsorship-requests',
  components: {
    CollectionLoader,
    RequestsTable,
    Drawer,
    RequestViewer,
  },

  props: {
    isIncomingRequests: { type: Boolean, default: false },
  },

  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    isDrawerShown: false,
    selectedRequest: {},
    firstPageLoader: () => {},
  }),

  computed: {
    ...mapGetters('sponsorship-requests', {
      requests: types.requests,
    }),
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('sponsorship-requests', {
      setRequests: types.SET_REQUESTS,
      concatRequests: types.CONCAT_REQUESTS,
    }),
    ...mapActions('sponsorship-requests', {
      loadSponsorshipRequests: types.LOAD_REQUESTS,
    }),
    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadSponsorshipRequests(
          this.isIncomingRequests
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
      this.selectedRequest = request
      this.isDrawerShown = true
    },

    closeDrawerAndUpdateList () {
      this.isDrawerShown = false
      this.initFirstPageLoader()
    },
  },
}
</script>

<style scoped lang="scss">
.sponsorship-requests__loader {
  margin-top: 1rem;
}
</style>
