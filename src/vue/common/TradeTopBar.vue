<template>
  <div class="trade-top-bar">
    <top-bar>
      <template slot="main">
        <router-link
          :to="{
            name: vueRoutes.trade.exchange.name,
            query: { base: assetPair.base, quote: assetPair.quote }
          }"
        >
          {{ 'trade-top-bar.exchange-view' | globalize }}
        </router-link>
        <router-link
          :to="{
            name: vueRoutes.trade.userOffers.name,
            query: { base: assetPair.base, quote: assetPair.quote }
          }"
        >
          {{ 'trade-top-bar.my-offers-view' | globalize }}
        </router-link>
      </template>
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isCreateBuyOfferDrawerShown = true"
        >
          {{ 'trade-top-bar.create-buy-offer-button' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-raised"
          @click="isCreateSellOfferDrawerShown = true"
        >
          {{ 'trade-top-bar.create-sell-offer-button' | globalize }}
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
          // eslint-disable-next-line
          { value: assetPairBalances.base, currency: assetPair.base } | formatMoney
        }}
        /
        {{
          // eslint-disable-next-line
          { value: assetPairBalances.quote, currency: assetPair.quote } | formatMoney
        }}
      </p>
      <p class="trade-asset-selector__balances-label">
        {{ 'trade-top-bar.user-balances-label' | globalize }}
      </p>
    </div>

    <drawer :is-shown.sync="isCreateBuyOfferDrawerShown">
      <template slot="heading">
        {{ 'trade-top-bar.create-buy-offer-form-title' | globalize }}
      </template>
      <create-trade-offer-form
        :asset-pair="assetPair"
        @close-drawer="closeBuyOfferDrawer"
      />
    </drawer>
    <drawer :is-shown.sync="isCreateSellOfferDrawerShown">
      <template slot="heading">
        {{ 'trade-top-bar.create-sell-offer-form-title' | globalize }}
      </template>
      <create-trade-offer-form
        :asset-pair="assetPair"
        :is-buy="false"
        @close-drawer="closeSellOfferDrawer"
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
import CreateTradeOfferForm from '@/vue/forms/CreateTradeOfferForm'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import { vueRoutes } from '@/vue-router/routes'
import { Bus } from '@/js/helpers/event-bus'
import { errors } from '@tokend/js-sdk'

const EVENTS = {
  reloadTradeData: 'reload-trade-data',
}

export default {
  name: 'trade-top-bar',
  components: {
    SelectField,
    CreateTradeOfferForm,
    Drawer,
    TopBar,
  },
  data: () => ({
    assetPair: {
      base: '',
      quote: '',
    },
    errors,
    selectedPair: '',
    tradeablePairs: [],
    formattedPairs: [],
    isCreateBuyOfferDrawerShown: false,
    isCreateSellOfferDrawerShown: false,
    vueRoutes,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
    ]),
    assetPairBalances () {
      return {
        base: (this.accountBalances
          .find(i => i.asset === this.assetPair.base) || {}).balance,
        quote: (this.accountBalances
          .find(i => i.asset === this.assetPair.quote) || {}).balance,
      }
    },
  },
  watch: {
    selectedPair (value) {
      const baseAsset = value.split('/')[0]
      const quoteAsset = value.split('/')[1]
      this.assetPair.base = baseAsset
      this.assetPair.quote = quoteAsset

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
          // eslint-disable-next-line
          Bus.error({
            messageId: 'trade-top-bar.error-invalid-base-quote-query-in-link',
            messageArgs: {
              invalidBase: queryBase,
              invalidQuote: queryQuote,
              defaultPair: this.formattedPairs[0],
            },
          })
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
    closeBuyOfferDrawer () {
      this.isCreateBuyOfferDrawerShown = false
      this.$emit(EVENTS.reloadTradeData)
      this.loadBalances()
    },
    closeSellOfferDrawer () {
      this.isCreateSellOfferDrawerShown = false
      this.$emit(EVENTS.reloadTradeData)
      this.loadBalances()
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
