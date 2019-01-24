<template>
  <div class="withdrawal" v-if="isDataLoaded">
    <template v-if="tokenCodes.length">
      <form
        @submit.prevent="isConfirmationShown = true"
      >
        <div class="app__form-row withdraw__form-row">
          <div class="app__form-field">
            <select-field
              :values="tokenCodes"
              :disabled="formMixin.isDisabled"
              v-model="form.tokenCode"
              :label="'withdrawal-form.asset' | globalize"
            />
            <div class="withdrawal__form-field-description">
              <p>
                {{
                  'withdrawal-form.balance' | globalize({
                    amount: balanceInfo.balance,
                    asset: form.tokenCode
                  })
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="app__form-row withdraw__form-row">
          <input-field
            white-autofill
            class="app__form-field"
            v-model.trim="form.amount"
            type="number"
            @blur="touchField('form.amount')"
            :label="
              'withdrawal-form.amount' | globalize({asset: form.tokenCode})
            "
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage(
              'form.amount',
              { from:MIN_AMOUNT, to:balanceInfo.balance }
            )"
          />
        </div>

        <div class="app__form-row withdraw__form-row">
          <input-field
            white-autofill
            class="app__form-field"
            v-model.trim="form.address"
            @blur="touchField('form.address')"
            :error-message="getFieldErrorMessage('form.address')"
            :label="'withdrawal-form.destination-address' |
              globalize({ asset: form.tokenCode })"
            :monospaced="true"
            :disabled="formMixin.isDisabled"
          />
        </div>

        <div class="app__form-row withdraw__form-row">
          <table class="withdraw__fee-table">
            <tbody
              class="withdraw__fee-tbody"
              :class="{ 'withdrawal__data_loading': isFeesLoadPending }">
              <tr>
                <td>{{ 'withdrawal-form.network-fee-hint' | globalize }}</td>
                <td>-</td>
              </tr>
              <tr>
                <td>{{ 'withdrawal-form.fixed-fee' | globalize }}</td>
                <td>
                  <!-- eslint-disable-next-line max-len -->
                  {{ { value: fixedFee, currency: form.tokenCode } | formatMoney }}
                </td>
              </tr>
              <tr>
                <td>{{ 'withdrawal-form.percent-fee' | globalize }}</td>
                <td>
                  <!-- eslint-disable-next-line max-len -->
                  {{ { value: percentFee, currency: form.tokenCode } | formatMoney }}
                </td>
              </tr>
            </tbody>
            <tbody class="withdraw__total-fee-tbody">
              <tr>
                <td>
                  {{ 'withdrawal-form.total-amount-account' | globalize }}
                </td>
                <td>
                  <!-- eslint-disable-next-line max-len -->
                  {{ { value: (+percentFee + +fixedFee), currency: form.tokenCode } | formatMoney }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="app__form-actions withdrawal__action-margin">
          <button
            v-ripple
            v-if="!isConfirmationShown"
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'withdrawal-form.withdrawal' | globalize }}
          </button>
          <form-confirmation
            v-if="isConfirmationShown"
            @ok="submit"
            @cancel="isConfirmationShown = false"
          />
        </div>
      </form>
    </template>
    <template v-else>
      <h2 class="app__page-heading">
        {{ 'withdrawal-form.no-assets-heading' | globalize }}
      </h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ 'withdrawal-form.no-assets' | globalize }}
      </p>
      <router-link
        to="/tokens"
        tag="button"
        class="app__button-raised withdrawal__action-margin">
        {{ 'withdrawal-form.discover-assets-btn' | globalize }}
      </router-link>
    </template>
  </div>
  <loader v-else />
</template>

<script>
import config from '@/config'
import debounce from 'lodash/debounce'
import FormMixin from '@/vue/mixins/form.mixin'
import FormConfirmation from '@/vue/common/FormConfirmation'
import Loader from '@/vue/common/Loader'

import { ASSET_POLICIES, FEE_TYPES } from '@tokend/js-sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { required, amountRange, address } from '@validators'

const EVENTS = {
  cancel: 'cancel',
}

const EMPTY_FEE = '0.0000'

export default {
  name: 'withdrawal-form',
  components: {
    FormConfirmation,
    Loader,
  },
  mixins: [FormMixin],
  data () {
    return {
      isDataLoaded: false,
      isConfirmationShown: false,
      form: {
        tokenCode: null,
        amount: '',
        adress: '',
      },
      assets: [],
      MIN_AMOUNT: config.MIN_AMOUNT,
      fixedFee: EMPTY_FEE,
      percentFee: EMPTY_FEE,
      feesDebouncedRequest: null,
      isFeesLoadPending: false,
      isFeesLoadFailed: false,
    }
  },
  validations () {
    return {
      form: {
        tokenCode: { required },
        amount: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.balanceInfo.balance),
        },
        address: { required, address },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.account,
      vuexTypes.accountId,
    ]),
    tokenCodes () {
      return this.assets.map(item => item.code)
    },
    balanceInfo () {
      return this.account.balances
        .find(item => item.asset === this.form.tokenCode)
    },
  },
  watch: {
    'form.amount' (value) {
      if (value === '' || value < +this.MIN_AMOUNT) {
        this.fixedFee = EMPTY_FEE
        this.percentFee = EMPTY_FEE
        return
      }
      this.tryGetFees()
    },
    'form.tokenCode' () {
      this.tryGetFees()
    },
    isConfirmationShown (value) {
      if (value) {
        if (!this.isFormValid()) return
        this.disableForm()
      } else {
        this.enableForm()
      }
    },
  },
  async created () {
    try {
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets.filter(item => {
        return item.policies
          .map(policy => policy.value)
          .indexOf(ASSET_POLICIES.withdrawable) !== -1
      })
      this.form.tokenCode = this.tokenCodes[0] || null
      this.isDataLoaded = true
    } catch (e) {
      console.error(e)
      ErrorHandler.process(e)
    }
  },
  methods: {
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),
    async submit () {
      if (!this.isFormValid()) return
      try {
        if (this.isFeesLoadFailed) {
          Bus.error('withdrawal-form.failed-load-fees')
          return false
        }
        const operation = Sdk.base.CreateWithdrawRequestBuilder
          .createWithdrawWithAutoConversion(this.composeOptions())
        await Sdk.horizon.transactions.submitOperations(operation)
        await this.loadAccount()
        Bus.success('withdrawal-form.withdraw-success')
        this.$emit(EVENTS.cancel)
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async getFees () {
      try {
        const fees = await Sdk.horizon.fees.get(FEE_TYPES.withdrawalFee, {
          account: this.accountId,
          asset: this.form.tokenCode,
          amount: this.form.amount,
        })
        this.fixedFee = fees.data.fixed
        this.percentFee = fees.data.percent
        this.isFeesLoadFailed = false
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.process(e)
        console.error(e)
      }
      this.isFeesLoadPending = false
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
        balance: this.balanceInfo.balanceId,
        amount: this.form.amount,
        externalDetails: { address: this.form.adress },
        destAsset: this.form.tokenCode,
        expectedDestAssetAmount: this.form.amount,
        fee: {
          fixed: this.fixedFee,
          percent: this.percentFee,
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/scss/variables";

  .withdraw__fees-container {
    &.loading {
      opacity: 0.7;
    }

    .withdrawal__fee-type {
      color: $col-info;
    }
  }

  .withdraw__form-row {
    margin-bottom: 2.5rem;
  }

  .withdrawal__form-field-description {
    margin-top: 0.4rem;
    opacity: 0.7;
  }

  .withdraw__fee-table {
    width: 100%;
    font-size: 1.2rem;

    tr {
      height: 2rem;
    }

    td:last-child{
      text-align: right;
    }
  }

  .withdraw__fee-tbody {
    opacity: 0.7;
  }

  .withdraw__total-fee-tbody {
    font-weight: 600
  }

  .withdrawal__action-margin {
    margin-top: 2.5rem;
  }
  .withdrawal__data_loading {
    opacity: 0.4;
  }

  .withdrawal__table-description {
    opacity: 0.6;
    font-size: 1.2rem;
  }
</style>
