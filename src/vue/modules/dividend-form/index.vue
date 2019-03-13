<template>
  <div class="dividend">
    <template v-if="isInitialized">
      <template v-if="ownedAssets.length">
        <form
          @submit.prevent="isFormValid() && showConfirmation()"
          id="dividend-form"
          novalidate
        >
          <div class="app__form-row dividend__form-row">
            <div class="app__form-field">
              <select-field
                name="dividend-asset"
                v-model="form.ownedAsset"
                :values="ownedAssets"
                key-as-value-text="nameAndCode"
                :disabled="formMixin.isDisabled"
                :label="'dividend-form.asset' | globalize"
              />
              <p class="app__form-field-description">
                <!-- eslint-disable-next-line max-len -->
                {{ 'dividend-form.balance' | globalize({ amount: form.ownedAsset.balance.value, asset: form.ownedAsset.code }) }}
              </p>
            </div>
          </div>

          <div class="app__form-row dividend__form-row">
            <div class="app__form-field">
              <select-field
                name="dividend-asset"
                v-model="form.asset"
                :values="assets"
                key-as-value-text="nameAndCode"
                :disabled="formMixin.isDisabled"
                :label="'dividend-form.asset-dividend-pay' | globalize"
              />
              <p class="app__form-field-description">
                <!-- eslint-disable-next-line max-len -->
                {{ 'dividend-form.balance' | globalize({ amount: form.asset.balance.value, asset: form.asset.code }) }}
              </p>
            </div>
          </div>

          <div class="app__form-row dividend__form-row">
            <input-field
              white-autofill
              class="app__form-field"
              v-model.trim="form.amount"
              type="number"
              name="dividend-amount"
              :step="config.minAmount"
              @blur="touchField('form.amount')"
              :label="'dividend-form.amount' | globalize({
                asset: form.asset.code
              })"
              :disabled="formMixin.isDisabled"
              :error-message="getFieldErrorMessage('form.amount', {
                available: form.asset.balance.value,
                maxDecimalDigitsCount: config.decimalPoints,
              })"
            />
          </div>

          <div class="app__form-row dividend__form-row">
            <table class="dividend__fee-table">
              <thead class="dividend__fee-thead">
                <tr>
                  <td>
                    {{ 'dividend-form.email' | globalize }}
                  </td>
                  <td>
                    {{ 'dividend-form.token-amount' | globalize }}
                  </td>
                  <td>
                    {{ 'dividend-form.supposed-dividend-amount' | globalize }}
                  </td>
                </tr>
              </thead>
              <tbody
                class="dividend__fee-tbody"
                :class="{ 'dividend__data--loading': isSignersLoadPending }"
                v-if="balanceHolders.length && isSignersLoaded"
              >
                <tr v-for="holder in balanceHolders" :key="holder.id">
                  <td>
                    <email-getter :balance-id="holder.id" />
                  </td>
                  <td>
                    {{ holder.available | formatMoney }}
                    {{ form.ownedAsset.code }}
                  </td>
                  <td v-if="form.amount">
                    {{ getDividendAmount(holder) | formatMoney }}
                    {{ form.asset.code }}
                  </td>
                  <td v-else>
                    &mdash;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <template v-if="!balanceHolders.length && isSignersLoaded">
            <p class="dividend__fee-holders-not-found">
              {{ 'dividend-form.asset-holders-not-found' | globalize }}
            </p>
          </template>

          <div class="app__form-actions dividend__action">
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              type="submit"
              class="app__button-raised"
              :disabled="formMixin.isDisabled || !balanceHolders.length"
              form="dividend-form"
            >
              {{ 'dividend-form.dividend-btn' | globalize }}
            </button>
            <form-confirmation
              v-if="formMixin.isConfirmationShown"
              :is-pending="isDividendSubmitting"
              @ok="submit"
              @cancel="hideConfirmation()"
            />
          </div>
        </form>
      </template>
      <template v-else>
        <h2 class="app__page-heading">
          {{ 'dividend-form.no-assets-heading' | globalize }}
        </h2>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ 'dividend-form.no-assets' | globalize }}
        </p>
        <router-link
          to="/tokens"
          tag="button"
          class="app__button-raised dividend__action"
        >
          {{ 'dividend-form.discover-assets-btn' | globalize }}
        </router-link>
      </template>
    </template>
    <template v-else>
      <loader message-id="dividend-form.loading-msg" />
    </template>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import FormMixin from '@/vue/mixins/form.mixin'
import FormConfirmation from '@/vue/common/FormConfirmation'
import Loader from '@/vue/common/Loader'

import { mapActions, mapGetters, mapMutations } from 'vuex'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import EmailGetter from '@/vue/common/EmailGetter'
import { types } from './store/types'

import { PAYMENT_FEE_SUBTYPES, Wallet, base } from '@tokend/js-sdk'
import { api, initApi } from './_api'
import {
  amount,
  maxDecimalDigitsCount,
  noMoreThanAvailableOnBalance,
  required,
} from '@validators'
import { MathUtil } from '@/js/utils/math.util'

const EVENTS = {
  transferred: 'transferred',
}

export default {
  name: 'dividend-form-module',
  components: {
    FormConfirmation,
    Loader,
    EmailGetter,
  },
  mixins: [FormMixin],
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.decimalPoints - count of allowed decimal points
     * @property config.minAmount - minimal allowed amount
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    isInitialized: false,
    form: {
      amount: '',
      ownedAsset: {},
      asset: {},
    },
    balanceHolders: [],
    ownedUserBalance: '',
    signersDebouncedRequest: null,
    isSignersLoadPending: false,
    isSignersLoaded: false,
    isDividendSubmitting: false,
  }),
  computed: {
    ...mapGetters('dividend-form', {
      accountId: types.accountId,
      balances: types.balances,
      assets: types.assets,
      ownedAssets: types.ownedAssets,
      signers: types.balanceHolders,
    }),
  },
  watch: {
    'form.ownedAsset.code' () {
      this.tryGetSigners()
    },
  },
  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          amount,
          noMoreThanAvailableOnBalance: noMoreThanAvailableOnBalance(
            this.form.asset.balance.value
          ),
          maxDecimalDigitsCount: maxDecimalDigitsCount(
            this.config.decimalPoints
          ),
        },
      },
    }
  },
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
    await this.loadAssets()

    this.form.ownedAsset = this.ownedAssets[0]
    this.form.asset = this.assets[0]

    this.isInitialized = true
  },
  methods: {
    ...mapMutations('dividend-form', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('dividend-form', {
      loadBalances: types.LOAD_BALANCES,
      loadAssets: types.LOAD_ASSETS,
      loadSigners: types.LOAD_BALANCE_HOLDERS,
      getAccountId: types.LOAD_ACCOUNT_ID,
      loadPaymentFee: types.LOAD_FEES,
    }),
    async submit () {
      this.disableForm()
      this.isDividendSubmitting = true
      try {
        if (!this.isSignersLoaded) {
          Bus.error('dividend-form.failed-load-signers')
          return false
        }
        const operations = await this.getTransferOperations()
        await api().postOperations(...operations)
        Bus.success('dividend-form.dividend-success')
        this.$emit(EVENTS.transferred)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isDividendSubmitting = false
      this.enableForm()
      this.hideConfirmation()
    },
    async getSigners () {
      this.isSignersLoaded = false
      try {
        await this.loadSigners({
          assetCode: this.form.ownedAsset.code,
        })
        this.balanceHolders = this.signers
        await this.addAccountIdField()
        this.balanceHolders = this.balanceHolders
          .filter(balance => this.deleteOwnedBalance(balance))
        this.isSignersLoaded = true
      } catch (e) {
        this.isSignersLoaded = false
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isSignersLoadPending = false
    },
    async addAccountIdField () {
      await Promise.all(
        this.balanceHolders
          .map(async item => {
            item.accountId = await this.getAccountId({
              accountId: item.id,
            })
            return item
          })
      )
    },
    deleteOwnedBalance (balance) {
      if (balance.accountId === this.accountId) {
        this.ownedUserBalance = this.getFullBalanceHolder(balance)
        return false
      } else {
        return true
      }
    },
    tryGetSigners () {
      this.isSignersLoadPending = true
      if (!this.signersDebouncedRequest) {
        this.signersDebouncedRequest = debounce(() => this.getSigners(), 300)
      }
      return this.signersDebouncedRequest()
    },
    async getTransferOperations () {
      let operations = []
      let balanceHolders = this.filterPositiveBalance()
      await Promise.all(
        balanceHolders.map(async holder => {
          const fees = await this.getFees(holder)
          const data = this.buildPaymentOperation(holder, fees)
          operations.push(data)
        }))
      return operations
    },
    filterPositiveBalance () {
      return this.balanceHolders
        .filter(holder =>
          this.getFullBalanceHolder(holder) >= this.config.minAmount
        )
    },
    getFullBalanceHolder (holder) {
      return MathUtil
        .add(+holder.available, +holder.locked)
    },
    buildPaymentOperation (holder, fees) {
      return base.PaymentBuilder.payment({
        sourceBalanceId: this.balance().id,
        destination: holder.accountId,
        amount: this.getDividendAmount(holder),
        feeData: {
          sourceFee: {
            percent: fees.source.calculatedPercent,
            fixed: fees.source.fixed,
          },
          destinationFee: {
            percent: fees.destination.calculatedPercent,
            fixed: fees.destination.fixed,
          },
          sourcePaysForDest: false,
        },
        subject: '',
        asset: this.form.asset.code,
      })
    },
    balance () {
      return this.balances
        .find(i => i.asset === this.form.asset.code) || {}
    },
    async getFees (holder) {
      const [senderFees, recipientFees] = await Promise.all([
        this.loadPaymentFee({
          assetCode: this.form.asset.code,
          amount: this.getDividendAmount(holder),
          accountId: this.accountId,
          subtype: PAYMENT_FEE_SUBTYPES.outgoing,
        }),
        this.loadPaymentFee({
          assetCode: this.form.asset.code,
          amount: this.getDividendAmount(holder),
          accountId: holder.accountId,
          subtype: PAYMENT_FEE_SUBTYPES.incoming,
        }),
      ])
      return {
        source: senderFees,
        destination: recipientFees,
      }
    },
    getDividendAmount (holder) {
      const countHolderBalanceValue = this.getFullBalanceHolder(holder)
      const countAssetValue = MathUtil
        .divide(countHolderBalanceValue, this.countIssuedValue())
      return MathUtil
        .multiply(countAssetValue, this.form.amount)
        .toString()
    },
    countIssuedValue () {
      if (+this.ownedUserBalance !== 0) {
        return MathUtil
          .subtract(+this.form.ownedAsset.issued, +this.ownedUserBalance)
      } else {
        return +this.form.ownedAsset.issued
      }
    },
  },
}
</script>

<style lang="scss" >
  @import "/scss/variables";

  .dividend__fees-container {
    &.loading {
      opacity: 0.7;
    }

    .dividend__fee-type {
      color: $col-info;
    }
  }

  .dividend__form-row {
    margin-bottom: 2.5rem;
  }

  .dividend__form-field-description {
    margin-top: 0.4rem;
    opacity: 0.7;
  }

  .dividend__fee-table {
    width: 100%;
    font-size: 1.2rem;

    tr {
      height: 2rem;
    }

    td:last-child {
      text-align: right;
    }
  }

  .dividend__fee-tbody {
    color: $col-text-secondary;
  }

  .dividend__total-fee-row {
    color: $col-text;
    font-weight: 600;
  }

  .dividend__action {
    margin-top: 2.5rem;
  }
  .dividend__data--loading {
    opacity: 0.4;
  }

  .dividend__table-description {
    opacity: 0.6;
    font-size: 1.2rem;
  }

  .dividend__fee-holders-not-found {
    text-align: center;
    margin-top: 2rem;
    font-size: 1.4rem;
  }
</style>
