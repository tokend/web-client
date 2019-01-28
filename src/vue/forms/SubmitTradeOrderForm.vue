<template>
  <form>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="order.price"
          :label="
            'submit-trade-orders-form.price-label' | globalize({
              asset: assets.quote
            })
          "
          name="submit-trade-orders-order-price"
          :white-autofill="true"
          readonly
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="order.baseAmount"
          :label="
            'submit-trade-orders-form.want-label' | globalize({
              asset: assets.base
            })
          "
          name="submit-trade-orders-order-base-amount"
          :white-autofill="true"
          readonly
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="order.quoteAmount"
          :label="
            'submit-trade-orders-form.order-label' | globalize({
              asset: assets.quote
            })
          "
          name="submit-trade-orders-order-quote-amount"
          :white-autofill="true"
          readonly
        />
      </div>
    </div>

    <template v-if="formMixin.showConfirmation">
      <form-confirmation
        v-if="formMixin.showConfirmation"
        @cancel="cancelConfirmation"
        @ok="submit"
        :is-pending="formMixin.isDisabled"
        class="app__form-confirmation"
      />
    </template>
    <template v-else>
      <div class="app__form-actions">
        <button
          v-ripple
          type="button"
          @click="tryToSubmit"
          class="app__form-submit-btn"
          :disabled="formMixin.isDisabled">
          <template v-if="isBuy">
            {{ 'submit-trade-orders-form.submit-sell-btn' | globalize }}
          </template>
          <template v-else>
            {{ 'submit-trade-orders-form.submit-buy-btn' | globalize }}
          </template>
        </button>
      </div>
    </template>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import OrderMakerMixin from '@/vue/mixins/order-maker.mixin'
import FormConfirmation from '@/vue/common/FormConfirmation'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'submit-trade-order-form',
  components: { FormConfirmation },
  mixins: [FormMixin, OrderMakerMixin],
  props: {
    assets: { type: Object, require: true, default: () => ({}) },
    isBuy: { type: Boolean, require: false, default: true },
    order: { type: Object, require: true, default: () => ({}) },
  },
  methods: {
    tryToSubmit () {
      this.formMixin.showConfirmation = true
    },
    async submit () {
      this.disableForm()
      try {
        await this.createOrder(this.getCreateOfferOpts())
      } catch (error) {
        // TODO: handle operation type
        ErrorHandler.process(error)
      }
      this.enableForm()
      this.$emit(EVENTS.closeDrawer)
    },
    getCreateOfferOpts () {
      return {
        pair: {
          base: this.order.baseAssetCode,
          quote: this.order.quoteAssetCode,
        },
        baseAmount: this.order.baseAmount,
        quoteAmount: this.order.quoteAmount,
        price: this.order.price,
        isBuy: !this.order.isBuy,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import './app-form';
</style>
