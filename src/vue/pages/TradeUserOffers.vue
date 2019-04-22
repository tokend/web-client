<template>
  <div class="trade-user-offers">
    <trade-open-offers
      class="trade-user-offers__open-orders"
      :asset-pair="assetPair"
      :is-loading="isOpenOffersLoading"
      :open-offers="openOffers"
      @reload-offers="initFirstPageLoader"
    />

    <collection-loader
      v-show="!isOpenOffersLoading && openOffers.length"
      class="trade-user-offers__collection-loader"
      :first-page-loader="firstPageLoader"
      @first-page-load="setOpenOffers"
      @next-page-load="concatOpenOffers"
    />
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import TradeOpenOffers from '@/vue/pages/TradeUserOffers/Trade.OpenOffers'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Api } from '../../api'

export default {
  name: 'trade-user-offers',
  components: {
    TradeOpenOffers,
    CollectionLoader,
  },
  props: {
    isLoading: { type: Boolean, default: false },
  },
  data: () => ({
    openOffers: [],
    isOpenOffersLoading: false,
    firstPageLoader: _ => {},
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
  created () {
    this.setSelectedAssets(this.assetPair)
    if (this.assetPair.base) {
      this.initFirstPageLoader()
    }
  },
  methods: {
    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadOffersHistory()
    },
    setOpenOffers (offers) {
      this.openOffers = offers
    },
    concatOpenOffers (offers) {
      this.openOffers = this.openOffers.concat(offers)
    },
    setSelectedAssets ({ base, quote }) {
      this.assetPair.base = base
      this.assetPair.quote = quote
    },
    async loadOffersHistory () {
      this.isOpenOffersLoading = true
      try {
        const response = await Api.getWithSignature('/v3/offers', {
          filter: {
            base_asset: this.assetPair.base,
            quote_asset: this.assetPair.quote,
            order_book: SECONDARY_MARKET_ORDER_BOOK_ID,
            owner: this.accountId,
          },
        })
        this.isOpenOffersLoading = false
        return response
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>

<style lang="scss">
.trade-user-offers__open-orders {
  margin-top: 4.8rem;
}

.trade-user-offers__collection-loader {
  margin-top: 1rem;
}
</style>
