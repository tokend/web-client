<template>
  <div class="buy-atomic-swap-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="submit()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            :label="'buy-atomic-swap-form.asset-in-which-buying' | globalize"
            name="buy-atomic-swap-quote-asset"
            :value="form.quoteAssetCode"
            @input="setQuoteAssetCode"
            :disabled="isDisabled"
            class="app__select"
          >
            <option
              v-for="quoteAsset in atomicSwapAsk.quoteAssets"
              :key="quoteAsset.asset.code"
              :value="quoteAsset.asset.code"
            >
              {{ quoteAsset.asset.name }}
            </option>
          </select-field>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <amount-input-field
            v-model="form.amount"
            name="buy-atomic-swap-amount"
            :asset="assetByCode(atomicSwapAsk.baseAssetCode)"
            :max="atomicSwapAsk.amount"
            :label="'buy-atomic-swap-form.amount' | globalize({
              asset: atomicSwapAsk.baseAssetName
            })"
            :disabled="isDisabled"
          />
          <p class="app__form-field-description">
            {{ 'buy-atomic-swap-form.available' | globalize({
              amount: atomicSwapAsk.amount,
              asset: '',
            }) }}
          </p>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <!-- eslint-disable max-len -->
          <readonly-field
            class="buy-atomic-swap-form__price"
            :label="'buy-atomic-swap-form.price' | globalize"
            :value="`${formatMoney(atomicSwapAsk.price)} ${statsQuoteAsset.code}`"
          />
          <!-- eslint-enable max-len -->

          <readonly-field
            :label="'buy-atomic-swap-form.total-price' | globalize"
            :value="`${formatMoney(totalPrice)} ${statsQuoteAsset.code}`"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          :disabled="isDisabled"
          class="app__button-raised buy-atomic-swap-form__btn"
        >
          <template>
            {{ 'buy-atomic-swap-form.buy' | globalize }}
          </template>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import ReadonlyField from '@/vue/fields/ReadonlyField'
import config from '@/config'

import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { formatMoney } from '@/vue/filters/formatMoney'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { MathUtil } from '@/js/utils'

import {
  amountRange,
  required,
} from '@validators'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'buy-atomic-swap-form',
  components: {
    ReadonlyField,
  },
  mixins: [FormMixin],
  props: {
    atomicSwapAsk: { type: AtomicSwapAskRecord, required: true },
    isDisabled: { type: Boolean, default: false },
  },
  data () {
    return {
      config,
      form: {
        amount: '',
        quoteAssetCode: '',
        paymentMethodId: '',
      },
    }
  },
  validations () {
    return {
      form: {
        amount: {
          amountRange: amountRange(
            config.MIN_AMOUNT,
            this.atomicSwapAsk.amount
          ),
          required,
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
      vuexTypes.statsQuoteAsset,
    ]),
    totalPrice () {
      return MathUtil.multiply(this.atomicSwapAsk.price, this.form.amount || 0)
    },
  },
  created () {
    this.setQuoteAssetCode(this.atomicSwapAsk.quoteAssets[0].asset.code)
  },
  methods: {
    formatMoney,

    submit () {
      this.$emit(EVENTS.submitted, this.form)
    },

    setQuoteAssetCode (code) {
      this.form.quoteAssetCode = code
      this.form.paymentMethodId = this.atomicSwapAsk
        .getPaymentMethodIdByAssetCode(code)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';

  .buy-atomic-swap-form__price {
    margin-bottom: 0.5rem;
  }

  .buy-atomic-swap-form__btn {
    max-width: 14rem;
    width: 100%;
  }
</style>
