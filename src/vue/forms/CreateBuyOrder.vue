<template>
  <div class="buy-order__card">
    <form @submit.prevent="submit">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model.trim="form.price"
            :label="`Price per ${assets.base}`"
            name="order-buy-price"
            :white-autofill="true"
            type="number"
            :step="config.MINIMAL_NUMBER_INPUT_STEP"
            :error-message="getFieldErrorMessage('form.price')"
            @blur="touchField('form.price')"
          />
          <!-- TODO: -->
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model.trim="form.amount"
            :label="`Amount ${assets.base}`"
            name="order-buy-amount"
            :white-autofill="true"
            type="number"
            :step="config.MINIMAL_NUMBER_INPUT_STEP"
            :error-message="getFieldErrorMessage('form.amount')"
            @blur="touchField('form.amount')"
          />
          <!-- TODO: -->
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <!-- TODO: -->
          <!-- :value="i18n.c(form.quoteAmount)" -->
          <input-field
            :label="`Total ${assets.quote}`"
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
          Buy
          <!-- TODO: -->
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import OrderMakerMixin from '@/vue/mixins/order-maker.mixin'

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
    allowToValidPrice: false,
    allowToValidAmount: false,
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
      this.allowToValidPrice = true
    },
    'form.amount' (value) {
      this.getQuoteAmount()
      this.allowToValidAmount = true
    },
  },
  methods: {
    getQuoteAmount () {
      this.form.quoteAmount =
        MathUtil.multiply(this.form.price, this.form.amount)
    },
    async submit () {
      this.allowToValidPrice = true
      this.allowToValidAmount = true
      if (!this.isFormValid()) return
      // if (!await confirmAction()) return
      this.disableForm()
      await this.createOrder({
        pair: {
          base: this.assets.base,
          quote: this.assets.quote,
        },
        baseAmount: this.form.amount,
        quoteAmount: this.form.quoteAmount,
        price: this.form.price,
        isBuy: true,
      })
      this.enableForm()
    },
    resetForm () {
      this.form.price = ''
      this.form.amount = ''
      setTimeout(() => this.changeAllow(), 0)
    },
    changeAllow () {
      this.allowToValidPrice = false
      this.allowToValidAmount = false
    },
  },
}
</script>

<style lang="scss" scoped>
  @import './app-form';
</style>
