<template>
  <div v-if="isInitialized">
    <template v-if="assetPairs.length">
      <form
        @submit.prevent="tryToSubmit"
        v-if="!invoiceBlobId"
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
              value: calculateRate(selectedAssetPair.price, form.amount),
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
        <invoice-viewer :invoice="invoiceRecord" />

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
  <loader
    v-else
    :message-id="'create-invoice-form.loading-msg'"
  />
</template>

<script>
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import InvoiceViewer from './components/invoice-viewer'
import VueMarkdown from 'vue-markdown'

import FormMixin from '@/vue/mixins/form.mixin'
import { required, minValue, maxDecimalDigitsCount } from '@validators'

import { initApi } from './_api'
import { Wallet } from '@tokend/js-sdk'
import config from '@/config'
import { Sdk } from '@/sdk'

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { types } from './store/types'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { MathUtil } from '@/js/utils/math.util'
import _get from 'lodash/get'

import { Invoice } from './wrappers/invoice'

const EVENTS = {
  close: 'close',
}

const MIN_AMOUNT = 0.01
const DECIMAL_POINTS = 2

export default {
  name: 'create-invoice-form',
  components: {
    NoDataMessage,
    Loader,
    InvoiceViewer,
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
      required: false,
      default: '',
    },
    subject: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: _ => ({
    MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DECIMAL_POINTS,
    isInitialized: false,
    form: {
      amount: '',
      subject: '',
      accountNumber: '',
      quoteAsset: {},
      merchant: '',
      asset: '',
      account: '',
      system: '',
    },
    invoiceBlobId: '',
    isFormSubmitting: false,
    isPaymentConfirmed: false,
    pollIntervalId: 0,
  }),
  validations () {
    return {
      form: {
        amount: {
          required,
          minValue: minValue(MIN_AMOUNT),
          maxDecimalDigitsCount: maxDecimalDigitsCount(DECIMAL_POINTS),
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
    ...mapGetters('create-invoice-form', [
      types.accountId,
      types.assetPairs,
      types.movements,
    ]),

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

    invoiceRecord () {
      return new Invoice({
        record: this.form,
        blobId: this.invoiceBlobId,
        isConfirmed: this.isPaymentConfirmed,
      })
    },
  },
  async created () {
    try {
      initApi(this.wallet, this.config)

      this.setAccountId(this.wallet.accountId)
      this.setDefaultFormValues()

      await this.loadAssetPairs({ asset: this.form.asset })

      if (this.assetPairs.length) {
        this.form.quoteAsset = this.assetPairs[0].quoteAsset
      }
    } catch (error) {
      // TODO: replace with processWithoutFeedback
      // some text message instead the form should be introduce in this case
      ErrorHandler.process(error)
    }

    this.isInitialized = true
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

    calculateRate (rate, amount) {
      return MathUtil.multiply(rate, amount)
    },

    tryToSubmit () {
      if (!this.isFormValid()) return false
      this.showConfirmation()
    },

    async submit () {
      this.isFormSubmitting = true

      try {
        const data = JSON.stringify({
          ...this.form,
          reference: this.reference,
          accept: this.mapAcceptableAssets(),
        })
        const { data: blob } = await Sdk.api.blobs.create(
          Sdk.api.blobs.types.bravo,
          data
        )

        this.invoiceBlobId = blob.id
        this.initPolling()
      } catch (error) {
        ErrorHandler.process(error)
      }

      this.isFormSubmitting = false
      this.hideConfirmation()
    },

    mapAcceptableAssets () {
      return this.assetPairs.map(item => ({
        asset: item.quoteAsset.id,
        system: _get(item, 'quoteAsset.details.system', this.config.horizonURL),
        amount: this.calculateRate(item.price, this.form.amount),
      }))
    },

    closeForm () {
      this.$emit(EVENTS.close)
    },

    setDefaultFormValues () {
      this.form.merchant = 'Pets shop, Sumska 46'
      this.form.asset = 'PET'
      this.form.account = this.accountId
      this.form.system = config.HORIZON_SERVER
      this.form.amount = this.amount
      this.form.subject = this.subject
    },
    initPolling () {
      this.pollIntervalId = setInterval(
        this.checkForPayment,
        config.RELOAD_DATA_TICKER_INTERVAL_MS
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
