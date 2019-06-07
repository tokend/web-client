<template>
  <form
    v-if="form.asset && isInitialized"
    @submit.prevent="isFormValid() && showConfirmation()"
    class="withdrawal-fiat-card-module"
  >
    <div class="app__form-row withdrawal-fiat-card__form-row">
      <div class="app__form-field">
        <select-field
          name="withdrawal-fiat-card-asset"
          :value="form.asset.code"
          @input="setAssetByCode"
          :disabled="formMixin.isDisabled"
          @blur="touchField('form.asset')"
          :error-message="getFieldErrorMessage('form.asset')"
          :label="'withdrawal-fiat-card-module.asset' | globalize"
        >
          <option
            v-for="asset in withdrawableFiatAssets"
            :key="asset.code"
            :value="asset.code"
          >
            {{ asset.nameAndCode }}
          </option>
        </select-field>
        <div class="withdrawal-fiat-card__form-field-description">
          <p>
            {{
              'withdrawal-fiat-card-module.balance' | globalize({
                amount: form.asset.balance.value,
                asset: form.asset.code
              })
            }}
          </p>
        </div>
      </div>
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.amount"
        type="number"
        :min="0"
        :max="form.asset.balance.value"
        :step="config.minAmount"
        name="withdrawal-fiat-card-amount"
        @blur="touchField('form.amount')"
        :error-message="getFieldErrorMessage('form.amount', {
          available: form.asset.balance.value,
          maxDecimalDigitsCount: config.decimalPoints
        })"
        :label="'withdrawal-fiat-card-module.amount' | globalize({
          asset: form.asset.code
        })"
        :disabled="formMixin.isDisabled"
      />
    </div>
    <div class="app__form-row withdrawal-fiat-card__form-row">
      <table class="withdrawal-fiat-card__fee-table">
        <tbody
          class="withdrawal-fiat-card__fee-tbody"
          :class="{ 'withdrawal-fiat-card__data--loading': isFeesLoadPending }"
        >
          <tr>
            <td>
              {{ 'withdrawal-fiat-card-module.network-fee-hint' | globalize }}
            </td>
            <td>
              {{
                'withdrawal-fiat-card-module.network-fee-unknown' | globalize
              }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'withdrawal-fiat-card-module.fixed-fee' | globalize }}
            </td>
            <td>
              <template v-if="isFeesLoadPending">
                {{ 'withdrawal-fiat-card-module.fee-loading-msg' | globalize }}
              </template>
              <template v-else>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: fees.fixedFee, currency: form.asset.code } | formatMoney }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'withdrawal-fiat-card-module.percent-fee' | globalize }}
            </td>
            <td>
              <template v-if="isFeesLoadPending">
                {{ 'withdrawal-fiat-card-module.fee-loading-msg' | globalize }}
              </template>
              <template v-else>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: fees.percentFee, currency: form.asset.code } | formatMoney }}
              </template>
            </td>
          </tr>
          <tr class="withdrawal-fiat-card__total-fee-row">
            <td>
              {{
                'withdrawal-fiat-card-module.total-amount-account' | globalize
              }}
            </td>
            <td>
              <template v-if="isFeesLoadPending">
                {{ 'withdrawal-fiat-card-module.fee-loading-msg' | globalize }}
              </template>
              <template v-else>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: (+fees.percentFee + +fees.fixedFee), currency: form.asset.code } | formatMoney }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.cardNumber"
        name="withdrawal-fiat-card-number"
        :label="'withdrawal-fiat-card-module.card-number' | globalize"
        :disabled="formMixin.isDisabled"
        @blur="touchField('form.cardNumber')"
        :error-message="getFieldErrorMessage('form.cardNumber')"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.cardHolder"
        name="withdrawal-fiat-card-holder"
        :label="'withdrawal-fiat-card-module.card-holder' | globalize"
        :disabled="formMixin.isDisabled"
        @blur="touchField('form.cardHolder')"
        :error-message="getFieldErrorMessage('form.cardHolder')"
      />
    </div>
    <div class="app__form-actions">
      <button
        v-ripple
        v-if="!formMixin.isConfirmationShown"
        type="submit"
        class="app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{ 'withdrawal-fiat-card-module.withdrawal' | globalize }}
      </button>
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        :is-pending="isWithdrawalPending"
        @ok="submit"
        @cancel="hideConfirmation()"
      />
    </div>
  </form>
  <no-data-message
    :title="'withdrawal-fiat-bank-module.no-assets' | globalize"
    :message="'withdrawal-fiat-bank-module.here-will-assets-list' | globalize"
    v-else-if="!form.asset && isInitialized"
  />
  <loader v-else message-id="withdrawal-fiat-card-module.loading-msg" />
</template>

<script>
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { mapActions, mapGetters } from 'vuex'
import FormMixin from '@/vue/mixins/form.mixin'
import debounce from 'lodash/debounce'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { types } from './store/types'
import { Bus } from '@/js/helpers/event-bus'
import { base } from '@tokend/js-sdk'
import { api } from '@/api'
import {
  required,
  lessThenMax,
  maxDecimalDigitsCount,
  cardNumber,
} from '@validators'

const EMPTY_FEE = '0.000000'

const EVENTS = {
  withdrawn: 'withdrawn',
}

export default {
  name: 'withdrawal-fiat-card-module',
  components: {
    Loader,
    NoDataMessage,
  },
  mixins: [FormMixin],
  props: {
    /**
     * @property config - the config for component to use
     * @property config.decimalPoints - count of allowed decimal points
     * @property config.minAmount - minimal allowed amount
     */
    config: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    isInitialized: false,
    isFeesLoadPending: false,
    isFeesLoadFailed: false,
    isWithdrawalPending: false,
    feesDebouncedRequest: null,
    fees: {
      fixedFee: EMPTY_FEE,
      percentFee: EMPTY_FEE,
    },
    form: {
      asset: null,
      amount: null,
      cardNumber: null,
      cardHolder: null,
    },
  }),
  computed: {
    ...mapGetters('withdrawal-fiat-card', {
      withdrawableFiatAssets: types.withdrawableFiatAssets,
      balances: types.balances,
      calculatedFees: types.fees,
    }),
  },
  watch: {
    'form.amount' (value) {
      if (value === '' || value < +this.config.minAmount) {
        this.fees.fixedFee = EMPTY_FEE
        this.fees.percentFee = EMPTY_FEE
        return
      }
      this.tryGetFees()
    },
    'form.asset.code' () {
      this.tryGetFees()
    },
  },
  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          noMoreThanAvailableOnBalance: lessThenMax(
            this.form.asset.balance.value
          ),
          maxDecimalDigitsCount: maxDecimalDigitsCount(
            this.config.decimalPoints
          ),
        },
        cardNumber: {
          required,
          cardNumber,
        },
        cardHolder: {
          required,
        },
      },
    }
  },
  async created () {
    await this.loadBalances()
    await this.loadAssets()

    this.form.asset = this.withdrawableFiatAssets[0]

    this.isInitialized = true
  },
  methods: {
    ...mapActions('withdrawal-fiat-card', {
      loadBalances: types.LOAD_BALANCES,
      loadAssets: types.LOAD_ASSETS,
      loadFees: types.LOAD_FEES,
    }),
    setAssetByCode (code) {
      this.form.asset = this.withdrawableFiatAssets
        .find(item => item.code === code)
    },
    async getFees () {
      try {
        await this.loadFees({
          assetCode: this.form.asset.code,
          amount: this.form.amount,
        })
        this.fees.fixedFee = this.calculatedFees.fixed
        this.fees.percentFee = this.calculatedFees.calculatedPercent
        this.isFeesLoadFailed = false
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isFeesLoadPending = false
    },
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      this.isWithdrawalPending = true
      try {
        if (this.isFeesLoadFailed) {
          Bus.error('withdrawal-fiat-card-module.failed-load-fees')
          return false
        }
        // eslint-disable-next-line max-len
        const operation = base.CreateWithdrawRequestBuilder.createWithdrawWithAutoConversion({
          ...this.composeOptions(),
        })
        await api.postOperations(operation)
        Bus.success('withdrawal-fiat-card-module.withdraw-success')
        this.$emit(EVENTS.withdrawn)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isWithdrawalPending = false
      this.hideConfirmation()
      this.enableForm()
    },
    tryGetFees () {
      this.isFeesLoadPending = true
      if (!this.feesDebouncedRequest) {
        this.feesDebouncedRequest = debounce(() => this.getFees(), 300)
      }
      return this.feesDebouncedRequest()
    },
    composeOptions () {
      return {
        balance: this.form.asset.balance.id,
        amount: this.form.amount,
        creatorDetails: {
          cardNumber: this.form.cardNumber,
          cardHolder: this.form.cardHolder,
        },
        fee: {
          fixed: this.fees.fixedFee,
          percent: this.fees.percentFee,
        },
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/vue/forms/_app-form';

.withdrawal-fiat-card__fee-table {
  width: 100%;
  font-size: 1.2rem;
}

.withdrawal-fiat-card__fee-table tr {
  height: 2rem;
}

.withdrawal-fiat-card__fee-table td:last-child {
  text-align: right;
}

.withdrawal-fiat-card__fee-tbody {
  color: $col-text-secondary;
}

.withdrawal-fiat-card__total-fee-row {
  color: $col-text;
  font-weight: 600;
}
</style>
