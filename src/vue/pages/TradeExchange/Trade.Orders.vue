<template>
  <div class="trade-orders">
    <h3 class="app__table-title">
      <template v-if="isBuy">
        {{ 'trade-orders.subtitle-ask' | globalize }}
      </template>
      <template v-else>
        {{ 'trade-orders.subtitle-bid' | globalize }}
      </template>
    </h3>
    <template v-if="ordersList.length">
      <div
        class="app__table
              app__table--with-shadow
              app__table--clickable-rows"
      >
        <table>
          <thead>
            <tr>
              <th>
                <!-- eslint-disable-next-line -->
                {{ 'trade-orders.table-want-lbl' | globalize({ asset: assets.base }) }}
              </th>
              <th>
                <!-- eslint-disable-next-line -->
                {{ 'trade-orders.table-order-lbl' | globalize({ asset: assets.quote }) }}
              </th>
              <th>
                <!-- eslint-disable-next-line -->
                {{ 'trade-orders.table-price-lbl' | globalize({ asset: assets.quote }) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(order, o) in ordersList"
              :key="`trade-orders-row-${o}`"
              @click="selectOrder(order)"
              :disabled="order.ownerId === accountId">
              <td>{{ order.baseAmount }}</td>
              <td>{{ order.quoteAmount }}</td>
              <td>{{ order.price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else-if="isLoading">
      <loader :message-id="'trade-orders.loading-msg'" />
    </template>
    <template v-else>
      <no-data-message
        :title-id="'trade-orders.no-data-title'"
        :message-id="noDataMessage.messageId"
        :message-id-args="noDataMessage.messageIdArgs"
      />
    </template>

    <drawer :is-shown.sync="isSubmitOrderDrawerShown">
      <template slot="heading">
        <template v-if="isBuy">
          {{ 'trade-orders.submit-ask-order-title' | globalize }}
        </template>
        <template v-else>
          {{ 'trade-orders.submit-bid-order-title' | globalize }}
        </template>
      </template>
      <submit-trade-order-form
        :is-buy="isBuy"
        :assets="assets"
        :order="selectedOrder"
        @close-drawer="closeDrawer"
      />
    </drawer>
  </div>
</template>

<script>
import SubmitTradeOrderForm from '@/vue/forms/SubmitTradeOrderForm'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'
import FormMixin from '@/vue/mixins/form.mixin'
import Drawer from '@/vue/common/Drawer'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

const EVENTS = {
  reloadTrades: 'reload-trades',
}

export default {
  name: 'trade-orders',
  components: {
    NoDataMessage,
    Loader,
    Drawer,
    SubmitTradeOrderForm,
  },
  mixins: [FormMixin],
  props: {
    assets: {
      type: Object,
      required: true,
      default: () => ({ base: '', quote: '' }),
    },
    isLoading: { type: Boolean, required: true },
    isBuy: { type: Boolean, required: true },
    ordersList: { type: Array, required: true },
  },
  data: () => ({
    isSubmitOrderDrawerShown: false,
    selectedOrder: {},
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    noDataMessage () {
      const messageId = this.isBuy
        ? 'trade-orders.no-data-for-asks-message'
        : 'trade-orders.no-data-for-bids-message'

      return {
        messageId: messageId,
        messageIdArgs: {
          base: this.assets.base,
          quote: this.assets.quote,
        },
      }
    },
  },
  methods: {
    selectOrder (order) {
      if (order.ownerId !== this.accountId) {
        this.isSubmitOrderDrawerShown = true
        this.selectedOrder = order
      }
    },
    closeDrawer () {
      this.isSubmitOrderDrawerShown = false
      this.$emit(EVENTS.reloadTrades)
    },
  },
}
</script>

<style lang="scss">

</style>
