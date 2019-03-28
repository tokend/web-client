<template>
  <div class="trade-user-offers">
    <trade-open-offers
      class="trade-user-offers__open-orders"
      :asset-pair="assetPair"
      :is-loading="isOpenOffersLoading"
      :open-offers="openOffers"
      @reload-offers="loadOffersHistory"
    />
  </div>
</template>

<script>
import TradeOpenOffers from '@/vue/pages/TradeUserOffers/Trade.OpenOffers'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { Sdk } from '@/sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'trade-user-offers',
  components: {
    TradeOpenOffers,
  },
  props: {
    isLoading: { type: Boolean, default: false },
  },
  data: () => ({
    openOffers: [],
    isOpenOffersLoading: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    assetPair () {
      return {
        base: this.$route.query.base,
        quote: this.$route.query.quote,
      }
    },
  },
  watch: {
    'assetPair': {
      deep: true,
      handler: async function (assetPair) {
        this.setSelectedAssets(assetPair)
        if (assetPair.base && assetPair.quote) {
          await this.loadOffersHistory()
        }
      },
    },
    isLoading: async function () {
      await this.loadOffersHistory()
      this.$emit('update:isLoading', false)
    },
  },
  async created () {
    this.setSelectedAssets(this.assetPair)
    if (this.assetPair.base) {
      await this.loadOffersHistory()
    }
  },
  methods: {
    setSelectedAssets ({ base, quote }) {
      this.assetPair.base = base
      this.assetPair.quote = quote
    },
    async loadOffersHistory () {
      this.isOpenOffersLoading = true
      try {
        const response = await Sdk.horizon.account.getOffers(
          this.accountId,
          {
            base_asset: this.assetPair.base,
            quote_asset: this.assetPair.quote,
            is_buy: '', // buy and sell
            order_book_id: SECONDARY_MARKET_ORDER_BOOK_ID,
          },
        )
        this.openOffers = response.data
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isOpenOffersLoading = false
    },
  },
}
</script>

<style lang="scss">
.trade-user-offers__open-orders {
  margin-top: 4.8rem;
}
</style>
