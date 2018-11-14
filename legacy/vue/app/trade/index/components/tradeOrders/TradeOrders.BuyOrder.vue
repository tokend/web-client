<template>
  <div class="buy-order__card app__card">
    <form @submit.prevent="submit">
      <div class="app__card-header">
        <div class="md-title">{{ i18n.trd_create_buy_order() }}</div>
      </div>

      <div class="app__card-content">
        <div class="app__form-row">
          <input-field-unchained
            class="md-layout-item"
            v-model.trim="form.price"
            :label="i18n.trd_price_per({ asset: assets.base })"
            name="order-buy-price"
            v-validate="'required'"
            :white-autofill="true"
            type="number"
            :step="config.MINIMAL_NUMBER_INPUT_STEP"
            :error-message="(allowToValidPrice && (Number(form.price) === 0 ||
              Number(form.price) < 0) ?
            i18n.trd_validate_minimal_price() : '')"
          />
        </div>

        <div class="app__form-row">
          <input-field-unchained
            class="md-layout-item"
            v-model.trim="form.amount"
            :label="i18n.trd_amount_for({ asset: assets.base })"
            name="order-buy-amount"
            v-validate="'required'"
            :white-autofill="true"
            type="number"
            :step="config.MINIMAL_NUMBER_INPUT_STEP"
            :error-message="(allowToValidAmount && lessThanMinimumAmount)
              ? i18n.trd_validate_minimal_amount({
                value: config.MINIMAL_NUMBER_INPUT_STEP
              })
            : ''"
          />
        </div>

        <div class="app__form-row">
          <input-field-unchained
            class="md-layout-item"
            :value="i18n.c(form.quoteAmount)"
            :label="i18n.trd_total_value({ value: assets.quote })"
            name="order-buy-total"
            :readonly="true"
          />
        </div>
      </div>

      <div class="app__card-actions">
        <button
          v-ripple
          type="submit"
          class="app__form-submit-btn"
          :disabled="!+form.quoteAmount || isPending">
          {{ i18n.lbl_buy() }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from 'L@/vue/common/mixins/form.mixin'
import OrderMakerMixin from '../order-maker.mixin'

import { confirmAction } from 'L@/js/modals/confirmation_message'
import { multiply } from 'L@/js/utils/math.util'
import { i18n } from 'L@/js/i18n'
import config from '@/config'

export default {
  name: 'trade-orders-buy',
  mixins: [FormMixin, OrderMakerMixin],
  props: {
    assets: { type: Object, require: true, default: () => {} }
  },
  data () {
    return {
      form: {
        price: '',
        amount: '',
        quoteAmount: ''
      },
      allowToValidPrice: false,
      allowToValidAmount: false,
      i18n,
      config
    }
  },
  computed: {
    lessThanMinimumAmount () {
      return Number(this.form.amount) < config.MINIMAL_NUMBER_INPUT_STEP
    }
  },
  watch: {
    'form.price' (value) {
      this.getQuoteAmount()
      this.allowToValidPrice = true
    },
    'form.amount' (value) {
      this.getQuoteAmount()
      this.allowToValidAmount = true
    }
  },
  created () {
  },
  methods: {
    getQuoteAmount () {
      this.form.quoteAmount = multiply(this.form.price, this.form.amount)
    },
    async submit () {
      this.allowToValidPrice = true
      this.allowToValidAmount = true
      if (!await this.isValid()) return
      if (!await confirmAction()) return
      this.errors.clear()

      this.disable()
      await this.createOrder({
        pair: {
          base: this.assets.base,
          quote: this.assets.quote
        },
        baseAmount: this.form.amount,
        quoteAmount: this.form.quoteAmount,
        price: this.form.price,
        isBuy: true
      })
      this.enable()
      this.resetForm()
    },
    resetForm () {
      this.form.price = ''
      this.form.amount = ''
      setTimeout(() => this.changeAllow(), 0)
    },
    changeAllow () {
      this.allowToValidPrice = false
      this.allowToValidAmount = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .buy-order__card {
    .app__card-actions {
      justify-content: flex-start;
    }
  }
</style>
