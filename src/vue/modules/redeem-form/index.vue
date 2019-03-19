<template>
  <div>
    <div
      class="redeem-form-module"
      v-if="isInitialized && assetsInTheBalance.length"
    >
      <form @submit.prevent="showConfirmation">
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              v-model="form.asset"
              :values="assetsInTheBalance"
              key-as-value-text="nameAndCode"
              class="app__select"
              :label="'redeem-form.opportunity-uniq-code' | globalize"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              v-if="selectedSale"
              :label="'redeem-form.invested-in' | globalize"
              v-model="selectedSale.defaultQuoteAsset.id"
              name="redeem-invested-in"
              :readonly="true"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              :label="'redeem-form.total' | globalize"
              v-model="form.totalAmount"
              name="redeem-total"
              :readonly="true"
            />
          </div>
        </div>

        <template v-if="formMixin.isConfirmationShown">
          <form-confirmation
            @cancel="hideConfirmation"
            @ok="submit"
            :is-pending="isRedeemProcessing"
            class="app__form-confirmation"
          />
        </template>

        <template v-else>
          <div class="app__form-actions">
            <button
              v-ripple
              type="submit"
              class="app__form-submit-btn"
              :disabled="formMixin.isDisabled"
            >
              <template>
                {{ 'redeem-form.submit-sell-btn' | globalize }}
              </template>
            </button>
          </div>
        </template>
      </form>
    </div>
    <no-data-message
      :title="'redeem-form.no-investments' | globalize"
      :message="'redeem-form.here-will-investments-list' | globalize"
      v-else-if="!assetsInTheBalance.length && isInitialized"
    />
    <loader v-else message-id="redeem-form.loading-msg" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

import FormConfirmation from '@/vue/common/FormConfirmation'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import FormMixin from '@/vue/mixins/form.mixin'
import OfferManagerMixin from '@/vue/mixins/offer-manager.mixin'

import { MathUtil } from '@/js/utils/math.util'

const EVENTS = {
  redeemed: 'redeemed',
}

export default {
  name: 'redeem-form',
  components: {
    FormConfirmation,
    NoDataMessage,
    Loader,
  },
  mixins: [FormMixin, OfferManagerMixin],
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     * @property config.minAmount - min allowed amount
     * @property config.maxAmount - max allowed amount
     */
    config: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    isInitialized: false,
    form: {
      asset: null,
      quoteAsset: null,
      totalAmount: null,
    },
    selectedSale: null,
    isRedeemProcessing: false,
  }),
  computed: {
    ...mapGetters('redeem-form', {
      balances: types.balances,
      assets: types.assets,
    }),
    assetsInTheBalance () {
      const balancesCodes = this.balances.map(i => i.assetCode)
      return this.assets.filter(a => balancesCodes.includes(a.code))
    },
  },
  watch: {
    async 'form.asset' (asset) {
      this.disableForm()
      this.selectedSale = await this.loadSaleByBaseAsset(asset.code)
      this.form.quoteAsset = this.selectedSale.quoteAssets[0]
      this.enableForm()
    },
    selectedSale (sale) {
      this.form.totalAmount = this.calculateRedeemPrice(sale)
    },
  },
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
    await this.loadAssets()
    this.setDefaultAsset()
    this.isInitialized = true
  },
  methods: {
    ...mapMutations('redeem-form', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('redeem-form', {
      loadBalances: types.LOAD_BALANCES,
      loadAssets: types.LOAD_ASSETS,
      loadSaleByBaseAsset: types.LOAD_SALE_BY_BASE_ASSET,
    }),
    async submit () {
      this.disableForm()
      this.isRedeemProcessing = true
      // TODO: move it to the store action
      await this.createOffer(this.getCreateOfferOpts())
      this.isRedeemProcessing = false
      this.enableForm()
      this.hideConfirmation()
      this.$emit(EVENTS.closeDrawer)
    },
    getCreateOfferOpts () {
      const balance = this.balances
        .find(b => b.assetCode === this.form.asset.code).value

      return {
        pair: {
          base: this.form.asset.code,
          quote: this.form.quoteAsset.id,
        },
        baseAmount: balance,
        quoteAmount: this.form.totalAmount,
        price: this.form.asset.details.redeemPrice,
        isBuy: false,
      }
    },
    setDefaultAsset () {
      this.form.asset = this.assetsInTheBalance[0]
    },
    calculateRedeemPrice (sale) {
      const balance = this.balances
        .find(b => b.assetCode === this.form.asset.code).value

      return MathUtil.multiply(this.form.asset.details.redeemPrice, balance)
    },
    redeemed () {
      this.$emit(EVENTS.redeemed)
    },
  },
}
</script>

<style lang="scss">
@import '@/vue/forms/_app-form';
</style>
