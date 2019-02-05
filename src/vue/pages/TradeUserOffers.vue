<template>
  <div class="trade-user-offers">
    <trade-open-offers
      :asset-pair="assetPair"
      :is-loading="isopenOffersLoading"
      :open-offers="openOffers"
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
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'trade-user-offers',
  components: {
    TradeOpenOffers,
  },
  data: () => ({
    openOffers: [],
    isopenOffersLoading: false,
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
  },
  async created () {
    this.setSelectedAssets(this.assetPair)
    if (this.assetPair.base) {
      await this.loadOffersHistory()
    }
    Bus.on(Bus.eventList.reloadTradeData, this.loadOffersHistory)
  },
  methods: {
    setSelectedAssets ({ base, quote }) {
      this.assetPair.base = base
      this.assetPair.quote = quote
    },
    async loadOffersHistory () {
      this.isopenOffersLoading = true
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
        ErrorHandler.process(error)
      }
      this.isopenOffersLoading = false
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

.trade-user-offers {
  margin-top: 4rem;
}

</style>
