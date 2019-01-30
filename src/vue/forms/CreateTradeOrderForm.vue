<template>
  <form>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          :label="
            'offer-creation-form.price-per-asset' | globalize({
              asset: assetPair.base
            })
          "
          name="trade-order-price"
          :white-autofill="true"
          type="number"
          :disabled="formMixin.isDisabled"
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
            asset: assetPair.base
          })"
          name="trade-order-amount"
          :white-autofill="true"
          type="number"
          :max="baseAssetBalance"
          :disabled="formMixin.isDisabled"
          :step="config.MINIMAL_NUMBER_INPUT_STEP"
          :error-message="getFieldErrorMessage(
            'form.amount',
            { available: formatNumber(baseAssetBalance) }
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
          :value="+formQuoteAmount ? formQuoteAmount : ''"
          name="trade-order-total"
          :readonly="true"
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
          :disabled="!+formQuoteAmount || formMixin.isDisabled">
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
import OrderMakerMixin from '@/vue/mixins/order-maker.mixin'
import FormConfirmation from '@/vue/common/FormConfirmation'
import { MathUtil } from '@/js/utils/math.util'
import config from '@/config'
import { required, noMoreThanAvailableOnBalance } from '@validators'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { formatNumber } from '@/vue/filters/formatNumber'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'create-trade-order-form',
  components: { FormConfirmation },
  mixins: [FormMixin, OrderMakerMixin],
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
    showConfirmation: false,
  }),
  validations () {
    return {
      form: {
        price: { required },
        amount: {
          required,
          // eslint-disable-next-line
          noMoreThanAvailableOnBalance: noMoreThanAvailableOnBalance(this.baseAssetBalance),
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
    ]),
    baseAssetBalance () {
      return this.accountBalances
        .find(i => i.asset === this.assetPair.base).balance || '0'
  },
    formQuoteAmount () {
      return MathUtil.multiply(this.form.price, this.form.amount)
    },
    },
  methods: {
    formatNumber,
    async submit () {
      this.disableForm()

      await this.createOrder(this.getCreateOfferOpts())

      this.enableForm()
      this.$emit(EVENTS.closeDrawer)
    },
    tryToSubmit () {
      if (!this.isFormValid()) return
      this.formMixin.showConfirmation = true
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
