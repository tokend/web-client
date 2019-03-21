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
              id="coinpayments-amount"
              @blur="touchField('form.amount')"
              :error-message="getFieldErrorMessage(
                'form.amount',
                { from: MIN_AMOUNT, to: MAX_AMOUNT }
              )"
              :label="'coinpayments-deposit.amount-lbl' | globalize"
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
              {{ 'coinpayments-deposit.request-address-lbl' | globalize }}
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
        :asset-code="asset.code"
        :amount="depositDetails.amount"
        :address="depositDetails.address"
        :end-time="depositDetails.endTime"
        :deposit-details="depositDetails"
      />
    </template>
    <template v-else>
      <p>
        {{ 'coinpayments-deposit.no-address-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import AddressViewer from './coinpayments-address-viewer'

import config from '@/config'

import FormMixin from '@/vue/mixins/form.mixin'

import { api } from '../_api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import {
  required,
  amountRange,
} from '@validators'

const TRANSACTION_TIME_MARGIN = 600000 // millisecond

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
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        this.depositDetails = await this.loadDeposit(
          {
            amount: this.form.amount,
            receiver: this.balanceDetails.id,
          }
        )
        this.depositDetails.endTime = +new Date() +
          (this.depositDetails.timeout * 1000) - TRANSACTION_TIME_MARGIN
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isFailed = true
      }
      this.enableForm()
    },
    async loadDeposit (params) {
      const endpoint = `/integrations/coinpayments/deposit`
      const response = await api().postWithSignature(endpoint, {
        data: {
          type: 'coinpayments_deposit',
          attributes: params,
        },
      })
      return response.data
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/vue/forms/_app-form';
</style>
