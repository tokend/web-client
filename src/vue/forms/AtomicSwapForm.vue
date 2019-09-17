<template>
  <div class="atomic-swap-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="submit()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            :label="'atomic-swap-form.asset-in-which-buying' | globalize"
            name="atomic-swap-quote-asset"
            :value="form.quoteAsset"
            @input="setQuoteAsset"
            :disabled="isDisabled"
            class="app__select"
          >
            <option
              v-for="asset in quoteAssets"
              :key="asset.code"
              :value="asset.code"
            >
              {{ asset.name }}
            </option>
          </select-field>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <amount-input-field
            v-model="form.amount"
            name="atomic-swap-amount"
            :asset="assetByCode(atomicSwap.baseAsset)"
            :max="atomicSwap.amount"
            :label="'atomic-swap-form.amount' | globalize({
              asset: atomicSwap.baseAssetName
            })"
            :disabled="isDisabled"
          />
          <p class="app__form-field-description">
            {{ 'atomic-swap-form.available' | globalize({
              amount: atomicSwap.amount,
              asset: '',
            }) }}
          </p>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <!-- eslint-disable max-len -->
          <readonly-field
            class="atomic-swap-form__price"
            :label="'atomic-swap-form.price' | globalize"
            :value="`${formatMoney(atomicSwap.price)} ${statsQuoteAsset.code}`"
          />
          <!-- eslint-enable max-len -->
          <readonly-field
            :label="'atomic-swap-form.total-price' | globalize"
            :value="`${formatMoney(totalPrice)} ${statsQuoteAsset.code}`"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          :disabled="isDisabled"
          class="app__button-raised atomic-swap-form__btn"
        >
          <template>
            {{ 'atomic-swap-form.buy' | globalize }}
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

import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { formatMoney } from '@/vue/filters/formatMoney'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { MathUtil } from '@/js/utils'

import {
  amountRange,
  required,
} from '@validators'

const EVENTS = {
  selectAsset: 'select-asset',
  submitted: 'submitted',
}

export default {
  name: 'atomic-swap-form',
  components: {
    ReadonlyField,
  },
  mixins: [FormMixin],
  props: {
    atomicSwap: { type: AtomicSwapRecord, required: true },
    isDisabled: { type: Boolean, default: false },
  },
  data () {
    return {
      config,
      form: {
        amount: '',
        quoteAsset: '',
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
            this.atomicSwap.amount
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
    quoteAssets () {
      return this.atomicSwap.quoteAssets.map(item => this.assetByCode(item.id))
    },
    totalPrice () {
      return MathUtil.multiply(this.atomicSwap.price, this.form.amount || 0)
    },
  },
  watch: {
    'form.quoteAsset' (value) {
      this.$emit(EVENTS.selectAsset, value)
    },
  },
  created () {
    this.form.quoteAsset = this.atomicSwap.quoteAssets[0].id
  },
  methods: {
    formatMoney,

    setQuoteAsset (code) {
      this.form.quoteAsset = code
    },

    submit () {
      this.getPaymentMethodId()
      this.$emit(EVENTS.submitted, this.form)
    },

    getPaymentMethodId () {
      const selectedQuoteAsset = this.atomicSwap.quoteAssets.find(item => {
        return item.id === this.form.quoteAsset
      })
      this.form.paymentMethodId = selectedQuoteAsset.paymentMethodId
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';

  .atomic-swap-form__price {
    margin-bottom: 0.5rem;
  }

  .atomic-swap-form__btn {
    max-width: 14rem;
    width: 100%;
  }
</style>
