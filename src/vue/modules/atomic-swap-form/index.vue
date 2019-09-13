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
      v-if="!isAtomicSwapBidCreated"
      :atomic-swap="atomicSwap"
      :is-disabled="isDisabled"
      @submitted="handleAtomicSwapFormSubmitted"
      @select-asset="selectQuoteAsset"
    />
    <address-viewer
      v-else
      :asset-code="assetByCode(form.quoteAsset).code"
      :amount="atomicSwapBidDetails.amount"
      :address="atomicSwapBidDetails.address"
      :end-time="atomicSwapBidDetails.endTime"
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
import AtomicSwapForm from '@/vue/forms/AtomicSwapForm'
import PendingAtomicSwapTable from './components/pending-atomic-swap-table'
import CollectionLoader from '@/vue/common/CollectionLoader'
import Loader from '@/vue/common/Loader'
import FormMixin from '@/vue/mixins/form.mixin'
import AddressViewer from '@/vue/common/address-viewer'
import { AtomicSwapBidRecord } from '@/js/records/entities/atomic-swap-bid.record'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

import { REQUEST_STATES } from '@/js/const/request-states.const'
import { ATOMIC_SWAP_BID_TYPES } from '@/js/const/atomic-swap-bid-types.const'

const EVENTS = {
  updateList: 'update-list',
}

export default {
  name: 'atomic-swap',
  components: {
    AtomicSwapForm,
    PendingAtomicSwapTable,
    CollectionLoader,
    Loader,
    AddressViewer,
  },
  mixins: [FormMixin],
  props: {
    atomicSwap: {
      type: AtomicSwapRecord,
      required: true,
    },
  },
  data () {
    return {
      form: {
        amount: '',
        quoteAsset: '',
      },
      isLoading: true,
      isFailed: false,
      isDisabled: false,
      selectedQuoteAsset: {},
      atomicSwapBidDetails: {
        address: '',
        endTime: -1,
        amount: '',
      },
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
    isAtomicSwapBidCreated () {
      return Boolean(this.atomicSwapBidDetails.address)
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

    async handleAtomicSwapFormSubmitted (form) {
      if (!this.isFormValid()) return
      this.form.amount = form.amount
      this.form.quoteAsset = form.quoteAsset

      this.isDisabled = true
      try {
        const createAtomicSwapBidOperation =
          this.buildCreateAtomicSwapBidOperation()

        const { data } = await api.postOperationsToSpecificEndpoint(
          '/integrations/marketplace/buy',
          createAtomicSwapBidOperation
        )
        const atomicSwapBid = new AtomicSwapBidRecord(data.data.attributes)
        if (atomicSwapBid.type === ATOMIC_SWAP_BID_TYPES.redirect) {
          window.location.href = atomicSwapBid.payUrl
        } else {
          this.atomicSwapBidDetails = atomicSwapBid
          this.$refs.table.resetAtomicSwapBidsSelection()
          this.$emit(EVENTS.updateList)
        }
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isDisabled = false
    },

    buildCreateAtomicSwapBidOperation () {
      const operation = {
        askID: this.atomicSwap.id,
        baseAmount: this.form.amount,
        quoteAsset: this.form.quoteAsset,
        creatorDetails: {
          request_identifier: +new Date() + '',
        },
      }
      return base.CreateAtomicSwapBidRequestBuilder
        .createAtomicSwapBidRequest(operation)
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
