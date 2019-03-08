<template>
  <div class="dividend">
    <template v-if="isLoaded">
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
            </div>
            <div class="dividend__form-field-description">
              <p>
                <!-- eslint-disable-next-line max-len -->
                {{ 'dividend-form.balance' | globalize({ amount: form.ownedAsset.balance.value, asset: form.ownedAsset.code }) }}
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
                asset: form.ownedAsset.code
              })"
              :disabled="formMixin.isDisabled"
              :error-message="getFieldErrorMessage('form.amount', {
                available: form.ownedAsset.balance.value,
                maxDecimalDigitsCount: config.decimalPoints,
              })"
            />
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
            </div>
            <div class="dividend__form-field-description">
              <p>
                <!-- eslint-disable-next-line max-len -->
                {{ 'dividend-form.balance' | globalize({ amount: form.asset.balance.value, asset: form.asset.code }) }}
              </p>
            </div>
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
                v-if="tokenHolders.length && isSignersLoaded"
              >
                <tr v-for="holder in tokenHolders" :key="holder.id">
                  <td>
                    <email-getter :balance-id="holder.id" />
                  </td>
                  <td>
                    {{ holder.available | formatMoney }}
                    {{ form.ownedAsset.code }}
                  </td>
                  <td v-if="form.amount">
                    {{ getDividendAmount(holder) | formatMoney }}
                    {{ form.ownedAsset.code }}
                  </td>
                  <td v-else>
                    &mdash;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="app__form-actions dividend__action">
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              type="submit"
              class="app__button-raised"
              :disabled="formMixin.isDisabled"
              form="dividend-form"
            >
              {{ 'dividend-form.dividend-btn' | globalize }}
            </button>
            <form-confirmation
              v-if="formMixin.isConfirmationShown"
              @ok="hideConfirmation() || submit()"
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
    <template v-else-if="isFailed">
      {{ 'dividend-form.can-not-load-assets' | globalize }}
    </template>
    <template v-else>
      <loader message-id="dividend-form.loading-msg" />
    </template>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import FormMixin from '@/vue/mixins/form.mixin'
import OwnedAssetsLoaderMixin from '@/vue/mixins/owned-assets-loader.mixin'
import FormConfirmation from '@/vue/common/FormConfirmation'
import Loader from '@/vue/common/Loader'

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import EmailGetter from '@/vue/common/EmailGetter'
import { types } from './store/types'

import { Wallet, PAYMENT_FEE_SUBTYPES, FEE_TYPES } from '@tokend/js-sdk'
import { api, initApi } from './_api'
import { AssetRecord } from './wrappers/asset.record'
import required from 'vuelidate/src/validators/required'
import { amount, maxDecimalDigitsCount, noMoreThanAvailableOnBalance } from '../../../validators'
import * as base from '@tokend/js-sdk/lib/base/operations/payment_builder'
import { Balance } from './wrappers/balance'
import { MathUtil } from '../../../js/utils/math.util'
import { Sdk } from '../../../sdk'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

const HORIZON_VERSION_PREFIX = 'v3'

export default {
  name: 'dividend-form-module',
  components: {
    FormConfirmation,
    Loader,
    EmailGetter,
  },
  mixins: [FormMixin, OwnedAssetsLoaderMixin],
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
    isLoaded: false,
    isFailed: false,
    form: {
      amount: '',
      ownedAsset: {},
      asset: {},
    },
    ownedAssets: [],
    assets: [],
    tokenHolders: [],
    signersDebouncedRequest: null,
    isSignersLoadPending: false,
    isSignersLoaded: false,
  }),
  computed: {
    ...mapGetters('dividend-form', {
      accountId: types.accountId,
      balances: types.balances,
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
            this.form.ownedAsset.balance.value
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
    this.isInitialized = true
    try {
      await this.initAssetSelector()
      this.isLoaded = true
    } catch (error) {
      this.isFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },
  methods: {
    ...mapMutations('dividend-form', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('dividend-form', {
      loadBalances: types.LOAD_BALANCES,
    }),
    async submit () {
      this.disableForm()
      try {
        if (!this.isSignersLoaded) {
          Bus.error('dividend-form.failed-load-signers')
          return false
        }
        const operations = await this.getTransferOperations()
        await api().postOperations(...operations)
        Bus.success('dividend-form.dividend-success')
        this.$emit(EVENTS.operationSubmitted)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async getSigners () {
      try {
        const { data } = await api().getWithSignature(`/${HORIZON_VERSION_PREFIX}/balances`, {
          filter: {
            asset: this.form.ownedAsset.code,
          },
          include: ['state'],
        })
        const balances = data
          .map(item => new Balance(item))
        this.tokenHolders = balances
        this.isSignersLoaded = true
      } catch (e) {
        this.isSignersLoaded = false
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isSignersLoadPending = false
    },
    tryGetSigners () {
      this.isSignersLoadPending = true
      if (!this.signersDebouncedRequest) {
        this.signersDebouncedRequest = debounce(() => this.getSigners(), 300)
      }
      return this.signersDebouncedRequest()
    },
    async initAssetSelector () {
      await this.loadAssets()
      if (this.ownedAssets.length && this.assets.length) {
        this.form.ownedAsset = this.ownedAssets[0]
        this.form.asset = this.assets[0]
      }
    },
    async loadAssets () {
      const { data } = await api().get(`/${HORIZON_VERSION_PREFIX}/assets`, {})
      const assets = data
        .map(item => new AssetRecord(item, this.balances))

      this.assets = assets
        .filter(item => item.balance.id && item.isTransferable)

      this.ownedAssets = assets
        .filter(item => item.owner === this.accountId)
    },
    async getTransferOperations () {
      let operations = []
      await Promise.all(
        this.tokenHolders.map(async holder => {
          const fees = await this.getFees(holder)
          const data = await this.buildPaymentOperation(holder, fees)
          operations.push(data)
        }))
      return operations
    },
    buildPaymentOperation (holder, fees) {
      return base.PaymentBuilder.payment({
        sourceBalanceId: this.balance().id,
        destination: holder.id,
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
          asset: this.form.asset.code,
          amount: this.getDividendAmount(holder),
          account: this.accountId,
          subtype: PAYMENT_FEE_SUBTYPES.outgoing,
        }),
        this.loadPaymentFee({
          asset: this.form.asset.code,
          amount: this.getDividendAmount(holder),
          account: await this.getAccountId(holder.id),
          subtype: PAYMENT_FEE_SUBTYPES.incoming,
        }),
      ])
      return {
        source: senderFees,
        destination: recipientFees,
      }
    },
    async loadPaymentFee ({ asset, amount, account, subtype }) {
      try {
        const { data } = await api().getWithSignature(`/${HORIZON_VERSION_PREFIX}/accounts/${account}/calculated_fees`, {
          asset: asset,
          fee_type: FEE_TYPES.paymentFee,
          subtype: subtype,
          amount: amount,
        })
        return data
      } catch (e) {
        ErrorHandler.process(e)
        return {}
      }
    },
    getDividendAmount (holder) {
      const countHolderBalanceValue = MathUtil
        .add(+holder.available, +holder.locked)
      const countAssetValue = MathUtil
        .divide(countHolderBalanceValue, +this.form.ownedAsset.issued)
      return MathUtil
        .multiply(countAssetValue, this.form.amount)
    },
    async getAccountId (balanceId) {
      const { data } = await Sdk.horizon.balances.getAccount(balanceId)
      return data.accountId
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/scss/variables";

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
</style>
