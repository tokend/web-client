<template>
  <div>
    <atomic-swap-form
      :atomic-swap="atomicSwap"
      @submitted="handleAtomicSwapFormSubmitted"
    />
    <div class="atomic-swap__pending-atomic-swap-table-table-wrp">
      <pending-atomic-swap-table
        v-if="!isLoading"
        :pending-atomic-swap-bids="pendingAtomicSwapBids"
        ref="table"
      />
      <template v-else-if="isFailed">
        <p>
          {{ 'atomic-swap-form.load-failed-msg' | globalize }}
        </p>
      </template>
      <template v-else>
        <loader message-id="atomic-swap-form.loading-msg" />
      </template>
      <collection-loader
        v-show="pendingAtomicSwapBids.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setPendingAtomicSwapBids"
        @next-page-load="concatPendingAtomicSwapBids"
      />
    </div>
  </div>
</template>

<script>
import AtomicSwapForm from './components/atomic-swap-form'
import PendingAtomicSwapTable from './components/pending-atomic-swap-table'
import CollectionLoader from '@/vue/common/CollectionLoader'
import Loader from '@/vue/common/Loader'
import { AtomicSwapBidRecord } from './wrappers/atomic-swap-bid.record'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

import { REQUEST_STATES } from '@/js/const/request-states.const'
export default {
  name: 'atomic-swap',
  components: {
    AtomicSwapForm,
    PendingAtomicSwapTable,
    CollectionLoader,
    Loader,
  },
  props: {
    atomicSwap: {
      type: AtomicSwapRecord,
      required: true,
    },
  },
  data () {
    return {
      isLoading: true,
      isFailed: false,
      pendingAtomicSwapBids: [],
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    firstPageLoader () {
      return _ => this.loadFirstPage()
    },
  },
  methods: {
    setPendingAtomicSwapBids (records) {
      this.pendingAtomicSwapBids = records
        .map(item => new AtomicSwapBidRecord(item))
    },
    concatPendingAtomicSwapBids (records) {
      this.pendingAtomicSwapBids = this.pendingAtomicSwapBids.concat(records
        .map(item => new AtomicSwapBidRecord(item)),
      )
    },
    async loadFirstPage () {
      try {
        const response = await this.loadPendingAtomicSwapBids()
        this.isLoading = false
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isFailed = true
      }
    },
    async loadPendingAtomicSwapBids () {
      const endpoint = '/v3/create_atomic_swap_bid_requests'
      const response = await api.getWithSignature(endpoint, {
        filter: {
          requestor: this.accountId,
          state: REQUEST_STATES.pending,
        },
        page: {
          order: 'desc',
        },
        include: 'request_details',
      })
      return response
    },
    handleAtomicSwapFormSubmitted () {
      this.$refs.table.resetAtomicSwapBidsSelection()
    },
  },
}
</script>

<style lang="scss" scoped>
  .atomic-swap__pending-atomic-swap-table-table-wrp {
    width: 100%;
    max-width: 100%;
    margin-top: 5rem;
  }
</style>
