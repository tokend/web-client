<template>
  <div class="coinpaymants-form">
    <template v-if="!isFailed">
      <template v-if="!depositDetails">
        <form
          @submit.prevent="isFormValid() && showConfirmation()"
          id="coinpayments-form"
          novalidate
        >
          <div class="app__form-row">
            <input-field
              white-autofill
              class="app__form-field"
              v-model.trim="form.amount"
              name="coinpayments-amount"
              @blur="touchField('form.amount')"
              :error-message="getFieldErrorMessage(
                'form.amount',
                { from: MIN_AMOUNT, to: MAX_AMOUNT }
              )"
              :label="'coinpayments-form.amount' | globalize()"
              :monospaced="true"
              :disabled="formMixin.isDisabled"
            />
          </div>
          <div class="app__form-actions">
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              type="submit"
              class="app__button-raised"
              :disabled="formMixin.isDisabled"
              form="coinpayments-form"
            >
              {{ 'coinpayments-form.request-cp' | globalize }}
            </button>
            <form-confirmation
              v-if="formMixin.isConfirmationShown"
              @ok="hideConfirmation() || submit()"
              @cancel="hideConfirmation()"
            />
          </div>
        </form>
      </template>
      <address-viewer
        v-else
        :asset="asset"
        :deposit-details="depositDetails"
      />
    </template>
    <template v-else>
      <p class="">
        {{ 'coinpayments-form.no-address' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import AddressViewer from './coinpayments-address-viewer'

import config from '@/config'

import FormMixin from '@/vue/mixins/form.mixin'

import { mapActions } from 'vuex'
import { types } from '../store/types'
import { ErrorHandler } from '@/js/helpers/error-handler'
import {
  required,
  amountRange,
} from '@validators'
export default {
  name: 'coinpayments-form',
  components: {
    AddressViewer,
  },
  mixins: [FormMixin],
  props: {
    asset: { type: Object, required: true },
    balanceDetails: { type: Object, required: true },
  },
  data () {
    return {
      MIN_AMOUNT: config.MIN_AMOUNT,
      MAX_AMOUNT: config.MAX_AMOUNT,
      form: {
        amount: '',
      },
      isFailed: false,
      depositDetails: null,
    }
  },
  validations () {
    return {
      form: {
        amount: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
        },
      },
    }
  },
  methods: {
    ...mapActions('coinpayments', {
      loadDeposit: types.LOAD_DEPOSIT,
    }),
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        this.depositDetails = await this.loadDeposit(
          {
            amount: this.form.amount,
            balance: this.balanceDetails.id,
          }
        )
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isFailed = true
      }
      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/vue/forms/_app-form';
</style>
