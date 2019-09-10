<template>
  <form
    novalidate
    class="app__form add-quote-assets-step-form"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.amountToSell"
          type="number"
          :step="inputStep"
          :max="MAX_AMOUNT"
          @blur="touchField('form.amountToSell')"
          name="create-asset-form-amount-to-sell"
          :label="'create-asset-form.amount-to-sell-lbl' | globalize({
            quoteAsset: businessStatsQuoteAsset
          })"
          :error-message="getFieldErrorMessage('form.amountToSell', {
            from: {
              value: MIN_AMOUNT,
            },
            to: {
              value: MAX_AMOUNT,
            },
          })"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <atomic-swap-quote-assets-form
      :is-disabled.sync="isDisabled"
      @submit="submit"
    />
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import AtomicSwapQuoteAssetsForm from '@/vue/forms/AtomicSwapQuoteAssetsForm'

import {
  amountRange,
  required,
} from '@validators'

import config from '@/config'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'add-quote-assets-step-form',
  components: {
    AtomicSwapQuoteAssetsForm,
  },
  mixins: [FormMixin],
  props: {
    isDisabled: { type: Boolean, default: false },
  },

  data: _ => ({
    form: {
      amountToSell: '',
      quoteAssets: [],
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
  }),

  validations () {
    return {
      form: {
        amountToSell: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.businessStatsQuoteAsset,
      vuexTypes.accountId,
    ]),
    inputStep () {
      return inputStepByDigitsCount(config.DECIMAL_POINTS)
    },
  },

  methods: {
    submit (form) {
      if (this.isFormValid()) {
        this.form.quoteAssets = form.quoteAssets
        this.$emit(EVENTS.submit, this.form)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';

.information-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.information-step-form__kyc-required-row {
  margin-top: 2.1rem;
}
</style>
