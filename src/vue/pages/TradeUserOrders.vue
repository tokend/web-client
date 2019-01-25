<template>
  <div class="trade-user-orders">
    <h2 class="app__table-title">
      {{
        'trade-user-orders.title' | globalize({
          base: assets.base,
          quote: assets.quote
        })
      }}
    </h2>
    <template v-if="ordersHistory.length">
      <div class="app__table app__table--with-shadow">
        <table>
          <thead>
            <tr>
              <th>
                {{ 'trade-user-orders.table-id-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-user-orders.table-date-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-user-orders.table-order-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-user-orders.table-base-amount-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-user-orders.table-price-lbl' | globalize }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in ordersHistory"
              :key="`trade-user-orders-row-${i}`">
              <td>{{ item.offerId }}</td>
              <td>{{ item.createdAt | formatDate }}</td>
              <td>
                <template v-if="item.isBuy">
                  {{ 'trade-user-orders.buy-lbl' | globalize }}
                </template>
                <template v-else>
                  {{ 'trade-user-orders.sell-lbl' | globalize }}
                </template>
              </td>
              <td>{{ item.baseAmount | formatMoney }}</td>
              <td>{{ item.price | formatMoney }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else-if="isLoading">
      <loader :message-id="'trade-user-orders.loading-msg'" />
    </template>
    <template v-else>
      <!-- TODO: look at this and think about how make it better -->
      <no-data-message
        :title-id="'trade-user-orders.no-data-title'"
        :message-id="'trade-user-orders.no-data-message'"
        :message-id-args="{ base: assets.base, quote: assets.quote }"
      />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { Sdk } from '@/sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'trade-user-orders',
  components: {
    NoDataMessage,
    Loader,
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
    ordersHistory: [],
    isLoading: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },
  watch: {
    'componentConfig.assets': {
      deep: true,
      handler: function (assets) {
        this.assets.base = assets.base
        this.assets.quote = assets.quote
        if (assets.base && assets.quote) {
          this.loadOrdersHistory()
        }
      },
    },
  },
  created () {
    this.setSelectedAssets()
    this.loadOrdersHistory()
  },
  methods: {
    setSelectedAssets () {
      this.assets.base = this.$route.query.base
      this.assets.quote = this.$route.query.quote
    },
    async loadOrdersHistory () {
      this.isLoading = true
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
        this.ordersHistory = response.data
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isLoading = false
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
