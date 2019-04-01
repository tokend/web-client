<template>
  <form @submit.prevent="isFormValid() && showConfirmation()">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          :label="
            'offer-creation-form.price-per-asset' | globalize({
              asset: assetPair.base
            })
          "
          name="trade-offer-price"
          :white-autofill="true"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage(
            'form.price', {
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
              available: quoteAssetBalance
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
          :label="'offer-creation-form.amount' | globalize({
            asset: assetPair.base
          })"
          name="trade-offer-amount"
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
          class="app__form-submit-btn"
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

import FormConfirmation from '@/vue/common/FormConfirmation'

import { MathUtil } from '@/js/utils/math.util'

import config from '@/config'

import {
  required,
  amountRange,
  minValue,
  noMoreThanAvailableOnBalance,
  decimal,
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
    assetPair: { type: Object, require: true, default: () => {} },
    isBuy: { type: Boolean, require: false, default: true },
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
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
        amount: {
          required,
          decimal,
          minValue: minValue(config.MIN_AMOUNT),
          noMoreThanAvailableOnBalance: this.isBuy
            ? true
            : noMoreThanAvailableOnBalance(this.baseAssetBalance),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
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
