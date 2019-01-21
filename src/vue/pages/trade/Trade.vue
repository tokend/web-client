<template>
  <div class="trade">
    <top-bar>
      <template slot="main">
        <router-link
          :to="{ name: 'app.trade' }"
        >
          <span>Exhange</span>
        </router-link>
        <router-link
          :to="{ name: 'app.trade' }"
        >
          <span>My Orders</span>
        </router-link>
      </template>
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="createBuyOrderIsShown = true"
        >
          Create buy order
        </button>
        <button
          v-ripple
          class="app__button-raised"
          @click="createSellOrderIsShown = true"
        >
          Create sell order
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="createBuyOrderIsShown">
      <template slot="heading">
        Create buy order
      </template>
      <create-buy-order-form
        :assets="assets"
        @close-drawer="createBuyOrderIsShown = false"
      />
    </drawer>
    <drawer :is-shown.sync="createSellOrderIsShown">
      <template slot="heading">
        Some form
      </template>
    </drawer>
  </div>
</template>

<script>
import CreateBuyOrderForm from '@/vue/forms/CreateBuyOrderForm'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'trade',
  components: {
    CreateBuyOrderForm,
    Drawer,
    TopBar,
  },
  data: () => ({
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
  created () {
    this.loadBalances()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
  },
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";
</style>
