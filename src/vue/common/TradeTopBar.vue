<template>
  <div class="trade-top-bar">
    <template>
      <top-bar>
        <template slot="main">
          <router-link
            v-if="isLoaded"
            :to="{
              name: vueRoutes.tradeExchange.name,
              query: { base: assetPair.base, quote: assetPair.quote }
            }"
          >
            <span>
              {{ 'trade-top-bar.exchange-view' | globalize }}
            </span>
          </router-link>
          <skeleton-loader
            v-else
            template="smallString"
          />
          <router-link
            v-if="isLoaded"
            :to="{
              name: vueRoutes.tradeUserOffers.name,
              query: { base: assetPair.base, quote: assetPair.quote }
            }"
          >
            <span>
              {{ 'trade-top-bar.my-offers-view' | globalize }}
            </span>
          </router-link>
          <skeleton-loader
            v-else
            template="smallString"
          />
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
          v-if="formattedPairs.length && isLoaded"
          v-model="selectedPair"
          :key="selectedPair"
          class="trade-asset-selector__field app__select app__select--no-border"
        >
          <option
            v-for="assetPair in formattedPairs"
            :key="assetPair"
            :value="assetPair"
          >
            {{ assetPair }}
          </option>
        </select-field>
        <skeleton-loader
          v-else-if="!isLoaded"
          template="bigString"
        />
        <no-data-message
          v-else
          :title="'trade-top-bar.no-pairs-message' | globalize"
          :message="'trade-top-bar.here-will-pairs-list' | globalize"
        />
      </div>
      <div class="trade-asset-selector__balances">
        <p
          v-if="formattedPairs.length && isLoaded"
          class="trade-asset-selector__balances-value"
        >
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
        <skeleton-loader
          v-else-if="!isLoaded"
          template="bigString"
        />
        <p
          v-if="formattedPairs.length && isLoaded"
          class="trade-asset-selector__balances-label"
        >
          {{ 'trade-top-bar.user-balances-label' | globalize }}
        </p>
        <skeleton-loader
          v-else-if="!isLoaded"
          class="trade-asset-selector__balances-skeleton-loader--margin"
          template="smallString"
        />
      </div>

      <drawer :is-shown.sync="isCreateBuyOfferDrawerShown">
        <template slot="heading">
          {{ 'trade-top-bar.create-buy-offer-form-title' | globalize }}
        </template>
        <create-trade-offer-form
          is-buy
          :asset-pair="assetPair"
          @offer-created="closeBuyOfferDrawer"
        />
      </drawer>
      <drawer :is-shown.sync="isCreateSellOfferDrawerShown">
        <template slot="heading">
          {{ 'trade-top-bar.create-sell-offer-form-title' | globalize }}
        </template>
        <create-trade-offer-form
          :asset-pair="assetPair"
          @offer-created="closeSellOfferDrawer"
        />
      </drawer>
    </template>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import NoDataMessage from '@/vue/common/NoDataMessage'
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

import SelectField from '@/vue/fields/SelectField'
import CreateTradeOfferForm from '@/vue/forms/market-orders/CreateTradeOfferForm'

import { api } from '@/api'
import { errors, ASSET_PAIR_POLICIES } from '@tokend/js-sdk'

import { AssetPairRecord } from '@/js/records/entities/asset-pair.record'

import { vuexTypes } from '@/vuex'
import { mapActions, mapGetters } from 'vuex'

import { vueRoutes } from '@/vue-router/routes'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

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
    NoDataMessage,
    SkeletonLoader,
  },
  data: () => ({
    assetPair: {
      base: '',
      quote: '',
    },
    isLoaded: false,
    isLoadingFailed: false,
    errors,
    selectedPair: '',
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
          .find(i => i.asset.code === this.assetPair.base) || {}).balance,
        quote: (this.accountBalances
          .find(i => i.asset.code === this.assetPair.quote) || {}).balance,
      }
    },
  },
  watch: {
    selectedPair (value) {
      if (value) {
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
      }
    },
  },
  async created () {
    try {
      await this.loadBalances()
      await this.loadTradablePairs()
      this.isLoaded = true
    } catch (error) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async loadTradablePairs () {
      const { data } = await api.get('/v3/asset_pairs', {
        filter: { policy: ASSET_PAIR_POLICIES.tradeableSecondaryMarket },
        page: { limit: 100 },
      })
      const tradablePairs = data.map(item => new AssetPairRecord(item))
      this.formattedPairs = tradablePairs.map(item => item.baseAndQuote)
      this.setDefaultSelectedPair(tradablePairs)
    },
    setDefaultSelectedPair (pairs) {
      const queryBase = this.$route.query.base
      const queryQuote = this.$route.query.quote

      // if the user comes on Trade page from another place with some base and
      // quote query params inside URL, we check that they're correct
      // (exists in system) and set the appropriate
      if (this.isQueryParamsValid(pairs)) {
        const pair = pairs.find((i) => {
          return i.baseAssetCode === queryBase &&
                  i.quoteAssetCode === queryQuote
        })
        this.selectedPair = pair.baseAndQuote
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
          return i.baseAssetCode === queryBase &&
            i.quoteAssetCode === queryQuote
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
@import '~@scss/mixins';
@import '~@scss/variables';

$media-custom-breakpoint: 450px;

.trade-asset-selector__balances-skeleton-loader--margin {
  margin-top: 0.8rem;
}

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

  @include respond-to-custom ($media-custom-breakpoint) {
    font-size: 2.2rem;
  }
}

.trade-asset-selector__balances-label {
  font-size: 1.6rem;
  color: $col-text-secondary;

  @include respond-to-custom ($media-custom-breakpoint) {
    font-size: 1.4rem;
  }
}
</style>
