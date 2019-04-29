<template>
  <div class="deposit-fiat-bank-module" v-if="form.asset && isInitialized">
    <div class="app__form-row deposit-fiat-bank__form-row">
      <div class="app__form-field">
        <select-field
          name="deposit-fiat-bank-asset"
          v-model="form.asset"
          :values="depositableFiatAssets"
          key-as-value-text="nameAndCode"
          :label="'deposit-fiat-bank-module.asset' | globalize"
        />
        <div class="deposit-fiat-bank__form-field-description">
          <p>
            {{
              'deposit-fiat-bank-module.balance' | globalize({
                amount: form.asset.balance.value,
                asset: form.asset.code
              })
            }}
          </p>
        </div>
      </div>
    </div>
    <div class="app__form-row deposit-fiat-bank__form-row">
      <table class="deposit-fiat-bank__fee-table">
        <tbody
          class="deposit-fiat-bank__fee-tbody"
          :class="{ 'deposit-fiat-bank__data--loading': isFeesLoadPending }"
        >
          <tr>
            <td>
              {{ 'deposit-fiat-bank-module.network-fee-hint' | globalize }}
            </td>
            <td>
              {{
                'deposit-fiat-bank-module.network-fee-unknown' | globalize
              }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'deposit-fiat-bank-module.fixed-fee' | globalize }}
            </td>
            <td>
              <template v-if="isFeesLoadPending">
                {{ 'deposit-fiat-bank-module.fee-loading-msg' | globalize }}
              </template>
              <template v-else>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: fees.fixedFee, currency: form.asset.code } | formatMoney }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'deposit-fiat-bank-module.percent-fee' | globalize }}
            </td>
            <td>
              <template v-if="isFeesLoadPending">
                {{ 'deposit-fiat-bank-module.fee-loading-msg' | globalize }}
              </template>
              <template v-else>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: fees.percentFee, currency: form.asset.code } | formatMoney }}
              </template>
            </td>
          </tr>
          <tr class="deposit-fiat-bank__total-fee-row">
            <td>
              {{
                'deposit-fiat-bank-module.total-amount-account' | globalize
              }}
            </td>
            <td>
              <template v-if="isFeesLoadPending">
                {{ 'deposit-fiat-bank-module.fee-loading-msg' | globalize }}
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
    <h3 class="app__form-subheading">
      {{ 'deposit-fiat-bank-module.beneficiary-title' | globalize }}
    </h3>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.beneficiary.iban"
        :label="'deposit-fiat-bank-module.beneficiary-iban' | globalize"
        :readonly="true"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.beneficiary.accountNumber"
        :label="'deposit-fiat-bank-module.beneficiary-account' | globalize"
        :readonly="true"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.beneficiary.receiver"
        :label="'deposit-fiat-bank-module.beneficiary-receiver' | globalize"
        :readonly="true"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.beneficiary.bankName"
        :label="'deposit-fiat-bank-module.beneficiary-bank' | globalize"
        :readonly="true"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.beneficiary.city"
        :label="'deposit-fiat-bank-module.beneficiary-city' | globalize"
        :readonly="true"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.beneficiary.swiftCode"
        :label="'deposit-fiat-bank-module.beneficiary-swift' | globalize"
        :readonly="true"
      />
    </div>
    <div class="deposit-fiat-bank-module__spacer" />
    <h3 class="app__form-subheading">
      {{ 'deposit-fiat-bank-module.intermediary-title' | globalize }}
    </h3>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.intermediary.bankName"
        :label="'deposit-fiat-bank-module.intermediary-bank' | globalize"
        :readonly="true"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.intermediary.city"
        :label="'deposit-fiat-bank-module.intermediary-city' | globalize"
        :readonly="true"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.intermediary.accountNumber"
        :label="'deposit-fiat-bank-module.intermediary-account' | globalize"
        :readonly="true"
      />
    </div>
    <div class="app__form-row">
      <input-field
        white-autofill
        class="app__form-field"
        v-model.trim="form.intermediary.swiftCode"
        :label="'deposit-fiat-bank-module.intermediary-swift' | globalize"
        :readonly="true"
      />
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <textarea-field
          v-model="form.paymentDetails"
          :label="'deposit-fiat-bank-module.payment-details' | globalize"
          :readonly="true"
          :rows="8"
        />
      </div>
    </div>
  </div>
  <no-data-message
    :title="'deposit-fiat-bank-module.no-assets' | globalize"
    :message="'deposit-fiat-bank-module.here-will-assets-list' | globalize"
    v-else-if="!form.asset && isInitialized"
  />
  <loader v-else message-id="deposit-fiat-bank-module.loading-msg" />
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'
import { vuexTypes } from '@/vuex'

import FormMixin from '@/vue/mixins/form.mixin'
import debounce from 'lodash/debounce'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { MathUtil } from '@/js/utils'

import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

const EVENTS = {
  deposited: 'deposited',
}

const EMPTY_FEE = '0.000000'
// const and it format required to correct displaying in the textarea field
const PAYMENT_DETAILS_INFO =
`for individuals:
  - private transfer
  - transfer to own account
  - help to relative

for legal entities:
  - honorarium
  - compensation for ...`

export default {
  name: 'deposit-fiat-bank-module',
  components: {
    Loader,
    NoDataMessage,
  },
  mixins: [FormMixin],
  data: _ => ({
    isInitialized: false,
    form: {
      beneficiary: {
        iban: 'DE89370400440532013000',
        accountNumber: '370400440532013000',
        receiver: 'Ivan Petrov, 37000, Urkaine, area. Kharkivska, c. Kharkiv, st. Pushkinskaya, build. 91/2',
        bankName: 'JSC UNIVERSAL BANK',
        city: 'KYIV, UKRAINE',
        swiftCode: 'CTBAAU2S',
      },
      intermediary: {
        bankName: 'DEUTSCHE BANK TRUST CO. AMERICAS',
        city: 'NEW YORK, USA',
        accountNumber: '4452422',
        swiftCode: 'BKTRUS21XXX',
      },
      paymentDetails: PAYMENT_DETAILS_INFO,
      asset: null,
    },
    isFeesLoadPending: false,
    isFeesLoadFailed: false,
    feesDebouncedRequest: null,
    fees: {
      fixedFee: EMPTY_FEE,
      percentFee: EMPTY_FEE,
    },
  }),
  computed: {
    ...mapGetters('deposit-fiat-bank', {
      depositableFiatAssets: types.depositableFiatAssets,
      balances: types.balances,
      calculatedFees: types.fees,
    }),
    ...mapGetters([
      vuexTypes.wallet,
    ]),
    totalFee () {
      return MathUtil.add(this.fees.percentFee, this.fees.fixedFee)
    },
  },
  watch: {
    'form.asset.code' () {
      this.tryGetFees()
    },
  },
  async created () {
    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
    await this.loadAssets()

    this.form.asset = this.depositableFiatAssets[0]

    this.isInitialized = true
  },
  methods: {
    ...mapMutations('deposit-fiat-bank', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('deposit-fiat-bank', {
      loadBalances: types.LOAD_BALANCES,
      loadAssets: types.LOAD_ASSETS,
      loadFees: types.LOAD_FEES,
    }),
    deposited () {
      this.$emit(EVENTS.deposited)
    },
    tryGetFees () {
      this.isFeesLoadPending = true
      if (!this.feesDebouncedRequest) {
        this.feesDebouncedRequest = debounce(() => this.getFees(), 300)
      }
      return this.feesDebouncedRequest()
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
  },
}
</script>

<style lang="scss">
@import '@/vue/forms/_app-form';

.deposit-fiat-bank-module__spacer {
  margin-top: 4rem;
}

.deposit-fiat-bank__fee-table {
  width: 100%;
  font-size: 1.2rem;

  tr {
    height: 2rem;
  }

  td:last-child {
    text-align: right;
  }
}

.deposit-fiat-bank__fee-tbody {
  color: $col-text-secondary;
}

.deposit-fiat-bank__total-fee-row {
  color: $col-text;
  font-weight: 600;
}
</style>
