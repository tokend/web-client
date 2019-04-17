<template>
  <div v-if="isLoaded">
    <template v-if="assetPairs.length">
      <form
        novalidate
        v-if="!isTransactionSent"
        @submit.prevent="isFormValid() && showConfirmation()"
      >
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.subject"
              @blur="touchField('form.subject')"
              name="create-invoice-subject"
              :label="'create-invoice-form.subject-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.subject')"
              :disabled="subject || formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.amount"
              @blur="touchField('form.amount')"
              name="create-invoice-amount"
              :label="'create-invoice-form.amount-lbl' | globalize({
                asset: form.asset
              })"
              :step="MIN_AMOUNT"
              :error-message="getFieldErrorMessage(
                'form.amount',
                {
                  minValue: MIN_AMOUNT,
                  maxDecimalDigitsCount: DECIMAL_POINTS
                }
              )"
              :disabled="amount || formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.accountNumber"
              @blur="touchField('form.accountNumber')"
              name="create-invoice-account-number"
              :label="'create-invoice-form.account-number-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.accountNumber')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              :values="quoteAssets"
              name="create-invoice-quote-asset"
              :disabled="formMixin.isDisabled"
              v-model="form.quoteAsset"
              key-as-value-text="nameAndCode"
              :label="'create-invoice-form.quote-asset-lbl' | globalize"
            />

            <vue-markdown
              v-if="form.asset !== form.quoteAsset.code"
              class="app__form-field-description create-invoice-form__price"
              :source="'create-invoice-form.price-hint' | globalize({
                baseAsset: form.asset,
                amount: {
                  value: selectedAssetPair.price,
                  currency: form.quoteAsset.code
                }
              })"
            />
          </div>
        </div>

        <vue-markdown
          class="create-invoice-form__total-price"
          :source="'create-invoice-form.total-price' | globalize({
            amount: {
              value: totalPrice,
              currency: form.quoteAsset.code
            }
          })"
        />

        <div class="app__form-actions">
          <form-confirmation
            v-if="formMixin.isConfirmationShown"
            :is-pending="isFormSubmitting"
            @ok="submit"
            @cancel="hideConfirmation"
          />

          <button
            v-else
            v-ripple
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'create-invoice-form.create-invoice' | globalize }}
          </button>
        </div>
      </form>

      <div
        v-else
        class="create-invoice-form__payment"
      >
        <!-- <invoice-viewer :invoice="invoiceRecord" /> -->

        <button
          v-ripple
          type="button"
          class="create-invoice-form__close-btn app__button-raised"
          :disabled="!isPaymentConfirmed"
          @click="closeForm"
        >
          <template v-if="isPaymentConfirmed">
            {{ 'create-invoice-form.close-btn' | globalize }}
          </template>

          <template v-else>
            {{ 'create-invoice-form.waiting-for-payment-btn' | globalize }}
          </template>
        </button>
      </div>
    </template>

    <no-data-message
      v-else
      :title="'create-invoice-form.no-pairs-message' | globalize"
      :message="'create-invoice-form.here-will-pairs-list' | globalize"
    />
  </div>

  <p v-else-if="isLoadFailed">
    {{ 'create-invoice-form.load-failed-msg' | globalize }}
  </p>

  <load-spinner
    v-else
    :message-id="'create-invoice-form.loading-msg'"
  />
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
// import InvoiceViewer from './components/invoice-viewer'
import VueMarkdown from 'vue-markdown'

import FormMixin from '@/vue/mixins/form.mixin'
import { required, minValue, maxDecimalDigitsCount } from '@validators'

import { initApi, api } from './_api'
import { initConfig, config } from './_config'
import { Wallet, base } from '@tokend/js-sdk'

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { types } from './store/types'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { MathUtil } from '@/js/utils/math.util'

const EVENTS = {
  close: 'close',
}

const EMPTY_FEE = {
  sourceFee: {
    percent: '0.000000',
    fixed: '0.000000',
  },
  destinationFee: {
    percent: '0.000000',
    fixed: '0.000000',
  },
  sourcePaysForDest: true,
}

export default {
  name: 'create-invoice-form',
  components: {
    NoDataMessage,
    LoadSpinner,
    // InvoiceViewer,
    VueMarkdown,
  },
  mixins: [FormMixin],
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
    amount: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      default: '',
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,

    form: {
      amount: '',
      subject: '',
      accountNumber: '',
      quoteAsset: {},
      asset: '',
    },

    isFormSubmitting: false,
    isTransactionSent: false,
    isPaymentConfirmed: false,
    pollIntervalId: 0,

    MIN_AMOUNT: config().MIN_AMOUNT,
    MAX_AMOUNT: config().MAX_AMOUNT,
    DECIMAL_POINTS: config().DECIMAL_POINTS,
  }),

  validations () {
    return {
      form: {
        amount: {
          required,
          minValue: minValue(config().MIN_AMOUNT),
          maxDecimalDigitsCount:
            maxDecimalDigitsCount(config().DECIMAL_POINTS),
        },
        subject: {
          required,
        },
        accountNumber: {
          required,
        },
      },
    }
  },

  computed: {
    ...mapGetters('create-invoice-form', {
      accountId: types.accountId,
      assetPairs: types.assetPairs,
      movements: types.movements,
    }),

    reference () {
      return btoa(Math.random())
    },

    quoteAssets () {
      return this.assetPairs.map(p => p.quoteAsset)
    },

    selectedAssetPair () {
      return this.assetPairs
        .find(p => p.quoteAsset === this.form.quoteAsset)
    },

    totalPrice () {
      return MathUtil.multiply(
        this.selectedAssetPair.price,
        this.form.amount
      )
    },

    systemIdentifier () {
      if (this.form.asset === this.form.quoteAsset.code) {
        return this.config.horizonURL
      } else {
        return this.form.quoteAsset.system
      }
    },

    transactionSubject () {
      const firstLine = `${this.accountId}@${btoa(this.systemIdentifier)}`
      const secondLine = JSON.stringify({
        merchant: config().MERCHANT_NAME,
        subject: this.form.subject,
      })

      return `${firstLine}\n${secondLine}`
    },
  },

  async created () {
    try {
      initApi(this.wallet, this.config)
      initConfig(this.config)

      this.setAccountId(this.wallet.accountId)
      this.populateForm()

      await this.loadAssetPairs({ asset: this.form.asset })

      if (this.assetPairs.length) {
        this.form.quoteAsset = this.assetPairs[0].quoteAsset
      }
      this.isLoaded = true
    } catch (error) {
      this.isLoadFailed = true
      ErrorHandler.process(error)
    }
  },

  destroyed () {
    clearInterval(this.pollIntervalId)
  },

  methods: {
    ...mapMutations('create-invoice-form', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),

    ...mapActions('create-invoice-form', {
      loadAssetPairs: types.LOAD_ASSET_PAIRS,
      loadMovements: types.LOAD_MOVEMENTS,
    }),

    async submit () {
      this.isFormSubmitting = true

      try {
        const loyaltyAccount = config().LOYALTY_ACCOUNTS.find(a => {
          return a.number === this.form.accountNumber &&
            a.system === this.systemIdentifier
        })

        if (!loyaltyAccount) {
          throw new Error('Wrong account number')
        }

        const newWallet = new Wallet(
          this.wallet.email,
          loyaltyAccount.secretSeed,
          loyaltyAccount.accountId
        )
        const newConfig = {
          horizonURL: this.systemIdentifier,
        }

        initApi(newWallet, newConfig)
        initConfig(newConfig)

        const balanceId = await this.getBalanceId(newWallet.accountId)
        const recipient = await this.getRecipient()

        await this.sendTransaction(balanceId, recipient)

        initApi(this.wallet, this.config)
        initConfig(this.config)

        this.isTransactionSent = true
        this.initPolling()
      } catch (error) {
        ErrorHandler.process(error)
      }

      this.isFormSubmitting = false
      this.hideConfirmation()
    },

    async getBalanceId (accountId) {
      const endpoint = `/v3/accounts/${accountId}`
      const { data: account } = await api().getWithSignature(endpoint, {
        include: ['balances.state'],
      })
      const balance = account.balances
        .find(b => b.asset.id === this.form.quoteAsset.code)

      return balance ? balance.id : ''
    },

    async getRecipient () {
      if (this.systemIdentifier === this.config.horizonURL) {
        return this.wallet.accountId
      } else {
        const { data } = await api().get('/')
        return data.adminAccountId
      }
    },

    async sendTransaction (balanceId, recipient) {
      // console.log({
      //   sourceBalanceId: balanceId,
      //   destination: recipient,
      //   amount: this.totalPrice,
      //   feeData: EMPTY_FEE,
      //   subject: this.transactionSubject,
      //   asset: this.form.quoteAsset.code,
      //   reference: this.reference,
      // })

      const operation = base.PaymentBuilder.payment({
        sourceBalanceId: balanceId,
        destination: recipient,
        amount: this.totalPrice,
        feeData: EMPTY_FEE,
        subject: this.transactionSubject,
        asset: this.form.quoteAsset.code,
        reference: this.reference,
      })

      await api().postOperations(operation)
    },

    closeForm () {
      this.$emit(EVENTS.close)
    },

    populateForm () {
      this.form.asset = config().DEFAULT_POINT
      this.form.amount = this.amount
      this.form.subject = this.subject
    },

    initPolling () {
      this.pollIntervalId = setInterval(
        this.checkForPayment,
        config().RELOAD_DATA_TICKER_INTERVAL_MS
      )
    },

    async checkForPayment () {
      try {
        await this.loadMovements(this.form.asset)
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }

      const payment = this.movements
        .find(m => m.reference === this.reference)

      if (payment) {
        clearInterval(this.pollIntervalId)
        this.isPaymentConfirmed = true
        Bus.success('create-invoice-form.payment-successful-msg')
      }
    },
  },
}
</script>

<style lang='scss'>
@import "@/vue/forms/_app-form";

.create-invoice-form__field-description {
  margin-top: 0.7rem;
  opacity: 0.7;
}

.create-invoice-form__asset-pairs {
  margin-top: 4rem;

  .create-invoice-form__table {
    margin-top: 1rem;
  }
}

.create-invoice-form__close-btn {
  margin-top: 4rem;
}

.create-invoice-form__price-wrp {
  margin-top: 2.4rem;
  line-height: 2;
}

.create-invoice-form__price, .create-invoice-form__total-price {
  strong {
    color: $col-text-highlighted;
  }
}

.create-invoice-form__total-price {
  margin-top: 2.4rem;

  p {
    font-size: 1.6rem;
  }
}
</style>
