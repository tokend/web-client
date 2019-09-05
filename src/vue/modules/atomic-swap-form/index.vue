<template>
  <div>
    <div
      class="atomic-swap__asset-description"
      v-if="assetByCode(atomicSwap.baseAsset).description"
    >
      <p
        class="atomic-swap__asset-description-lbl"
      >
        {{ 'atomic-swap-form.asset-description-lbl' | globalize }}:
      </p>
      <p>{{ assetByCode(atomicSwap.baseAsset).description }}</p>
    </div>
    <atomic-swap-form
      :atomic-swap="atomicSwap"
      @submitted="handleAtomicSwapFormSubmitted"
      @select-asset="selectQuoteAsset"
    />
    <div
      class="atomic-swap__pending-atomic-swap-table-table-wrp"
      v-if="selectedQuoteAsset.isCoinpayments"
    >
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
      selectedQuoteAsset: {},
      pendingAtomicSwapBids: [],
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.assetByCode,
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
        .map(item => new AtomicSwapBidRecord(item))
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
          'request_details.quote_asset': this.selectedQuoteAsset.code,
          'request_details.ask_id': this.atomicSwap.id,
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
    selectQuoteAsset (code) {
      this.selectedQuoteAsset = this.assetByCode(code)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/scss/variables';

  .atomic-swap__pending-atomic-swap-table-table-wrp {
    width: 100%;
    max-width: 100%;
    margin-top: 5rem;
  }

  .atomic-swap__asset-description {
    margin-bottom: 2.4rem;
  }

  .atomic-swap__asset-description-lbl {
    font-size: 1.2rem;
    color: $col-primary-inactive;
  }
</style>
