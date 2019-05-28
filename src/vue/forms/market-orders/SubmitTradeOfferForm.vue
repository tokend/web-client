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
            :value="offer.baseAsset.id"
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
          :min="config.MIN_AMOUNT"
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          :label="
            'submit-trade-offer-form.price-lbl' | globalize({
              baseAsset: assetPair.base,
              quoteAsset: assetPair.quote,
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
          type="number"
          :min="config.MIN_AMOUNT"
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          name="submit-trade-offer-base-amount"
          :label="'submit-trade-offer-form.base-amount-lbl' | globalize({
            asset: assetPair.base
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
        <readonly-field
          :label="
            'submit-trade-offer-form.total-amount-lbl' | globalize({
              asset: assetPair.quote
            })
          "
          :value="{
            value: quoteAmount,
            currency: assetPair.quote,
          } | formatMoney"
          :error-message="getFieldErrorMessage(
            'quoteAmount',
            {
              available: isBuy ? quoteAssetBalance : baseAssetBalance,
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
            }
          )"
        />
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
          :disabled="formMixin.isDisabled"
        >
          <template v-if="isBuy">
            {{ 'submit-trade-offer-form.buy-btn' | globalize }}
          </template>

          <template v-else>
            {{ 'submit-trade-offer-form.sell-btn' | globalize }}
          </template>
        </button>
      </div>
    </template>
  </form>
</template>

<script>
import ReadonlyField from '@/vue/fields/ReadonlyField'

import FormMixin from '@/vue/mixins/form.mixin'
import OfferManagerMixin from '@/vue/mixins/offer-manager.mixin'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { MathUtil } from '@/js/utils/math.util'
import config from '@/config'

import {
  required,
  amountRange,
  noMoreThanAvailableOnBalance,
  decimal,
} from '@validators'

const EVENTS = {
  offerSubmitted: 'offer-submitted',
}

export default {
  name: 'submit-trade-offer-form',
  components: { ReadonlyField },
  mixins: [
    FormMixin,
    OfferManagerMixin,
  ],

  props: {
    assetPair: { type: Object, required: true },
    isBuy: { type: Boolean, default: false },
    offer: { type: Object, required: true },
  },

  data: () => ({
    form: {
      price: '',
      baseAmount: '',
    },
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
          noMoreThanAvailableOnBalance: this.isBuy ||
            noMoreThanAvailableOnBalance(this.baseAssetBalance),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
      },

      quoteAmount: {
        noMoreThanAvailableOnBalance: !this.isBuy ||
          noMoreThanAvailableOnBalance(this.quoteAssetBalance),
        amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
      },
    }
  },

  computed: {
    baseAssetLabelTranslationId () {
      return this.isBuy
        ? 'submit-trade-offer-form.asset-to-buy-lbl'
        : 'submit-trade-offer-form.asset-to-sell-lbl'
    },

    baseAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset === this.assetPair.base)
      return balanceItem ? balanceItem.balance : ''
    },

    quoteAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset === this.assetPair.quote)
      return balanceItem ? balanceItem.balance : ''
    },

    quoteAmount () {
      if (this.form.price && this.form.baseAmount) {
        return MathUtil.multiply(this.form.price, this.form.baseAmount)
      } else {
        return ''
      }
    },

    createOfferOpts () {
      return {
        pair: {
          base: this.assetPair.base,
          quote: this.assetPair.quote,
        },
        baseAmount: this.form.baseAmount,
        quoteAmount: this.quoteAmount,
        price: this.form.price,
        isBuy: this.isBuy,
      }
    },
  },

  async created () {
    try {
      await this.loadBalances()
      this.populateForm()
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    populateForm () {
      this.form.price = this.offer.price
      this.form.baseAmount = this.offer.baseAmount
    },

    async submit () {
      this.isOfferSubmitting = true
      try {
        await this.createOffer(this.createOfferOpts)

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
</style>
