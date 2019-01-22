<template>
  <div class="trade">
    <top-bar>
      <template slot="main">
        <router-link
          :to="{ name: 'app.trade' }"
        >
          {{ 'trade.exhange-view' | globalize }}
        </router-link>
        <router-link
          :to="{ name: 'app.trade' }"
        >
          {{ 'trade.my-orders-view' | globalize }}
        </router-link>
      </template>
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="createBuyOrderIsShown = true"
        >
          {{ 'trade.create-buy-order-button' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-raised"
          @click="createSellOrderIsShown = true"
        >
          {{ 'trade.create-sell-order-button' | globalize }}
        </button>
      </template>
    </top-bar>

    <div class="trade__asset-selector">
      <div class="trade__asset-selector-wrapper">
        <select-field
          v-model="selectedPair"
          :values="formattedPairs"
          :key="selectedPair"
          class="trade__asset-selector-field"
        />
      </div>
      <div class="trade__asset-selector-balances">
        <p class="trade__asset-selector-balances-value">
          {{
            { value: balances.baseBalance, currency: assets.base } | formatMoney
          }}
          /
          {{
            {value: balances.quoteBalance, currency: assets.quote} | formatMoney
          }}
        </p>
        <p class="trade__asset-selector-balances-label">
          {{ 'trade.user-balances-label' | globalize }}
        </p>
      </div>
    </div>

    <drawer :is-shown.sync="createBuyOrderIsShown">
      <template slot="heading">
        {{ 'trade.create-buy-order-form-title' | globalize }}
      </template>
      <create-trade-order-form
        :assets="assets"
        @close-drawer="createBuyOrderIsShown = false; loadBalances()"
      />
    </drawer>
    <drawer :is-shown.sync="createSellOrderIsShown">
      <template slot="heading">
        {{ 'trade.create-sell-order-form-title' | globalize }}
      </template>
      <create-trade-order-form
        :assets="assets"
        :is-buy="false"
        @close-drawer="createSellOrderIsShown = false; loadBalances()"
      />
    </drawer>
  </div>
</template>

<script>
import CreateTradeOrderForm from '@/vue/forms/CreateTradeOrderForm'
import SelectField from '@/vue/fields/SelectField'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Sdk } from '@/sdk'

export default {
  name: 'trade',
  components: {
    CreateTradeOrderForm,
    SelectField,
    Drawer,
    TopBar,
  },
  data: () => ({
    createBuyOrderIsShown: false,
    createSellOrderIsShown: false,
    assets: {
      base: '',
      quote: '',
    },
    balances: {
      baseBalance: '',
      quoteBalance: '',
    },
    selectedPair: '',
    tradeablePairs: [],
    formattedPairs: [],
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
    ]),
  },
  watch: {
    selectedPair (value) {
      const baseAsset = value.split('/')[0]
      const quoteAsset = value.split('/')[1]
      this.assets.base = baseAsset
      this.assets.quote = quoteAsset

      const accountBalances = this.accountBalances
      const baseBalance = accountBalances.find(i => i.asset === baseAsset)
      const quoteBalance = accountBalances.find(i => i.asset === quoteAsset)
      this.balances.baseBalance = baseBalance.balance
      this.balances.quoteBalance = quoteBalance.balance
    },
  },
  created () {
    this.loadBalances()
    this.loadTradableAssets()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async loadTradableAssets () {
      const response = await Sdk.horizon.assetPairs.getAll()
      this.tradeablePairs = response.data
      this.createFormattedPairs()
    },
    createFormattedPairs () {
      const formattedPairs = this.tradeablePairs.map(item => {
        return `${item.base}/${item.quote}`
      })
      this.formattedPairs = formattedPairs
      if (formattedPairs.length) this.selectedPair = formattedPairs[0]
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

.trade__asset-selector-field {
  display: inline-block;
  width: auto;
}

.trade__asset-selector-balances {
  margin-top: 2.4rem;
}

.trade__asset-selector-balances-value {
  font-size: 2.8rem;
  font-weight: 400;
}

.trade__asset-selector-balances-label {
  font-size: 1.6rem;
  color: $col-text-secondary;
}
</style>
