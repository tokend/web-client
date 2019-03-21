<template>
  <div v-if="isInitialized">
    <template v-if="assetPairs.length">
      <form
        @submit.prevent="tryToSubmit"
        v-if="!generatedQRCode"
      >
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
              :step="MINIMAL_NUMBER_INPUT_STEP"
              :error-message="getFieldErrorMessage(
                'form.amount',
                {
                  from: MIN_AMOUNT,
                  to: currentBalance.amount,
                  maxDecimalDigitsCount: DECIMAL_POINTS
                }
              )"
              :disabled="amount || formMixin.isDisabled"
            />

            <div
              v-if="currentBalance"
              class="create-invoice-form__field-description"
            >
              <p>
                {{
                  'create-invoice-form.balance' | globalize({
                    balance: {
                      value: currentBalance.amount,
                      currency: currentBalance.assetCode
                    }
                  })
                }}
              </p>
            </div>
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
        <p class="create-invoice-form__qr-code-description">
          {{ 'create-invoice-form.qr-code-description' | globalize }}
        </p>

        <div class="create-invoice-form__qr-code">
          <qr-code
            :text="generatedQRCode"
            :margin="0"
            :size="250"
            :color-light="'#f2f2f4'"
            :color-dark="'#262626'"
          />
        </div>

        <clipboard-field
          class="create-invoice-form__invoice-url"
          id="invoice-url"
          :value="generatedInvoiceUrl"
          :label="'create-invoice-form.invoice-url' | globalize"
        />

        <button
          v-ripple
          type="button"
          class="create-invoice-form__close-btn app__button-raised"
          :disabled="!isPaymentConfirmed"
          @click="closeForm"
        >
          <template v-if="isPaymentConfirmed">
            {{ 'create-invoice-form.close' | globalize }}
          </template>

          <template v-else>
            {{ 'create-invoice-form.waiting-for-payment' | globalize }}
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
  amountRange,
  maxDecimalDigitsCount,
} from '@validators'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { MathUtil } from '@/js/utils/math.util'
import { types } from './store/types'
import { Sdk } from '@/sdk'
import QrCode from 'vue-qr'
import ClipboardField from '@/vue/fields/ClipboardField'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  close: 'close',
}

const QR_CODE_BASE = 'tokend://loyaltypay?url='
const INVOICE_URL_BASE = 'https://go.tokend.io/loyaltypay?url='
const POLL_INTERVAL = 5000

export default {
  name: 'create-invoice-form',
  components: {
    QrCode,
    NoDataMessage,
    Loader,
    ClipboardField,
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
  },
  data: _ => ({
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DECIMAL_POINTS: config.DECIMAL_POINTS,
    MINIMAL_NUMBER_INPUT_STEP: config.MINIMAL_NUMBER_INPUT_STEP,
    isInitialized: false,
    form: {
      amount: '',
      merchant: '',
      asset: '',
      account: '',
      system: '',
    },
    generatedQRCode: '',
    generatedInvoiceUrl: '',
    isFormSubmitting: false,
    isPaymentConfirmed: false,
    pollIntervalId: 0,
  }),
  validations () {
    return {
      form: {
        amount: {
          required,
          amountRange: amountRange(
            this.MIN_AMOUNT,
            this.currentBalance.amount
          ),
          maxDecimalDigitsCount: maxDecimalDigitsCount(config.DECIMAL_POINTS),
        },
      },
    }
  },
  computed: {
    ...mapGetters('create-invoice-form', [
      types.accountId,
      types.balances,
      types.assetPairs,
      types.movements,
    ]),

    currentBalance () {
      return this.balances.find(item => item.assetCode === this.form.asset)
    },

    reference () {
      return btoa(JSON.stringify({
        asset: this.form.asset,
        amount: this.form.amount,
        date: new Date().toISOString(),
      }))
    },
  },
  async created () {
    try {
      initApi(this.wallet, this.config)

      this.setAccountId(this.wallet.accountId)
      await this.loadBalances()
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
      loadBalances: types.LOAD_BALANCES,
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

        const encodedBlobUrl = encodeURIComponent(
          `${config.HORIZON_SERVER}/accounts/${this.accountId}/blobs/${blob.id}`
        )
        this.generatedQRCode = QR_CODE_BASE + encodedBlobUrl
        this.generatedInvoiceUrl = INVOICE_URL_BASE + encodedBlobUrl

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
        system: item.system || 'some string',
        amount: this.calculateRate(item.price, this.form.amount),
      }))
    },

    closeForm () {
      this.$emit(EVENTS.close)
    },

    setDefaultFormValues () {
      this.form.merchant = 'Pets shop, Sumska 46'
      this.form.asset = 'PET1'
      this.form.account = this.accountId
      this.form.system = config.HORIZON_SERVER
      this.form.amount = this.amount
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
  margin-top: 2.4rem;

  .create-invoice-form__table {
    margin-top: 1rem;
  }
}

.create-invoice-form__close-btn {
  margin-top: 4rem;
}

.create-invoice-form__qr-code-description {
  font-size: 1.6rem;
}

.create-invoice-form__qr-code {
  margin-top: 2.4rem;
  text-align: center;
}

.create-invoice-form__invoice-url {
  margin-top: 3rem;
}
</style>
