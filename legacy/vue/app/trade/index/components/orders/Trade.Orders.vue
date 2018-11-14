<template>
  <div>
    <div class="app__card orders">
      <div class="app__card-header orders__title">
        <div class="md-title">{{ i18n.trd_orders() }}</div>
      </div>

      <div class="app__card-content orders__list-container">
        <div class="orders__list-wrp">
          <order-list
            class="orders__list"
            :type="ORDER_TYPES.buy"
            :list="formattedBuyOffers" />
          <order-list
            class="orders__list"
            :type="ORDER_TYPES.sell"
            :list="formattedSellOffers" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderList from './Orders.List'

import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../../../vuex/types'
import { ORDER_TYPES } from '../../../../../../js/const/order-types'
import { i18n } from '../../../../../../js/i18n/index'

export default {
  name: 'orders',
  components: { OrderList },
  data: _ => ({
    ORDER_TYPES,
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.buyOffers,
      vuexTypes.sellOffers
    ]),
    formattedBuyOffers () {
      const buyOffers = this.buyOffers
      return buyOffers.sort((a, b) => b.price - a.price)
    },
    formattedSellOffers () {
      const sellOffers = this.sellOffers
      return sellOffers.sort((a, b) => a.price - b.price)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/mixins";

  .orders__list-wrp {
    display: flex;
    justify-content: space-between;

    @include respond-to-custom(985px) {
      flex-direction: column;
    }
  }

  .orders__list {
    width: 100%;

    @include respond-to-custom(985px) {
      margin-bottom: 32px;
    }

    &:first-child {
      margin-right: 1rem;

      @include respond-to-custom(985px) {
        margin-right: 0;
      }
    }
  }

  .orders__list-container {
    @include respond-to-custom(520px) {
      padding: 0 8px 8px;
    }
  }
</style>
