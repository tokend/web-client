<template>
  <form @submit.prevent="isFormValid() && showConfirmation()">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          type="number"
          :label="
            'offer-creation-form.price-per-asset' | globalize({
              asset: assetPair.base
            })
          "
          :step="inputStepByDigitsCount"
          name="trade-offer-price"
          :white-autofill="true"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage(
            'form.price', {
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
              available: quoteAssetBalance,
              maxDecimalDigitsCount: trailingDigitsCount,
            }
          )"
          @blur="touchField('form.price')"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.amount"
          type="number"
          :label="'offer-creation-form.amount' | globalize({
            asset: assetPair.base
          })"
          name="trade-offer-amount"
          :step="inputStepByDigitsCount"
          :white-autofill="true"
          :max="baseAssetBalance"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage(
            'form.amount',
            {
              minValue: config.MIN_AMOUNT,
              available: baseAssetBalance,
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
              maxDecimalDigitsCount: trailingDigitsCount,
            }
          )"
          @blur="touchField('form.amount')"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          :label="'offer-creation-form.total' | globalize({
            asset: assetPair.quote
          })"
          v-model="totalValue"
          name="trade-offer-total"
          :error-message="getFieldErrorMessage(
            'totalValue',
            {
              minValue: config.MIN_AMOUNT,
              available: isBuy ? quoteAssetBalance : baseAssetBalance,
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
            }
          )"
          @change="touchField('totalValue')"
          :readonly="true"
        />
      </div>
    </div>

    <template v-if="formMixin.isConfirmationShown">
      <form-confirmation
        @cancel="hideConfirmation"
        @ok="submit"
        :is-pending="isOfferCreating"
        class="app__form-confirmation"
      />
    </template>

    <template v-else>
      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="app__form-submit-btn app__button-raised"
          :disabled="!+formQuoteAmount || formMixin.isDisabled"
        >
          <template v-if="isBuy">
            {{ 'offer-creation-form.submit-buy-btn' | globalize }}
          </template>

          <template v-else>
            {{ 'offer-creation-form.submit-sell-btn' | globalize }}
          </template>
        </button>
      </div>
    </template>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import OfferManagerMixin from '@/vue/mixins/offer-manager.mixin'
import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'
import FormConfirmation from '@/vue/common/FormConfirmation'

import { MathUtil } from '@/js/utils/math.util'

import config from '@/config'

import {
  required,
  amountRange,
  minValue,
  noMoreThanAvailableOnBalance,
  decimal,
  maxDecimalDigitsCount,
} from '@validators'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'create-trade-offer-form',
  components: { FormConfirmation },
  mixins: [FormMixin, OfferManagerMixin],
  props: {
    assetPair: {
      type: Object,
      default: () => ({}),
    },
    isBuy: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    form: {
      price: '',
      amount: '',
    },
    config,
    isOfferCreating: false,
  }),
  validations () {
    return {
      form: {
        price: {
          required,
          decimal,
          amountRange: amountRange(
            config.MIN_AMOUNT,
            config.MAX_AMOUNT
          ),
          maxDecimalDigitsCount:
            maxDecimalDigitsCount(
              this.trailingDigitsCount
            ),
        },
        amount: {
          required,
          decimal,
          minValue: minValue(config.MIN_AMOUNT),
          noMoreThanAvailableOnBalance: this.isBuy
            ? true
            : noMoreThanAvailableOnBalance(this.baseAssetBalance),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
          maxDecimalDigitsCount:
            maxDecimalDigitsCount(
              this.trailingDigitsCount
            ),
        },
      },
      totalValue: {
        noMoreThanAvailableOnBalance: this.isBuy
          ? noMoreThanAvailableOnBalance(this.quoteAssetBalance)
          : true,
        amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
    ]),
    baseAssetBalance () {
      return (this.accountBalances
        .find(i => i.asset === this.assetPair.base) || {}).balance
    },
    quoteAssetBalance () {
      return (this.accountBalances
        .find(i => i.asset === this.assetPair.quote) || {}).balance
    },
    userTransferableAssets () {
      return this.accountBalances.filter(i => i.assetDetails.isTransferable)
    },
    assets () {
      return this.userTransferableAssets.map(asset => asset.assetDetails)
    },
    trailingDigitsCount () {
      return this.assets
        .find(asset => asset.code === this.assetPair.base)
        .trailingDigitsCount || config.MIN_AMOUNT
    },
    inputStepByDigitsCount () {
      return inputStepByDigitsCount(
        this.trailingDigitsCount
      )
    },
    formQuoteAmount () {
      return MathUtil.multiply(this.form.price, this.form.amount)
    },
    totalValue () {
      return +this.formQuoteAmount ? this.formQuoteAmount : ''
    },
  },
  async created () {
    await this.loadBalances()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async submit () {
      this.disableForm()
      this.isOfferCreating = true
      await this.createOffer(this.getCreateOfferOpts())
      this.isOfferCreating = false
      this.enableForm()
      this.hideConfirmation()
      this.$emit(EVENTS.closeDrawer)
    },
    getCreateOfferOpts () {
      return {
        pair: {
          base: this.assetPair.base,
          quote: this.assetPair.quote,
        },
        baseAmount: this.form.amount,
        quoteAmount: this.formQuoteAmount,
        price: this.form.price,
        isBuy: this.isBuy,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
</style>
