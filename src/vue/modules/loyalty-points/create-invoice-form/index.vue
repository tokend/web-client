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
              v-model="form.subject"
              @blur="touchField('form.subject')"
              name="create-invoice-subject"
              :label="'create-invoice-form.subject-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.subject')"
              :disabled="subject || formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="create-invoice-form__asset-pairs">
          <h3>
            {{ 'create-invoice-form.acceptable-asset-pairs-title' | globalize }}
          </h3>

          <div
            class="app__table
                   app__table--with-shadow
                   create-invoice-form__table"
          >
            <table>
              <thead>
                <tr>
                  <th>
                    {{ 'create-invoice-form.asset' | globalize }}
                  </th>
                  <th>
                    {{ 'create-invoice-form.price' | globalize }}
                  </th>
                  <th>
                    {{ 'create-invoice-form.total-amount' | globalize }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, i) in assetPairs"
                  :key="`create-invoice-table-row-${i}`"
                >
                  <td>
                    {{ item.quoteAsset.id }}
                  </td>
                  <td>
                    {{ item.price | formatNumber }}
                  </td>
                  <td>
                    {{ calculateRate(item.price, form.amount) | formatNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

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
import { initApi } from './_api'
import { Wallet } from '@tokend/js-sdk'
import FormMixin from '@/vue/mixins/form.mixin'
import { ErrorHandler } from '@/js/helpers/error-handler'
import config from '@/config'
import {
  required,
  minValue,
  maxDecimalDigitsCount,
} from '@validators'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { MathUtil } from '@/js/utils/math.util'
import { types } from './store/types'
import { Sdk } from '@/sdk'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import InvoiceViewer from './components/invoice-viewer'
import { Bus } from '@/js/helpers/event-bus'
import _get from 'lodash/get'
import { Invoice } from './wrappers/invoice'

const EVENTS = {
  close: 'close',
}

const POLL_INTERVAL = 5000

const MIN_AMOUNT = 0.01
const DECIMAL_POINTS = 2

export default {
  name: 'create-invoice-form',
  components: {
    NoDataMessage,
    Loader,
    InvoiceViewer,
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
        subject: {
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
      this.pollIntervalId = setInterval(this.checkForPayment, POLL_INTERVAL)
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

<style lang='scss' scoped>
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
</style>
