<template>
  <div class="atomic-swap-requests">
    <div class="app__table app__table--last-td-to-right">
      <template
        v-if="isAtomicSwapRequestsLoaded && !isAtomicSwapRequestsLoadFailed"
      >
        <h4
          v-if="atomicSwapRequests.length"
          class="atomic-swap-requests__header"
        >
          {{ 'atomic-swaps.purchases' | globalize }}
        </h4>
        <table>
          <tbody>
            <tr v-for="item in atomicSwapRequests" :key="item.id">
              <td>
                <email-getter :account-id="item.buyerId" />
              </td>
              <td>
                <!-- eslint-disable-next-line max-len -->
                {{ item.amount | formatMoney }} ({{ item.convertedAmount | formatMoney }} {{ item.quoteAsset.quoteAsset }})
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <loader
        v-else-if="!isAtomicSwapRequestsLoadFailed"
        message-id="atomic-swaps.loading"
      />
      <div v-else>
        {{ 'atomic-swaps.loading-error-msg' | globalize }}
      </div>
    </div>
    <div>
      <collection-loader
        v-if="!isAtomicSwapRequestsLoadFailed"
        v-show="isAtomicSwapRequestsLoaded"
        :first-page-loader="loadAtomicSwapRequestsFirstPage"
        @first-page-load="setAtomicSwapRequests"
        @next-page-load="concatAtomicSwapRequests"
      />
    </div>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import CollectionLoader from '@/vue/common/CollectionLoader'
import Loader from '@/vue/common/Loader'

import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { AtomicSwapRequestsRecord } from '@/js/records/requests/atomic-swap-requests.record'
import { api } from '@/api'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { REQUEST_STATES } from '@/js/const/request-states.const'

export default {
  name: 'atomic-swap-requests',
  components: {
    EmailGetter,
    CollectionLoader,
    Loader,
  },
  props: {
    atomicSwap: { type: AtomicSwapRecord, required: true },
  },
  data () {
    return {
      isAtomicSwapRequestsLoaded: false,
      isAtomicSwapRequestsLoadFailed: false,
      atomicSwapRequests: [],
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.assetByCode,
    ]),
  },
  methods: {
    async loadAtomicSwapRequestsFirstPage () {
      this.isAtomicSwapRequestsLoaded = false
      try {
        const response = await api.getWithSignature(
          '/v3/create_atomic_swap_bid_requests',
          {
            filter: {
              'state': REQUEST_STATES.approved,
              'request_details.ask_owner': this.accountId,
              'request_details.ask_id': this.atomicSwap.id,
            },
            include: ['request_details', 'request_details.quote_asset'],
          })
        this.isAtomicSwapRequestsLoaded = true
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isAtomicSwapRequestsLoadFailed = true
      }
    },
    setAtomicSwapRequests (atomicSwapRequests) {
      this.atomicSwapRequests = atomicSwapRequests
        .map(item => new AtomicSwapRequestsRecord(
          item,
          this.assetByCode(this.atomicSwap.baseAsset).trailingDigitsCount,
          this.assetByCode(item.requestDetails.quoteAsset.quoteAsset)
            .trailingDigitsCount,
        )
        )
    },
    concatAtomicSwapRequests (atomicSwapRequests) {
      this.atomicSwapRequests.concat(
        atomicSwapRequests.data
          .map(item => new AtomicSwapRequestsRecord(
            item,
            this.assetByCode(this.atomicSwap.baseAsset).trailingDigitsCount,
            this.assetByCode(item.requestDetails.quoteAsset.quoteAsset)
              .trailingDigitsCount,
          )
          )
      )
    },
  },
}
</script>

<style lang="scss" scoped>
  .atomic-swap-requests__header {
    margin: 2rem 0;
  }
</style>
