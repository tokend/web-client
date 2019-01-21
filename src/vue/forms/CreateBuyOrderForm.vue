<template>
  <div class="buy-order__card">
    <form @submit.prevent="submit">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model.trim="form.price"
            :label="
              'offer-creation-form.price-per-asset' | globalize({
                asset: assets.base
              })
            "
            name="order-buy-price"
            :white-autofill="true"
            type="number"
            :step="config.MINIMAL_NUMBER_INPUT_STEP"
            :error-message="getFieldErrorMessage('form.price')"
            @blur="touchField('form.price')"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model.trim="form.amount"
            :label="'offer-creation-form.amount' | globalize({
              asset: assets.base
            })"
            name="order-buy-amount"
            :white-autofill="true"
            type="number"
            :step="config.MINIMAL_NUMBER_INPUT_STEP"
            :error-message="getFieldErrorMessage('form.amount')"
            @blur="touchField('form.amount')"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <!-- TODO: -->
          <!-- :value="i18n.c(form.quoteAmount)" -->
          <input-field
            :label="'offer-creation-form.total' | globalize({
              asset: formatMoney(form.quoteAmount)
            })"
            :value="form.quoteAmount"
            name="order-buy-total"
            :readonly="true"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="app__form-submit-btn"
          :disabled="!+form.quoteAmount || formMixin.isDisabled">
          {{ 'offer-creation-form.submit-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import OrderMakerMixin from '@/vue/mixins/order-maker.mixin'
import { formatMoney } from '@/vue/filters/formatMoney'

// import { confirmAction } from 'L@/js/modals/confirmation_message'
import { MathUtil } from '@/js/utils/math.util'
import config from '@/config'
import { required } from '@validators'

export default {
  name: 'trade-orders-buy',
  mixins: [FormMixin, OrderMakerMixin],
  props: {
    assets: { type: Object, require: true, default: () => {} },
  },
  data: () => ({
    form: {
      price: '',
      amount: '',
      quoteAmount: '',
    },
    config,
  }),
  validations: {
    form: {
      price: { required },
      amount: { required },
    },
  },
  computed: {
    lessThanMinimumAmount () {
      return Number(this.form.amount) < config.MINIMAL_NUMBER_INPUT_STEP
    },
  },
  watch: {
    'form.price' (value) {
      this.getQuoteAmount()
    },
    'form.amount' (value) {
      this.getQuoteAmount()
    },
  },
  methods: {
    formatMoney,
    getQuoteAmount () {
      this.form.quoteAmount =
        MathUtil.multiply(this.form.price, this.form.amount)
    },
    async submit () {
      if (!this.isFormValid()) return
      // if (!await confirmAction()) return
      this.disableForm()
      console.log('this.getCreateOfferOpts()', this.getCreateOfferOpts())
      await this.createOrder(this.getCreateOfferOpts())
      this.enableForm()
    },
    getCreateOfferOpts () {
      return {
        pair: {
          base: this.assets.base,
          quote: this.assets.quote,
        },
        baseAmount: this.form.amount,
        quoteAmount: this.form.quoteAmount,
        price: this.form.price,
        isBuy: true,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import './app-form';
</style>
