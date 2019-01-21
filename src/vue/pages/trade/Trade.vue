<template>
  <div class="trade">
    <div class="trade__navigation">
      <div class="trade__navigation-screens">
        <button
          class="trade__navigation-screens-link"
          :class="{
            'trade__navigation-screens-link--active':
              isActiveScreen(VIEW_MODES.exchange)
          }"
          type="button"
          @click="setViewMode(VIEW_MODES.exchange)">
          Exhange
        </button>
        <button
          class="trade__navigation-screens-link"
          :class="{
            'trade__navigation-screens-link--active':
              isActiveScreen(VIEW_MODES.order)
          }"
          type="button"
          @click="setViewMode(VIEW_MODES.order)">
          My Orders
        </button>
      </div>
      <div class="trade__navigation-forms">
        <button
          class="app__button-raised trade__navigation-forms-actions"
          type="button"
          @click="showCreateBuyOrderForm">
          Create buy order
        </button>

        <button
          class="app__button-raised trade__navigation-forms-actions"
          type="button">
          Create sell order
        </button>
      </div>
    </div>

    <drawer :is-shown.sync="showDrawer">
      <template v-if="createBuyOrderIsShown">
        <h3 slot="heading">
          Create buy order
        </h3>
        <create-buy-order
          :assets="assets"
          @close-drawer="showDrawer = false"
        />
      </template>
      <template v-if="createSellOrderIsShown">
        Some form
      </template>
    </drawer>
  </div>
</template>

<script>
import CreateBuyOrder from '@/vue/forms/CreateBuyOrder'
import Drawer from '@/vue/common/Drawer'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const VIEW_MODES = {
  exchange: 'exchange',
  orders: 'orders',
}
export default {
  name: 'trade',
  components: {
    CreateBuyOrder,
    Drawer,
  },
  data: () => ({
    VIEW_MODES,
    activeScreen: VIEW_MODES.exchange,
    showDrawer: false,
    createBuyOrderIsShown: false,
    createSellOrderIsShown: false,
    assets: {
      base: 'ETH',
      quote: 'BTC',
    },
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
    ]),
  },
  watch: {
    showDrawer (status) {
      if (!status) {
        this.createBuyOrderIsShown = false
        this.createSellOrderIsShown = false
      }
    },
  },
  created () {
    this.loadBalances()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    setViewMode (screenType) {
      this.activeScreen = screenType
    },
    isActiveScreen (screen) {
      return screen === this.activeScreen
    },
    showCreateBuyOrderForm () {
      this.showDrawer = true
      this.createBuyOrderIsShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/mixins";
@import "~@scss/variables";

.trade__navigation {
  padding: 1.6rem 6.5rem 1.6rem 5rem;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 -$content-side-paddings;

  @include respond-to-custom($sidebar-hide-bp) {
    margin: 0 $content-side-paddings-sm;
  }
}

.trade__navigation-screens {
  display: flex;
}

.trade__navigation-screens-link {
  font-size: 1.6rem;
  color: #837fa1;

  &:not(:first-child) {
    margin-left: 4rem;
  }

  &.trade__navigation-screens-link--active {
    color: #7b6eff;
  }
}

.trade__navigation-forms-actions {
  font-weight: 400;

  &:not(:last-child) {
    margin-left: .8rem;
  }
}

</style>
