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
                  to: MAX_AMOUNT,
                  maxDecimalDigitsCount: DECIMAL_POINTS
                }
              )"
              :disabled="amount || formMixin.isDisabled"
            />
          </div>
        </div>
        <div
          class="create-invoice-form__table
                    app__table
                    app__table--with-shadow">
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

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.reference"
              @blur="touchField('form.reference')"
              name="create-invoice-reference"
              :label="'create-invoice-form.reference-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.reference')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="app__form-actions">
          <form-confirmation
            v-if="formMixin.isConfirmationShown"
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

      <div v-else>
        <qr-code
          :text="generatedQRCode"
          :margin="0"
          :size="375"
          :color-light="'#f2f2f4'"
          :color-dark="'#262626'"
        />

        <button
          v-ripple
          type="button"
          class="create-invoice-form__close-btn app__button-raised"
          :disabled="formMixin.isDisabled"
          @click="closeForm"
        >
          {{ 'create-invoice-form.close' | globalize }}
        </button>
      </div>
    </template>

    <no-data-message
      v-else
      :title-id="'create-invoice-form.no-pairs-message'"
      :message-id="'create-invoice-form.here-will-pairs-list'"
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
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

const EVENTS = {
  close: 'close',
}

export default {
  name: 'create-invoice-form',
  components: {
    QrCode,
    NoDataMessage,
    Loader,
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
      reference: '',
      amount: '',
    },
    generatedQRCode: '',
  }),
  validations () {
    return {
      form: {
        amount: {
          required,
          amountRange: amountRange(
            this.MIN_AMOUNT,
            this.MAX_AMOUNT
          ),
          maxDecimalDigitsCount: maxDecimalDigitsCount(config.DECIMAL_POINTS),
        },
        reference: {
          required,
        },
      },
    }
  },
  computed: {
    ...mapGetters('create-invoice-form', [
      types.accountId,
      types.balances,
      types.assetPairs,
    ]),
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
  methods: {
    ...mapMutations('create-invoice-form', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),

    ...mapActions('create-invoice-form', {
      loadAssetPairs: types.LOAD_ASSET_PAIRS,
      loadBalances: types.LOAD_BALANCES,
    }),

    calculateRate (rate, amount) {
      return MathUtil.multiply(rate, amount)
    },

    tryToSubmit () {
      if (!this.isFormValid()) return false
      this.showConfirmation()
    },

    async submit () {
      try {
        const data = JSON.stringify({
          ...this.form,
          accept: this.mapAcceptableAssets(),
        })
        const { data: blob } = await Sdk.api.blobs.create(
          Sdk.api.blobs.types.bravo,
          data
        )
        this.generatedQRCode = blob.id
      } catch (error) {
        ErrorHandler.process(error)
      }

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
      this.form.system = document.location.origin
      this.form.amount = this.amount
    },
  },
}
</script>

<style lang='scss' scoped>
@import "@/vue/forms/_app-form";

.create-invoice-form__table {
  margin-top: 2.4rem;
}

.create-invoice-form__close-btn {
  margin-top: 2.4rem;
}
</style>
