<template>
  <div class="invest-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <!--
            :key is a hack to ensure that the component will be updated
            after property change
          -->
          <select-field
            :key="form.asset"
            v-model="form.asset"
            :values="assetListValues"
            :label="'invest-form.asset-lbl' | globalize"
            id="invest-asset"
            @blur="touchField('form.asset')"
            :disabled="formMixin.isDisabled"
          />

          <p class="app__form-field-description">
            <!-- eslint-disable-next-line max-len -->
            {{ 'invest-form.available-amount-hint' | globalize({ value: availableAmount }) }}
          </p>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <div class="invest-form__amount-wrapper">
            <input-field
              white-autofill
              type="number"
              v-model="form.amount"
              @blur="touchField('form.amount')"
              id="invest-amount"
              :label="'invest-form.amount-lbl' | globalize"
              :error-message="getFieldErrorMessage(
                'form.amount',
                { from: MIN_AMOUNT, to: availableAmount.value }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>

          <p class="app__form-field-description">
            <!-- eslint-disable-next-line max-len -->
            {{ 'invest-form.converted-amount-hint' | globalize({ value: convertedAmount }) }}
          </p>
        </div>
      </div>

      <div class="app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          @ok="hideConfirmation() || submit()"
          @cancel="hideConfirmation"
        />

        <button
          v-else
          v-ripple
          type="submit"
          class="invest-form__submit-btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'invest-form.invest-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import config from '@/config'

// import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Sdk } from '@/sdk'
// import { base } from '@tokend/js-sdk'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { required, amountRange } from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'invest-form',
  mixins: [FormMixin],
  props: {
    fund: { type: SaleRecord, required: true },
  },
  data: _ => ({
    form: {
      asset: '',
      amount: '',
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
    conversionRate: 0,
  }),
  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.availableAmount.value),
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
    }),

    assetListValues () {
      return this.fund.quoteAssets.map(quote => quote.asset)
    },

    availableAmount () {
      const assetBalance = this.balances
        .find(balance => balance.asset === this.form.asset)

      return {
        value: assetBalance.balance,
        currency: this.form.asset,
      }
    },

    convertedAmount () {
      return {
        value: this.form.amount * this.conversionRate,
        currency: this.fund.defaultQuoteAsset,
      }
    },
  },

  watch: {
    'form.asset': async function (value) {
      if (value === this.fund.defaultQuoteAsset) {
        this.conversionRate = 1
      } else {
        try {
          const { data } = await Sdk.horizon.assetPairs.convert({
            source_asset: value,
            dest_asset: this.fund.defaultQuoteAsset,
            amount: 1,
          })
          this.conversionRate = data.amount
        } catch (e) {
          ErrorHandler.processWithoutFeedback(e)
        }
      }
    },
  },

  async created () {
    this.form.asset = this.assetListValues[0]
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.invest-form__submit-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.invest-form__amount-wrapper {
  display: flex;
}

.invest-form__issuance-asset-code {
  margin-left: 1rem;
  padding-top: 1.8rem;
  font-size: 1.8rem;
}
</style>
