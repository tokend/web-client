<template>
  <form
    v-if="form.asset && isInitialized"
    @submit.prevent="isFormValid() && showConfirmation()"
    class="deposit-fiat-card-module"
  >
    <div class="app__form-row deposit-fiat-card__form-row">
      <div class="app__form-field">
        <select-field
          name="deposit-fiat-card-asset"
          v-model="form.asset"
          :disabled="formMixin.isDisabled"
          @blur="touchField('form.asset')"
          :error-message="getFieldErrorMessage('form.asset')"
          :label="'deposit-fiat-card-module.asset' | globalize"
        >
          <option
            v-for="asset in depositableFiatAssets"
            :key="asset.code"
            :value="asset"
          >
            {{ asset.nameAndCode }}
          </option>
        </select-field>
        <div class="deposit-fiat-card__form-field-description">
          <p>
            {{
              'deposit-fiat-card-module.balance' | globalize({
                amount: form.asset.balance.value,
                asset: form.asset.code
              })
            }}
          </p>
        </div>
      </div>
    </div>
    <div class="app__form-row">
      <amount-input-field
        v-model="form.amount"
        name="deposit-fiat-card-amount"
        validation-type="outgoing"
        :label="'deposit-fiat-card-module.amount' | globalize({
          asset: form.asset.code
        })"
        :disabled="formMixin.isDisabled"
        :asset="form.asset"
      />
    </div>
    <div class="app__form-row deposit-fiat-card__form-row">
      <table class="deposit-fiat-card__fee-table">
        <tbody
          class="deposit-fiat-card__fee-tbody"
          :class="{ 'deposit-fiat-card__data--loading': isFeesLoadPending }"
        >
          <tr>
            <td>
              {{ 'deposit-fiat-card-module.network-fee-hint' | globalize }}
            </td>
            <td>
              {{
                'deposit-fiat-card-module.network-fee-unknown' | globalize
              }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'deposit-fiat-card-module.fixed-fee' | globalize }}
            </td>
            <td>
              <template v-if="isFeesLoadPending">
                {{ 'deposit-fiat-card-module.fee-loading-msg' | globalize }}
              </template>
              <template v-else>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: fees.fixedFee, currency: form.asset.code } | formatMoney }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'deposit-fiat-card-module.percent-fee' | globalize }}
            </td>
            <td>
              <template v-if="isFeesLoadPending">
                {{ 'deposit-fiat-card-module.fee-loading-msg' | globalize }}
              </template>
              <template v-else>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: fees.percentFee, currency: form.asset.code } | formatMoney }}
              </template>
            </td>
          </tr>
          <tr class="deposit-fiat-card__total-fee-row">
            <td>
              {{
                'deposit-fiat-card-module.total-amount-account' | globalize
              }}
            </td>
            <td>
              <template v-if="isFeesLoadPending">
                {{ 'deposit-fiat-card-module.fee-loading-msg' | globalize }}
              </template>
              <template v-else>
                {{
                  { value: totalFee, currency: form.asset.code } | formatMoney
                }}
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
        name="deposit-fiat-card-number"
        :label="'deposit-fiat-card-module.card-number' | globalize"
        :disabled="formMixin.isDisabled"
        @blur="touchField('form.cardNumber')"
        :error-message="getFieldErrorMessage('form.cardNumber')"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.cardExpirationDate"
        name="deposit-fiat-card-expiration-date"
        :label="'deposit-fiat-card-module.expiration-date' | globalize"
        :disabled="formMixin.isDisabled"
        @blur="touchField('form.cardExpirationDate')"
        :error-message="getFieldErrorMessage('form.cardExpirationDate')"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.cardCVV3"
        type="password"
        name="deposit-fiat-card-cvv3"
        :label="'deposit-fiat-card-module.card-cvv3' | globalize"
        :disabled="formMixin.isDisabled"
        @blur="touchField('form.cardCVV3')"
        :error-message="getFieldErrorMessage('form.cardCVV3')"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.cardHolder"
        name="deposit-fiat-card-holder"
        :label="'deposit-fiat-card-module.card-holder' | globalize"
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
        {{ 'deposit-fiat-card-module.deposit' | globalize }}
      </button>
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        :is-pending="isDepositPending"
        @ok="submit"
        @cancel="hideConfirmation()"
      />
    </div>
  </form>
  <no-data-message
    :title="'deposit-fiat-card-module.no-assets' | globalize"
    :message="'deposit-fiat-card-module.here-will-assets-list' | globalize"
    v-else-if="!form.asset && isInitialized"
  />
  <loader v-else message-id="deposit-fiat-card-module.loading-msg" />
</template>

<script>
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import FormMixin from '@/vue/mixins/form.mixin'
import debounce from 'lodash/debounce'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { types } from './store/types'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { Wallet, base } from '@tokend/js-sdk'
import { api } from '@/api'
import { MathUtil } from '@/js/utils'
import {
  required,
  cardNumber,
  cardExpirationDate,
  cardCVV3,
} from '@validators'

const EMPTY_FEE = '0.000000'

const EVENTS = {
  deposited: 'deposited',
}

const MASTER_ACCOUNT = {
  seed: 'SAMJKTZVW5UOHCDK5INYJNORF2HRKYI72M5XSZCBYAHQHR34FFR4Z6G4',
  id: 'GBA4EX43M25UPV4WIE6RRMQOFTWXZZRIPFAI5VPY6Z2ZVVXVWZ6NEOOB',
}

const MASTER_ACCOUNT_WALLET = new Wallet(
  '',
  MASTER_ACCOUNT.seed,
  MASTER_ACCOUNT.id,
  ''
)

export default {
  name: 'deposit-fiat-card-module',
  components: {
    Loader,
    NoDataMessage,
  },
  mixins: [FormMixin],
  props: {
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
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
    isDepositPending: false,
    feesDebouncedRequest: null,
    fees: {
      fixedFee: EMPTY_FEE,
      percentFee: EMPTY_FEE,
    },
    form: {
      asset: null,
      amount: null,
      cardNumber: null,
      cardExpirationDate: null,
      cardCVV3: null,
      cardHolder: null,
    },
  }),
  computed: {
    ...mapGetters('deposit-fiat-card', {
      depositableFiatAssets: types.depositableFiatAssets,
      balances: types.balances,
      calculatedFees: types.fees,
    }),
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    totalFee () {
      return MathUtil.add(this.fees.percentFee, this.fees.fixedFee)
    },
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
        cardNumber: {
          required,
          cardNumber,
        },
        cardExpirationDate: {
          required,
          cardExpirationDate,
        },
        cardCVV3: {
          required,
          cardCVV3,
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

    this.form.asset = this.depositableFiatAssets[0]

    this.isInitialized = true
  },
  methods: {
    ...mapMutations('deposit-fiat-card', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('deposit-fiat-card', {
      loadBalances: types.LOAD_BALANCES,
      loadAssets: types.LOAD_ASSETS,
      loadFees: types.LOAD_FEES,
    }),
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
      this.isDepositPending = true
      try {
        if (this.isFeesLoadFailed) {
          Bus.error('deposit-fiat-card-module.failed-load-fees')
          return false
        }
        // eslint-disable-next-line max-len
        const operation = base.CreateIssuanceRequestBuilder.createIssuanceRequest({
          ...this.composeOptions(),
        })

        await api.withWallet(MASTER_ACCOUNT_WALLET).postOperations(operation)
        Bus.success('deposit-fiat-card-module.deposit-success')
        this.$emit(EVENTS.deposited)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isDepositPending = false
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
        asset: this.form.asset.code,
        amount: MathUtil.add(this.form.amount, this.totalFee),
        receiver: this.balances
          .find(item => item.assetCode === this.form.asset.code).id,
        reference: this.generateRandomReferece(20),
        source: MASTER_ACCOUNT.id,
        creatorDetails: {},
      }
    },
    generateRandomReferece (length) {
      let ref = ''
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < length; i++) {
        ref += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return ref
    },
  },
}
</script>

<style lang="scss">
@import '@/vue/forms/_app-form';

.deposit-fiat-card__fee-table {
  width: 100%;
  font-size: 1.2rem;
}

.deposit-fiat-card__fee-table tr {
  height: 2rem;
}

.deposit-fiat-card__fee-table td:last-child {
  text-align: right;
}

.deposit-fiat-card__fee-tbody {
  color: $col-text-secondary;
}

.deposit-fiat-card__total-fee-row {
  color: $col-text;
  font-weight: 600;
}
</style>
