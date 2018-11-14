<template>
  <div class="trade-orders">
    <buy-order
      :assets="assets"
      class="md-layout-item" />
    <sell-order
      :assets="assets"
      class="md-layout-item" />
  </div>
</template>

<script>
import BuyOrder from './TradeOrders.BuyOrder'
import SellOrder from './TradeOrders.SellOrder'

export default {
  name: 'trade-orders',
  components: { BuyOrder, SellOrder },
  props: {
    assets: { type: Object, require: true, default: () => {} }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../../../scss/mixins";

.trade-orders {
  display: flex;
  flex-wrap: wrap;

  @include respond-to-custom(980px) {
    flex-direction: column;
  }

  & > .app__card:first-child {
    margin-right: 8px;
    width: calc(50% - 8px);

    @include respond-to-custom(980px) {
      width: 100%;
      margin-right: 0;
    }
  }
  & > .app__card:last-child {
    margin-left: 8px;
    width: calc(50% - 8px);

    @include respond-to-custom(980px) {
      width: 100%;
      margin-left: 0;
      margin-top: 16px;
    }
  }
}
</style>
