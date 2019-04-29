<template>
  <div class="pre-issuance-requests">
    <template v-if="isLoaded">
      <requests-table :requests="requests" />
    </template>

    <p v-else-if="isLoadingFailed">
      {{ 'pre-issuance-requests.loading-error-msg' | globalize }}
    </p>

    <load-spinner v-else message-id="pre-issuance-requests.loading-msg" />

    <collection-loader
      class="pre-issuance-requests__loader"
      v-show="requests.length && isLoaded"
      :first-page-loader="firstPageLoader"
      @first-page-load="setRequests"
      @next-page-load="concatRequests"
    />
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'
import CollectionLoader from '@/vue/common/CollectionLoader'

import RequestsTable from './components/requests-table'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'pre-issuance-requests-module',
  components: {
    LoadSpinner,
    CollectionLoader,
    RequestsTable,
  },

  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    firstPageLoader: () => {},
  }),

  computed: {
    ...mapGetters('pre-issuance-requests', {
      requests: types.requests,
    }),
    ...mapGetters([
      vuexTypes.wallet,
    ]),
  },

  created () {
    this.setAccountId(this.wallet.accountId)
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('pre-issuance-requests', {
      setAccountId: types.SET_ACCOUNT_ID,
      setRequests: types.SET_REQUESTS,
      concatRequests: types.CONCAT_REQUESTS,
    }),

    ...mapActions('pre-issuance-requests', {
      loadPreIssuanceRequests: types.LOAD_REQUESTS,
    }),

    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadPreIssuanceRequests()
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
  },
}
</script>

<style lang="scss" scoped>
.pre-issuance-requests__loader {
  margin-top: 1rem;
}
</style>
