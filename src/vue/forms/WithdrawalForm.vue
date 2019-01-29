<template>
  <div class="withdrawal" v-if="isLoaded">
    <template v-if="assetCodes.length">
      <form
        @submit.prevent="isFormValid() && showFormConfirmation() ||
          disableForm()"
        id="withdrawal-form"
        novalidate
      >
        <div class="app__form-row withdrawal__form-row">
          <div class="app__form-field">
            <select-field
              :values="assetCodes"
              :disabled="formMixin.isDisabled"
              v-model="form.assetCode"
              :label="'withdrawal-form.asset' | globalize"
            />
            <div class="withdrawal__form-field-description">
              <p>
                {{
                  'withdrawal-form.balance' | globalize({
                    amount: balanceInfo.balance,
                    asset: form.assetCode
                  })
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="app__form-row withdrawal__form-row">
          <input-field
            white-autofill
            class="app__form-field"
            v-model.trim="form.amount"
            type="number"
            @blur="touchField('form.amount')"
            :label="'withdrawal-form.amount' | globalize({
              asset: form.assetCode
            })"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage('form.amount', {
              from:MIN_AMOUNT,
              to:balanceInfo.balance
            })"
          />
        </div>

        <div class="app__form-row withdrawal__form-row">
          <input-field
            white-autofill
            class="app__form-field"
            v-model.trim="form.address"
            @blur="touchField('form.address')"
            :error-message="getFieldErrorMessage('form.address')"
            :label="'withdrawal-form.destination-address' | globalize({
              asset: form.assetCode
            })"
            :monospaced="true"
            :disabled="formMixin.isDisabled"
          />
        </div>

        <div class="app__form-row withdrawal__form-row">
          <table class="withdrawal__fee-table">
            <tbody
              class="withdrawal__fee-tbody"
              :class="{ 'withdrawal__data_loading': isFeesLoadPending }">
              <tr>
                <td>{{ 'withdrawal-form.network-fee-hint' | globalize }}</td>
                <td>-</td>
              </tr>
              <tr>
                <td>{{ 'withdrawal-form.fixed-fee' | globalize }}</td>
                <td>
                  <!-- eslint-disable-next-line max-len -->
                  {{ { value: fixedFee, currency: form.assetCode } | formatMoney }}
                </td>
              </tr>
              <tr>
                <td>{{ 'withdrawal-form.percent-fee' | globalize }}</td>
                <td>
                  <!-- eslint-disable-next-line max-len -->
                  {{ { value: percentFee, currency: form.assetCode } | formatMoney }}
                </td>
              </tr>
            </tbody>
            <tbody class="withdrawal__total-fee-tbody">
              <tr>
                <td>
                  {{ 'withdrawal-form.total-amount-account' | globalize }}
                </td>
                <td>
                  <!-- eslint-disable-next-line max-len -->
                  {{ { value: (+percentFee + +fixedFee), currency: form.assetCode } | formatMoney }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="app__form-actions withdrawal__action-margin">
          <button
            v-ripple
            v-if="!formMixin.isFormConfirmationShown"
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
            form="withdrawal-form"
          >
            {{ 'withdrawal-form.withdrawal' | globalize }}
          </button>
          <form-confirmation
            v-if="formMixin.isFormConfirmationShown"
            @ok="hideFormConfirmation() || enableForm() || submit()"
            @cancel="hideFormConfirmation() || enableForm()"
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

import { AssetRecord } from '@/js/records/entities/asset.record'
import { FEE_TYPES } from '@tokend/js-sdk'
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
      isLoaded: false,
      form: {
        assetCode: null,
        amount: '',
        address: '',
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
        assetCode: { required },
        amount: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.balanceInfo.balance),
        },
        address: { required, address: address(this.form.assetCode) },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.account,
      vuexTypes.accountId,
    ]),
    assetCodes () {
      return this.assets.map(item => item.code)
    },
    balanceInfo () {
      return this.account.balances
        .find(item => item.asset === this.form.assetCode)
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
    'form.assetCode' () {
      this.tryGetFees()
    },
  },
  async created () {
    try {
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets
        .map(item => new AssetRecord(item))
        .filter(item => {
          if (this.account.balances
            .find(balance => balance.asset === item.code)) {
            return item.isWithdrawable
          } else {
            return false
          }
        })
      this.form.assetCode = this.assetCodes[0] || null
      this.isLoaded = true
    } catch (e) {
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
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async getFees () {
      try {
        const fees = await Sdk.horizon.fees.get(FEE_TYPES.withdrawalFee, {
          account: this.accountId,
          asset: this.form.assetCode,
          amount: this.form.amount,
        })
        this.fixedFee = fees.data.fixed
        this.percentFee = fees.data.percent
        this.isFeesLoadFailed = false
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.process(e)
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
        externalDetails: { address: this.form.address },
        destAsset: this.form.assetCode,
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

  .withdrawal__fees-container {
    &.loading {
      opacity: 0.7;
    }

    .withdrawal__fee-type {
      color: $col-info;
    }
  }

  .withdrawal__form-row {
    margin-bottom: 2.5rem;
  }

  .withdrawal__form-field-description {
    margin-top: 0.4rem;
    opacity: 0.7;
  }

  .withdrawal__fee-table {
    width: 100%;
    font-size: 1.2rem;

    tr {
      height: 2rem;
    }

    td:last-child{
      text-align: right;
    }
  }

  .withdrawal__fee-tbody {
    opacity: 0.7;
  }

  .withdrawal__total-fee-tbody {
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
