<template>
  <div class="trade-user-orders">
    <trade-open-orders
      :assets="assets"
      :is-loading="isOpenOrdersLoading"
      :open-orders="openOrders"
    />
  </div>
</template>

<script>
import TradeOpenOrders from '@/vue/pages/TradeUserOrders/Trade.OpenOrders'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { Sdk } from '@/sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'trade-user-orders',
  components: {
    TradeOpenOrders,
  },
  props: {
    // prop from parent router-view component
    componentConfig: { type: Object, required: true },
  },
  data: () => ({
    assets: {
      base: '',
      quote: '',
    },
    openOrders: [],
    isOpenOrdersLoading: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },
  watch: {
    'componentConfig.assets': {
      deep: true,
      handler: async function (assets) {
        this.setSelectedAssets(assets)
        if (assets.base && assets.quote) {
          await this.loadOrdersHistory()
        }
      },
    },
  },
  async created () {
    this.setSelectedAssets(this.$route.query)
    await this.loadOrdersHistory()
  },
  methods: {
    setSelectedAssets ({ base, quote }) {
      this.assets.base = base
      this.assets.quote = quote
    },
    async loadOrdersHistory () {
      this.isOpenOrdersLoading = true
      try {
        const response = await Sdk.horizon.account.getOffers(
          this.accountId,
          {
            base_asset: this.assets.base,
            quote_asset: this.assets.quote,
            is_buy: '', // buy and sell
            order_book_id: SECONDARY_MARKET_ORDER_BOOK_ID,
          },
        )
        this.openOrders = response.data
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isOpenOrdersLoading = false
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

.trade-user-orders {
  margin-top: 4rem;
}

</style>
