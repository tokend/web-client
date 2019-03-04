<template>
  <div>
    <form @submit.prevent="tryToSubmit" v-if="!generatedQRCode">
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
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
      <div
        class="create-invoice-form__table
              app__table
              app__table--with-shadow"
      >
        <table>
          <thead>
            <tr>
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
              v-for="(item, i) in ACCEPTABLE_ASSETS"
              :key="`create-invoice-table-row-${i}`"
            >
              <td>
                {{ item.rate | formatNumber }}
              </td>
              <td>
                {{ calculateRate(item.rate, form.amount) | formatNumber }}
              </td>
            </tr>
          </tbody>
        </table>
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
          :disabled="!form.amount || formMixin.isDisabled"
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
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { ErrorHandler } from '@/js/helpers/error-handler'
import config from '@/config'
import {
  required,
  amountRange,
  maxDecimalDigitsCount,
} from '@validators'
import { mapGetters } from 'vuex'
import { MathUtil } from '@/js/utils/math.util'
import { types } from '../store/types'
import { Sdk } from '@/sdk'
import QrCode from 'vue-qr'

const ACCEPTABLE_ASSETS = [
  {
    asset: 'SPOINT',
    account: 'GDA3SCPLGNMXAARU5XXHNIUCHG554TESWZOKQZL4EOY2HPJRPLMW7VEB',
    rate: '105',
    system: 'https://api.shoeshop.tokend.io',
  },
  {
    asset: 'GCOIN',
    account: 'GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636',
    rate: '25',
    system: 'https://api.gasstation.tokend.io',
  },
]

const EVENTS = {
  close: 'close',
}

export default {
  name: 'create-invoice-form',
  components: {
    QrCode,
  },
  mixins: [FormMixin],
  data: _ => ({
    ACCEPTABLE_ASSETS,
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DECIMAL_POINTS: config.DECIMAL_POINTS,
    MINIMAL_NUMBER_INPUT_STEP: config.MINIMAL_NUMBER_INPUT_STEP,
    form: {
      merchant: 'Shoe shop, Sumska 46',
      asset: 'GASCOINS',
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
      },
    }
  },
  computed: {
    ...mapGetters('loyalty-points', [
      types.balances,
    ]),
    balancesAssetsCodes () {
      return this.balances.map(item => item.assetCode)
    },
  },
  methods: {
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
          accept: this.formatAcceptableAssetsToUpload(),
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
    formatAcceptableAssetsToUpload () {
      return this.ACCEPTABLE_ASSETS.map(item => ({
        ...item,
        amount: this.calculateRate(item.rate, this.form.amount),
      }))
    },
    closeForm () {
      this.$emit(EVENTS.close)
    },
  },
}
</script>

<style lang='scss' scoped>
@import '@/vue/forms/_app-form';

.create-invoice-form__table {
  margin-top: 2.4rem;
}

.create-invoice-form__close-btn {
  margin-top: 2.4rem;
}
</style>
