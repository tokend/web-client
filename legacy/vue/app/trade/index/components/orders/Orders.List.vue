<template>
  <md-table class="order-list">
    <md-table-toolbar class="order-list__title">
      <h2>
        {{
          type === ORDER_TYPES.buy
            ? i18n.trd_ask ()
            : i18n.trd_bid()
        }}
      </h2>
    </md-table-toolbar>
    <template v-if="list.length">
      <md-table-row>
        <md-table-head class="order-list__cell">
          {{
            type === ORDER_TYPES.buy
              ? i18n.trd_want()
              : i18n.trd_order()
          }}
          ({{ baseAsset }})
        </md-table-head>
        <md-table-head class="order-list__cell">
          {{
            type === ORDER_TYPES.buy
              ? i18n.trd_order()
              : i18n.trd_want()
          }}
          ({{ quoteAsset }})
        </md-table-head>
        <md-table-head class="order-list__cell">
          {{ i18n.trd_price() }} ({{ quoteAsset }})
        </md-table-head>
      </md-table-row>

      <template v-for="(order, i) in list">
        <md-table-row
          class="order-list__row"
          :key="`${i}-order-row`"
          @click.native="matchOrder(order)">
          <md-table-cell class="order-list__cell">
            {{ order.baseAmount }}
          </md-table-cell>
          <md-table-cell class="order-list__cell">
            {{ order.quoteAmount }}
          </md-table-cell>
          <md-table-cell class="order-list__cell">
            {{ order.price }}
          </md-table-cell>
        </md-table-row>
      </template>
    </template>
    <template v-else>
      <div class="order-list__no-transactions">
        <md-icon class="md-size-4x">trending_up</md-icon>
        <h2>{{ i18n.trd_no_orders_history() }}</h2>
        <p>
          {{
            type === ORDER_TYPES.buy ?
              i18n.trd_here_will_be_the_order_ask_list() :
              i18n.trd_here_will_be_the_order_bid_list()
          }}
        </p>
      </div>
    </template>
  </md-table>
</template>

<script>
import { i18n } from 'L@/js/i18n'
import { ORDER_TYPES } from 'L@/js/const/order-types'
import OrderMakerMixin from '../order-maker.mixin'
import SubmitterMixin from 'L@/vue/common/mixins/submitter.mixin'

import { confirmAction } from 'L@/js/modals/confirmation_message'

export default {
  name: 'order-list',
  mixins: [OrderMakerMixin, SubmitterMixin],
  props: {
    type: { type: String, required: true },
    list: { type: Array, required: true }
  },
  data: _ => ({
    ORDER_TYPES,
    i18n
  }),
  computed: {
    baseAsset () {
      if (!this.list.length) return
      return this.list[0].baseAssetCode
    },
    quoteAsset () {
      if (!this.list.length) return
      return this.list[0].quoteAssetCode
    }
  },
  methods: {
    async matchOrder (order) {
      if (!await confirmAction({ message: i18n.trd_confirm_match() })) return
      this.disable()
      await this.createOrder({
        pair: {
          base: order.baseAssetCode,
          quote: order.quoteAssetCode
        },
        baseAmount: order.baseAmount,
        quoteAmount: order.quoteAmount,
        price: order.price,
        isBuy: !order.isBuy
      })
      this.enable()
    }
  }
}
</script>

<style lang="scss">
@import "~L@scss/mixins";

.order-list {
  max-height: 400px;
}

.order-list__row {
  cursor: pointer;
}
.order-list__no-transactions {
  text-align: center;
}
.orders__list {
  width: 100%;
}

.order-list__title {
  @include respond-to-custom(985px) {
    min-height: 24px;
  }
}

.order-list {
  .md-table-head-label,
  .md-table-cell-container {
    padding-right: 4px;
    padding-left: 4px;
  }
}
</style>
