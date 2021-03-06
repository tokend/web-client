<template>
  <form
    v-if="isLoaded"
    @submit.prevent="tryToSubmit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <readonly-field
          :label="baseAssetLabelTranslationId | globalize"
          :value="former.attrs.baseAssetCode"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          name="your-trade-offer-price"
          type="number"
          :min="0"
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          :label="
            'your-trade-offer-form.price-lbl' | globalize({
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
          name="your-trade-offer-base-amount"
          type="number"
          :min="0"
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          :label="'your-trade-offer-form.base-amount-lbl' | globalize({
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
          @blur="touchField('form.amount')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <template v-if="isFeesLoaded">
          <readonly-field
            :label="
              'your-trade-offer-form.total-amount-lbl' | globalize({
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
                available: quoteAssetBalance,
                from: config.MIN_AMOUNT,
                to: config.MAX_AMOUNT,
              }
            )"
          />

          <fees-renderer
            class="your-trade-offer-form__fees"
            :fees-collection="fees"
          />
        </template>

        <template v-else>
          <loader message-id="your-trade-offer-form.loading-msg" />
        </template>
      </div>
    </div>

    <template v-if="formMixin.isConfirmationShown">
      <form-confirmation
        class="app__form-confirmation"
        :is-pending="isFormSubmitting"
        @ok="submit"
        @cancel="hideConfirmation"
      />
    </template>

    <template v-else>
      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          @click="setUpdateSubmitMode"
          class="app__button-raised your-trade-offer-form__btn"
          :disabled="formMixin.isDisabled || !isFeesLoaded"
        >
          {{ 'your-trade-offer-form.update-order-btn' | globalize }}
        </button>

        <button
          v-ripple
          type="submit"
          @click="setCancelSubmitMode"
          class="app__button-flat your-trade-offer-form__btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'your-trade-offer-form.cancel-order-btn' | globalize }}
        </button>
      </div>
    </template>
  </form>

  <loader
    v-else
    message-id="your-trade-offer-form.loading-msg" />
</template>

<script>
import debounce from 'lodash/debounce'

import ReadonlyField from '@/vue/fields/ReadonlyField'
import FeesRenderer from '@/vue/common/fees/FeesRenderer'
import Loader from '@/vue/common/Loader'

import FormMixin from '@/vue/mixins/form.mixin'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { TradeFormer } from '@/js/formers/TradeFormer'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { buildOpCancel } from '@/js/helpers/trade-helper'

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
  offerCanceled: 'offer-canceled',
  offerUpdated: 'offer-updated',
}

const SUBMIT_MODES = {
  cancel: 'cancel',
  update: 'update',
}

const FEES_LOADING_DELAY_MS = 300

export default {
  name: 'your-trade-offer-form',
  components: {
    ReadonlyField,
    FeesRenderer,
    Loader,
  },
  mixins: [
    FormMixin,
  ],

  props: {
    offer: { type: Object, required: true },
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
    submitMode: '',
    isFormSubmitting: false,
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
          noMoreThanAvailableOnBalance: this.offer.isBuy ||
            maxValueBig(this.baseAssetBalance),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
      },

      quoteAmount: {
        noMoreThanAvailableOnBalance: !this.offer.isBuy ||
          maxValueBig(this.quoteAssetBalance),
        amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
      },
    }
  },

  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
      accountId: vuexTypes.accountId,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),

    baseAssetLabelTranslationId () {
      return this.offer.isBuy
        ? 'your-trade-offer-form.asset-to-buy-lbl'
        : 'your-trade-offer-form.asset-to-sell-lbl'
    },

    accountAssets () {
      return this.accountBalances
        .map(balance => balance.asset.code)
        .filter(asset => asset !== this.former.attrs.quoteAssetCode)
    },

    baseAssetBalance () {
      const balanceItem =
        this.accountBalanceByCode(this.former.attrs.baseAssetCode)
      if (balanceItem) {
        return this.offer.isBuy
          ? balanceItem.balance
          : MathUtil.add(balanceItem.balance, this.former.attrs.baseAmount)
      } else {
        return ''
      }
    },

    quoteAssetBalance () {
      const balanceItem =
        this.accountBalanceByCode(this.former.attrs.quoteAssetCode)

      if (balanceItem) {
        return this.offer.isBuy
          ? balanceItem.balance
          : MathUtil.add(balanceItem.balance, this.former.attrs.quoteAmount)
      } else {
        return ''
      }
    },

    quoteAmount () {
      if (this.form.price && this.form.baseAmount) {
        let quoteAmount = MathUtil.multiply(
          this.form.price,
          this.form.baseAmount
        )
        this.former.setAttr('quoteAmount', quoteAmount)
        return quoteAmount
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

    setUpdateSubmitMode () {
      this.submitMode = SUBMIT_MODES.update
    },

    setCancelSubmitMode () {
      this.submitMode = SUBMIT_MODES.cancel
    },

    async submit () {
      this.isFormSubmitting = true
      try {
        switch (this.submitMode) {
          case SUBMIT_MODES.cancel:
            const opCancel = buildOpCancel(this.offer)
            await api.postOperations(opCancel)
            Bus.success('your-trade-offer-form.order-canceled-msg')
            this.$emit(EVENTS.offerCanceled)

            break
          case SUBMIT_MODES.update:
            const opCancelOp = buildOpCancel(this.offer)
            const opCreateOp = await this.former.buildOpCreate()
            await api.postOperations(opCancelOp, opCreateOp)
            Bus.success('your-trade-offer-form.order-updated-msg')
            this.$emit(EVENTS.offerUpdated)

            break
        }
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.isFormSubmitting = false
      this.hideConfirmation()
    },

    tryToSubmit () {
      if (this.submitMode === SUBMIT_MODES.update && !this.isFormValid()) return
      this.showConfirmation()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../app-form';

.your-trade-offer-form__btn {
  max-width: 16rem;
  width: 100%;
}

.your-trade-offer-form__fees {
  margin-top: 1rem;
}
</style>
