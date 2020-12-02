<template>
  <div class="issuance-form">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <p>
          {{ 'issuance-form.load-failed-msg' | globalize }}
        </p>
      </template>

      <template v-else>
        <template v-if="ownedAssets.length">
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
                  @change="former.setAttr('assetCode', form.asset.code)"
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
                    :step="config.MIN_AMOUNT"
                    v-model="form.amount"
                    @blur="touchField('form.amount')"
                    @change="former.setAttr('amount', form.amount)"
                    name="create-issuance-amount"
                    :label="'issuance-form.amount-lbl' | globalize"
                    :error-message="getFieldErrorMessage(
                      'form.amount',
                      {
                        from: config.MIN_AMOUNT,
                        to: form.asset.availableForIssuance,
                        maxDecimalDigitsCount: config.DECIMAL_POINTS
                      }
                    )"
                    :disabled="formMixin.isDisabled || !availableForIssuance"
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
                  :class="{'app__form-field-description--error':
                    !availableForIssuance}"
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
                  @change="former.setAttr('receiver', form.receiver)"
                  name="create-issuance-receiver"
                  :label="'issuance-form.receiver-lbl' | globalize"
                  :error-message="getFieldErrorMessage('form.receiver')"
                  :disabled="formMixin.isDisabled || !availableForIssuance"
                />
              </div>
            </div>

            <div class="app__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  v-model="form.reference"
                  @blur="touchField('form.reference')"
                  @change="former.setAttr('reference', form.reference)"
                  name="create-issuance-reference"
                  :error-message="getFieldErrorMessage(
                    'form.reference',
                    { length: REFERENCE_MAX_LENGTH }
                  )"
                  :label="'issuance-form.reference-lbl' | globalize"
                  :maxlength="REFERENCE_MAX_LENGTH"
                  :disabled="formMixin.isDisabled || !availableForIssuance"
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
                :disabled="formMixin.isDisabled || !isFeesLoaded ||
                  !availableForIssuance"
              >
                {{ 'issuance-form.issue-btn' | globalize }}
              </button>
            </div>
          </form>
        </template>

        <template v-else>
          <no-data-message
            icon-name="alert-circle"
            :title="'issuance-form.no-owned-assets-title' | globalize"
            :message="'issuance-form.no-owned-assets-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <issuance-form-skeleton-loader />
    </template>
  </div>
</template>

<script>
import IssuanceFormSkeletonLoader from './IssuanceFormSceletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import Loader from '@/vue/common/Loader'
import FeesRenderer from '@/vue/common/fees/FeesRenderer'
import ReadonlyField from '@/vue/fields/ReadonlyField'
import FormMixin from '@/vue/mixins/form.mixin'
import FeesMixin from '@/vue/common/fees/fees.mixin'
import config from '@/config'
import { api } from '@/api'
import { MathUtil } from '@/js/utils'
import { BigNumber } from 'bignumber.js'
import { Bus } from '@/js/helpers/event-bus'
import {
  required,
  amount,
  amountRange,
  emailOrAccountId,
  maxLength,
  maxDecimalDigitsCount,
} from '@validators'
import { IssuanceFormer } from '@/js/formers/IssuanceFormer'

const REFERENCE_MAX_LENGTH = 64
const EVENTS = {
  issuanceCreated: 'issuance-created',
}
const FEES_LOADING_DELAY_MS = 300

export default {
  name: 'issuance-form',
  components: {
    NoDataMessage,
    IssuanceFormSkeletonLoader,
    Loader,
    FeesRenderer,
    ReadonlyField,
  },
  mixins: [FormMixin, FeesMixin],
  props: {
    former: { type: IssuanceFormer, default: () => new IssuanceFormer() },
  },
  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    EVENTS,
    form: {
      asset: {
        availableForIssuance: 0,
      },
      amount: '0',
      receiver: '',
      reference: '',
    },
    fees: {},
    feesDebouncedRequest: null,
    isFeesLoaded: false,
    isFormSubmitting: false,
    REFERENCE_MAX_LENGTH,
    config,
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
      ownedAssets: vuexTypes.ownedAssets,
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
    availableForIssuance () {
      const nums = new BigNumber(this.form.asset.availableForIssuance).c
      return nums[0] || nums[1] || 0
    },
  },
  watch: {
    'form.amount' () {
      this.former.setAttr('amount', this.form.amount || '0')
      this.tryLoadFees()
    },
    'form.asset.code' () {
      this.former.setAttr('assetCode', this.form.asset.code)
      this.tryLoadFees()
    },
  },
  async created () {
    try {
      this.isLoaded = true

      if (this.ownedAssets.length) {
        this.form.asset = this.ownedAssets[0]
        this.former.setAttr('assetCode', this.form.asset.code)
        this.former.setAttr('amount', this.form.amount || '0')
      }

      await this.loadFees()
    } catch (error) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },
  methods: {
    setAssetByCode (code) {
      this.form.asset = this.ownedAssets
        .find(item => item.code === code)
    },
    tryLoadFees () {
      this.isFeesLoaded = false
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
        this.fees = await this.former.calculateFees(this.accountId)
        this.isFeesLoaded = true
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
    async submit () {
      this.isFormSubmitting = true
      try {
        const operation = await this.former.buildOps()
        await api.postOperations(operation)
        Bus.success('issuance-form.assets-issued-msg')
        this.$emit(EVENTS.issuanceCreated)
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
@import '~@scss/variables';

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
  color: $col-text;
}
</style>
