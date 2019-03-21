<template>
  <div>
    <div
      class="buy-back-form-module"
      v-if="isInitialized && assetsInBalance.length"
    >
      <form @submit.prevent="isFormValid() && showConfirmation()">
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              v-model="form.asset"
              :values="assetsInBalance"
              key-as-value-text="nameAndCode"
              class="app__select"
              :label="'buy-back-form.opportunity-uniq-code' | globalize"
            />
          </div>
        </div>
        <p class="app__form-field-description">
          {{
            'buy-back-form.issued-tokens' | globalize({
              value: allowedToBuy(form.asset.code)
            })
          }}
        </p>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              v-if="selectedSale.defaultQuoteAsset"
              :label="'buy-back-form.invested-in' | globalize"
              v-model="selectedSale.defaultQuoteAsset.id"
              name="but-back-invested-in"
              :readonly="true"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              :label="'buy-back-form.amount' | globalize({
                asset: form.asset.code
              })"
              v-model="form.amount"
              name="but-back-amount"
              type="number"
              :step="config.minAmount"
              autocomplite="off"
              @blur="touchField('form.amount')"
              :error-message="getFieldErrorMessage(
                'form.amount',
                {
                  quantity: config.decimalPoints,
                  maxValue: allowedToBuy(form.asset.code),
                  minValue: 0
                }
              )"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              :label="'buy-back-form.total' | globalize({
                asset: form.quoteAsset.id
              })"
              v-model="form.totalAmount"
              name="but-back-total"
              :readonly="true"
              @blur="touchField('form.totalAmount')"
              :error-message="getFieldErrorMessage(
                'form.totalAmount',
                {
                  minValue: 0
                }
              )"
            />
          </div>
        </div>

        <template v-if="formMixin.isConfirmationShown">
          <form-confirmation
            @cancel="hideConfirmation"
            @ok="submit"
            :is-pending="isBuyBackProcessing"
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
                {{ 'buy-back-form.submit-buy-btn' | globalize }}
              </template>
            </button>
          </div>
        </template>
      </form>
    </div>
    <no-data-message
      :title="'buy-back-form.no-investments' | globalize"
      :message="'buy-back-form.here-will-investments-list' | globalize"
      v-else-if="!assetsInBalance.length && isInitialized"
    />
    <loader v-else message-id="buy-back-form.loading-msg" />
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

import {
  required,
  maxValue,
  minValue,
  maxDecimalPoints,
} from '@validators'

const EVENTS = {
  transferred: 'transferred',
}

export default {
  name: 'buy-back-form',
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
     * @property config.decimalPoints - default max allowed points after dot
     * @property [config.defaultAssetCode] - prefills the asset-selector with
     *           this asset code
     */
    config: {
      type: Object,
      required: true,
    },
  },
  validations () {
    return {
      form: {
        amount: {
          required,
          maxDecimalPoints: maxDecimalPoints(this.config.decimalPoints),
          maxValue: maxValue(this.allowedToBuy(this.form.asset.code)),
          minValue: minValue(0),
        },
        totalAmount: {
          minValue: minValue(this.config.minAmount),
        },
      },
    }
  },
  data: _ => ({
    isInitialized: false,
    form: {
      asset: {},
      quoteAsset: {},
      amount: '',
      totalAmount: '',
    },
    selectedSale: {},
    isBuyBackProcessing: false,
  }),
  computed: {
    ...mapGetters('buy-back-form', {
      balances: types.balances,
      assets: types.assets,
      assetsInBalance: types.assetsInBalance,
      allowedToBuy: types.allowedToBuy,
    }),
  },
  watch: {
    async 'form.asset' (asset) {
      this.disableForm()
      this.selectedSale = await this.loadSaleByBaseAsset(asset.code)
      this.form.quoteAsset = this.selectedSale.quoteAssets[0]
      this.enableForm()
    },
    selectedSale (sale) {
      this.form.amount = this.allowedToBuy(this.form.asset.code)
      this.form.totalAmount = this.calculatedBuyBackPrice()
    },
    'form.amount' (value) {
      this.form.totalAmount = this.calculatedBuyBackPrice(value)
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
    ...mapMutations('buy-back-form', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('buy-back-form', {
      loadBalances: types.LOAD_BALANCES,
      loadAssets: types.LOAD_ASSETS,
      loadSaleByBaseAsset: types.LOAD_SALE_BY_BASE_ASSET,
    }),
    async submit () {
      this.disableForm()
      this.isBuyBackProcessing = true
      // TODO: move it to the store action
      await this.createOffer(this.getCreateOfferOpts())
      this.isBuyBackProcessing = false
      this.enableForm()
      this.hideConfirmation()
      this.$emit(EVENTS.transferred)
    },
    getCreateOfferOpts () {
      return {
        pair: {
          base: this.form.asset.code,
          quote: this.form.quoteAsset.id,
        },
        baseAmount: this.form.amount,
        quoteAmount: this.form.totalAmount,
        price: this.form.asset.details.redeemPrice,
        isBuy: true,
      }
    },
    setDefaultAsset () {
      if (this.config.defaultAssetCode) {
        this.setDefaultAssetCodeAsSelected()
      } else {
        this.form.asset = this.assetsInBalance[0]
      }
    },
    calculatedBuyBackPrice (value) {
      return MathUtil.multiply(
        this.form.asset.details.redeemPrice || 0,
        value || this.allowedToBuy(this.form.asset.code)
      )
    },
    setDefaultAssetCodeAsSelected () {
      if (!this.config.defaultAssetCode) {
        throw new Error('The "defaultAssetCode" property is not defined in the module config!')
      }

      this.form.asset = this.assetsInBalance
        .find(item => item.code === this.config.defaultAssetCode)
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
