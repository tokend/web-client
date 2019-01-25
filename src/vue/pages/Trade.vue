<template>
  <div class="trade">
    <top-bar>
      <template slot="main">
        <router-link
          :to="{
            name: vueRoutes.trade.exchange.name,
            query: { base: assets.base, quote: assets.quote }
          }"
        >
          {{ 'trade.exchange-view' | globalize }}
        </router-link>
        <router-link
          :to="{
            name: vueRoutes.trade.userOrders.name,
            query: { base: assets.base, quote: assets.quote }
          }"
        >
          {{ 'trade.my-orders-view' | globalize }}
        </router-link>
      </template>
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isCreateBuyOrderDrawerShown = true"
        >
          {{ 'trade.create-buy-order-button' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-raised"
          @click="isCreateSellOrderDrawerShown = true"
        >
          {{ 'trade.create-sell-order-button' | globalize }}
        </button>
      </template>
    </top-bar>

    <div class="trade-asset-selector__wrapper">
      <select-field
        v-model="selectedPair"
        :values="formattedPairs"
        :key="selectedPair"
        :form-free="true"
        class="trade-asset-selector__field"
      />
    </div>
    <div class="trade-asset-selector__balances">
      <p class="trade-asset-selector__balances-value">
        {{
          { value: balances.baseBalance, currency: assets.base } | formatMoney
        }}
        /
        {{
          {value: balances.quoteBalance, currency: assets.quote} | formatMoney
        }}
      </p>
      <p class="trade-asset-selector__balances-label">
        {{ 'trade.user-balances-label' | globalize }}
      </p>
    </div>

    <router-view :component-config="childRoutesConfig" />

    <drawer :is-shown.sync="isCreateBuyOrderDrawerShown">
      <template slot="heading">
        {{ 'trade.create-buy-order-form-title' | globalize }}
      </template>
      <create-trade-order-form
        :assets="assets"
        @close-drawer="closeBuyOrderDrawer"
      />
    </drawer>
    <drawer :is-shown.sync="isCreateSellOrderDrawerShown">
      <template slot="heading">
        {{ 'trade.create-sell-order-form-title' | globalize }}
      </template>
      <create-trade-order-form
        :assets="assets"
        :is-buy="false"
        @close-drawer="closeSellOrderDrawer"
      />
    </drawer>
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Sdk } from '@/sdk'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import CreateTradeOrderForm from '@/vue/forms/CreateTradeOrderForm'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import { vueRoutes } from '@/vue-router/routes'
import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'

export default {
  name: 'trade',
  components: {
    SelectField,
    CreateTradeOrderForm,
    Drawer,
    TopBar,
  },
  data: () => ({
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
    isCreateBuyOrderDrawerShown: false,
    isCreateSellOrderDrawerShown: false,
    vueRoutes,
    childRoutesConfig: {
      isNeededToReloadData: false,
      assets: {
        base: '',
        quote: '',
      },
    },
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
      // pass assets to child router-view components
      this.childRoutesConfig.assets.base = baseAsset
      this.childRoutesConfig.assets.quote = quoteAsset

      const accountBalances = this.accountBalances
      const baseBalance = accountBalances.find(i => i.asset === baseAsset)
      const quoteBalance = accountBalances.find(i => i.asset === quoteAsset)
      this.balances.baseBalance = baseBalance.balance
      this.balances.quoteBalance = quoteBalance.balance

      this.$router.replace({
        name: this.$route.name,
        query: {
          base: baseAsset,
          quote: quoteAsset,
        },
      })
    },
  },
  async created () {
    await this.loadBalances()
    await this.loadTradablePairs()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async loadTradablePairs () {
      try {
        const response = await Sdk.horizon.assetPairs.getAll()
        this.formatTradablePairs(response.data)
        this.setDefaultSelectedPair(response.data)
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    formatTradablePairs (pairs) {
      this.formattedPairs = pairs.map(item => {
        return `${item.base}/${item.quote}`
      })
    },
    setDefaultSelectedPair (pairs) {
      const queryBase = this.$route.query.base
      const queryQuote = this.$route.query.quote

      // if the user comes on Trade page from another place with some base and
      // quote query params inside URL, we check that they're correct
      // (exists in system) and set the appropriate
      if (this.isQueryParamsValid(pairs)) {
        const pair = pairs.find((i) => {
          return i.base === queryBase &&
                  i.quote === queryQuote
        })
        this.selectedPair = `${pair.base}/${pair.quote}`
      } else {
        this.selectedPair = this.formattedPairs[0]
        if (queryBase && queryQuote) {
          Bus.error(globalize('trade.error-invalid-base-quote-query-in-link', {
            invalidBase: queryBase,
            invalidQuote: queryQuote,
            defaultPair: this.formattedPairs[0],
          }))
        }
      }
    },
    isQueryParamsValid (pairs) {
      const queryBase = this.$route.query.base
      const queryQuote = this.$route.query.quote

      if (queryBase && queryQuote) {
        return Boolean(pairs.find((i) => {
          return i.base === queryBase && i.quote === queryQuote
        }))
      }
      return false
    },
    closeBuyOrderDrawer () {
      this.isCreateBuyOrderDrawerShown = false
      this.childRoutesConfig.isNeededToReloadData = true
    },
    closeSellOrderDrawer () {
      this.isCreateSellOrderDrawerShown = false
      this.childRoutesConfig.isNeededToReloadData = true
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

$custom-breakpoint: 450px;

.trade-asset-selector__field {
  display: inline-block;
  width: auto;
}

.trade-asset-selector__balances {
  margin-top: 2.4rem;
}

.trade-asset-selector__balances-value {
  font-size: 2.8rem;
  font-weight: 400;

  @include respond-to-custom ($custom-breakpoint) {
    font-size: 2.2rem;
  }
}

.trade-asset-selector__balances-label {
  font-size: 1.6rem;
  color: $col-text-secondary;

  @include respond-to-custom ($custom-breakpoint) {
    font-size: 1.4rem;
  }
}
</style>
