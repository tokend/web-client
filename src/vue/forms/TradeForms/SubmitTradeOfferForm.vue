<template>
  <form
    v-if="isLoaded"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <div class="app__form-field">
          <readonly-field
            :label="baseAssetLabelTranslationId | globalize"
            :value="former.attrs.baseAssetCode"
          />
        </div>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          name="submit-trade-offer-price"
          type="number"
          :min="0"
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          :label="
            'submit-trade-offer-form.price-lbl' | globalize({
              baseAsset: former.attrs.baseAssetCode,
              quoteAsset: former.attrs.quoteAssetCode,
            })
          "
          :error-message="getFieldErrorMessage(
            'form.price', {
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
              available: quoteAssetBalance
            }
          )"
          @blur="touchField('form.price')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.baseAmount"
          name="submit-trade-offer-base-amount"
          type="number"
          :min="0"
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          :label="'submit-trade-offer-form.base-amount-lbl' | globalize({
            asset: former.attrs.baseAssetCode
          })"
          :error-message="getFieldErrorMessage(
            'form.baseAmount',
            {
              available: baseAssetBalance,
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
            }
          )"
          @blur="touchField('form.baseAmount')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <template v-if="isFeesLoaded">
          <readonly-field
            :label="
              'submit-trade-offer-form.total-amount-lbl' | globalize({
                asset: former.attrs.quoteAssetCode
              })
            "
            :value="{
              value: quoteAmount,
              currency: former.attrs.quoteAssetCode,
            } | formatMoney"
            :error-message="getFieldErrorMessage(
              'quoteAmount',
              {
                available: former.attrs.isBuy ?
                  quoteAssetBalance : baseAssetBalance,
                from: config.MIN_AMOUNT,
                to: config.MAX_AMOUNT,
              }
            )"
          />

          <fees-renderer
            class="submit-trade-offer-form__fees"
            :fees-collection="fees"
          />
        </template>

        <template v-else>
          <loader message-id="submit-trade-offer-form.loading-msg" />
        </template>
      </div>
    </div>

    <template v-if="formMixin.isConfirmationShown">
      <form-confirmation
        class="app__form-confirmation"
        :is-pending="isOfferSubmitting"
        @ok="submit"
        @cancel="hideConfirmation"
      />
    </template>

    <template v-else>
      <div class="app__form-actions">
        <button
          v-ripple
          class="app__button-raised submit-trade-offer-form__btn"
          type="submit"
          :disabled="formMixin.isDisabled || !isFeesLoaded"
        >
          <template v-if="former.attrs.isBuy">
            {{ 'submit-trade-offer-form.buy-btn' | globalize }}
          </template>

          <template v-else>
            {{ 'submit-trade-offer-form.sell-btn' | globalize }}
          </template>
        </button>
      </div>
    </template>
  </form>

  <loader
    v-else
    message-id="submit-trade-offer-form.loading-msg" />
</template>

<script>
import debounce from 'lodash/debounce'

import ReadonlyField from '@/vue/fields/ReadonlyField'
import FeesRenderer from '@/vue/common/fees/FeesRenderer'
import Loader from '@/vue/common/Loader'

import FormMixin from '@/vue/mixins/form.mixin'

import { TradeFormer } from '@/js/formers/TradeFormer'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

import { MathUtil } from '@/js/utils/math.util'
import config from '@/config'
import { api } from '@/api'

import {
  required,
  amountRange,
  maxValueBig,
  decimal,
} from '@validators'

const EVENTS = {
  offerSubmitted: 'offer-submitted',
}

const FEES_LOADING_DELAY_MS = 300

export default {
  name: 'submit-trade-offer-form',
  components: {
    ReadonlyField,
    FeesRenderer,
    Loader,
  },
  mixins: [
    FormMixin,
  ],

  props: {
    former: { type: TradeFormer, default: () => new TradeFormer() },
  },

  data: () => ({
    form: {
      price: '',
      baseAmount: '',
    },
    fees: {},
    feesDebouncedRequest: null,
    isFeesLoaded: false,
    isFeesLoadFailed: false,
    isLoaded: false,
    isOfferSubmitting: false,
    config,
  }),

  validations () {
    return {
      form: {
        price: {
          required,
          decimal,
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
        baseAmount: {
          required,
          decimal,
          noMoreThanAvailableOnBalance: this.former.attrs.isBuy ||
            maxValueBig(this.baseAssetBalance),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
      },

      quoteAmount: {
        noMoreThanAvailableOnBalance: !this.former.attrs.isBuy ||
          maxValueBig(this.quoteAssetBalance),
        amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
      },
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),
    baseAssetLabelTranslationId () {
      return this.former.attrs.isBuy
        ? 'submit-trade-offer-form.asset-to-buy-lbl'
        : 'submit-trade-offer-form.asset-to-sell-lbl'
    },

    baseAssetBalance () {
      const balanceItem =
        this.accountBalanceByCode(this.former.attrs.baseAssetCode)
      return balanceItem ? balanceItem.balance : ''
    },

    quoteAssetBalance () {
      const balanceItem =
        this.accountBalanceByCode(this.former.attrs.quoteAssetCode)
      return balanceItem ? balanceItem.balance : ''
    },

    quoteAmount () {
      if (this.form.price && this.form.baseAmount) {
        let amount = MathUtil.multiply(this.form.price, this.form.baseAmount)
        this.former.setAttr('quoteAmount', amount)
        return amount
      } else {
        return ''
      }
    },
  },

  watch: {
    'form.baseAmount' () {
      this.former.setAttr('baseAmount', this.form.baseAmount)
      this.tryLoadFees()
    },

    'form.price' () {
      this.tryLoadFees()
    },
  },

  async created () {
    try {
      this.former.setAttr('creatorAccountId', this.accountId)
      this.former.setAttr('baseBalanceId',
        this.accountBalanceByCode(this.former.attrs.baseAssetCode).id)
      this.former.setAttr('quoteBalanceId',
        this.accountBalanceByCode(this.former.attrs.quoteAssetCode).id)

      this.form.baseAmount = this.former.attrs.baseAmount
      this.form.price = String(MathUtil.divide(
        +this.former.attrs.quoteAmount,
        +this.former.attrs.baseAmount
      ))
      await this.loadBalances()
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
      createBalance: vuexTypes.CREATE_BALANCE,
    }),

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
        this.fees = await this.former.calculateFees()

        this.isFeesLoaded = true
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async submit () {
      this.isOfferSubmitting = true
      try {
        await this.createBalance([
          this.former.attrs.baseAssetCode,
          this.former.attrs.quoteAssetCode,
        ])

        this.former.setAttr('baseBalanceId',
          this.accountBalanceByCode(this.former.attrs.baseAssetCode).id)
        this.former.setAttr('quoteBalanceId',
          this.accountBalanceByCode(this.former.attrs.quoteAssetCode).id)

        const operation = await this.former.buildOpCreate()
        await api.postOperations(operation)
        Bus.success('submit-trade-offer-form.order-submitted-msg')
        this.$emit(EVENTS.offerSubmitted)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isOfferSubmitting = false
      this.hideConfirmation()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../app-form';

.submit-trade-offer-form__btn {
  max-width: 14rem;
  width: 100%;
}

.submit-trade-offer-form__fees {
  margin-top: 1rem;
}
</style>
