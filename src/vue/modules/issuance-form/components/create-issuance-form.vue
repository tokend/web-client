<template>
  <form
    novalidate
    class="app__form create-issuance-form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          :value="form.asset.code"
          @input="setAssetByCode"
          name="create-issuance-asset"
          :label="'issuance-form.asset-lbl' | globalize"
          @blur="touchField('form.asset')"
          :disabled="formMixin.isDisabled"
        >
          <option
            v-for="asset in ownedAssets"
            :key="asset.code"
            :value="asset.code"
          >
            {{ asset.nameAndCode }}
          </option>
        </select-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <div class="create-issuance-form__amount-wrapper">
          <input-field
            white-autofill
            type="number"
            :min="0"
            :max="form.asset.availableForIssuance"
            :step="MIN_AMOUNT"
            v-model="form.amount"
            @blur="touchField('form.amount')"
            name="create-issuance-amount"
            :label="'issuance-form.amount-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.amount',
              {
                from: MIN_AMOUNT,
                to: form.asset.availableForIssuance,
                maxDecimalDigitsCount: DECIMAL_POINTS
              }
            )"
            :disabled="formMixin.isDisabled"
          />

          <p
            v-if="form.asset.code"
            class="create-issuance-form__issuance-asset-code"
          >
            {{ form.asset.code }}
          </p>
        </div>

        <p
          v-if="form.asset.availableForIssuance"
          class="app__form-field-description"
        >
          {{
            'issuance-form.available-for-issuance-hint' | globalize({
              amount: {
                value: form.asset.availableForIssuance,
                currency: form.asset.code
              }
            })
          }}
        </p>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.receiver"
          @blur="touchField('form.receiver')"
          name="create-issuance-receiver"
          :label="'issuance-form.receiver-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.receiver')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.reference"
          @blur="touchField('form.reference')"
          name="create-issuance-reference"
          :error-message="getFieldErrorMessage(
            'form.reference',
            { length: REFERENCE_MAX_LENGTH }
          )"
          :label="'issuance-form.reference-lbl' | globalize"
          :maxlength="REFERENCE_MAX_LENGTH"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row create-issuance-form__total">
      <template v-if="isFeesLoaded">
        <fees-renderer :fees-collection="fees" />

        <readonly-field
          :label="'issuance-form.amount-to-receive-msg' | globalize"
          :value="receivingAmount | formatMoney"
          :error-message="getFieldErrorMessage('receivingAmount.value')"
        />
      </template>

      <template v-else>
        <loader message-id="issuance-form.loading-msg" />
      </template>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown && isFeesLoaded"
        :is-pending="isFormSubmitting"
        @ok="submit"
        @cancel="hideConfirmation"
      />

      <button
        v-else
        v-ripple
        class="create-issuance-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled || !isFeesLoaded"
      >
        {{ 'issuance-form.issue-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import debounce from 'lodash/debounce'

import Loader from '@/vue/common/Loader'
import FeesRenderer from '@/vue/common/fees/FeesRenderer'
import ReadonlyField from '@/vue/fields/ReadonlyField'

import FormMixin from '@/vue/mixins/form.mixin'
import ManageIssuanceMixin from '../mixins/manage-issuance.mixin'
import FeesMixin from '@/vue/common/fees/fees.mixin'

import config from '@/config'
import { FEE_TYPES } from '@tokend/js-sdk'
import { MathUtil } from '@/js/utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import {
  required,
  amount,
  amountRange,
  emailOrAccountId,
  maxLength,
  maxDecimalDigitsCount,
} from '@validators'

const REFERENCE_MAX_LENGTH = 255
const EVENTS = {
  submit: 'submit',
}

const FEES_LOADING_DELAY_MS = 300

export default {
  name: 'create-issuance-form',
  components: {
    Loader,
    FeesRenderer,
    ReadonlyField,
  },
  mixins: [FormMixin, ManageIssuanceMixin, FeesMixin],

  props: {
    ownedAssets: { type: Array, required: true },
  },

  data: _ => ({
    form: {
      asset: {},
      amount: '0',
      receiver: '',
      reference: '',
    },
    fees: {},
    feesDebouncedRequest: null,
    isFeesLoaded: false,
    isFeesLoadFailed: false,
    isFormSubmitting: false,
    MIN_AMOUNT: config.MIN_AMOUNT,
    DECIMAL_POINTS: config.DECIMAL_POINTS,
    REFERENCE_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          amountRange: amountRange(
            config.MIN_AMOUNT,
            this.form.asset.availableForIssuance
          ),
          maxDecimalDigitsCount: maxDecimalDigitsCount(config.DECIMAL_POINTS),
        },
        receiver: { required, emailOrAccountId },
        reference: {
          required,
          maxLength: maxLength(REFERENCE_MAX_LENGTH),
        },
      },
      receivingAmount: {
        value: { amount },
      },
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),

    receivingAmount () {
      const fees = MathUtil.add(
        this.fees.totalFee.fixed,
        this.fees.totalFee.calculatedPercent
      )

      return {
        value: MathUtil.subtract(this.form.amount, fees),
        currency: this.form.asset.code,
      }
    },
  },

  watch: {
    'form.amount' (value) {
      this.tryLoadFees()
    },

    'form.asset.code' () {
      this.tryLoadFees()
    },
  },

  async created () {
    if ((this.ownedAssets || []).length) {
      this.form.asset = this.ownedAssets[0]
    }

    await this.loadFees()
  },

  methods: {
    setAssetByCode (code) {
      this.form.asset = this.ownedAssets
        .find(item => item.code === code)
    },
    tryLoadFees () {
      this.isFeesLoaded = false
      this.isFeesLoadFailed = false

      if (!this.feesDebouncedRequest) {
        this.feesDebouncedRequest = debounce(
          () => this.loadFees(),
          FEES_LOADING_DELAY_MS
        )
      }
      return this.feesDebouncedRequest()
    },

    async loadFees () {
      try {
        this.fees = await this.calculateFees({
          assetCode: this.form.asset.code,
          amount: this.form.amount || 0,
          senderAccountId: this.accountId,
          type: FEE_TYPES.issuanceFee,
        })

        this.isFeesLoaded = true
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async submit () {
      this.isFormSubmitting = true
      try {
        await this.createIssuance()
        Bus.success('issuance-form.assets-issued-msg')
        this.$emit(EVENTS.submit)
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.isFormSubmitting = false
      this.hideConfirmation()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.create-issuance-form__submit-btn {
  max-width: 18rem;
  width: 100%;
}

.create-issuance-form__amount-wrapper {
  display: flex;
}

.create-issuance-form__issuance-asset-code {
  margin-left: 1rem;
  padding-top: 1.8rem;
  font-size: 1.8rem;
}

.create-issuance-form__total {
  flex-direction: column;
}

.create-issuance-form__receiving {
  display: flex;
  justify-content: space-between;
}

.create-issuance-form__receiving-msg {
  font-size: 1.6rem;
}
</style>
