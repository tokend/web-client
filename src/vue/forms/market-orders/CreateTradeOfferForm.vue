<template>
  <form
    v-if="isLoaded"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          :values="accountAssets"
          v-model="form.asset"
          name="trade-offer-base-asset"
          :disabled="formMixin.isDisabled"
          :label="baseAssetLabelTranslationId | globalize"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          name="trade-offer-price"
          :label="
            'create-trade-offer-form.price-lbl' | globalize({
              baseAsset: form.asset,
              quoteAsset: assetPair.quote
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
          v-model.trim="form.amount"
          name="trade-offer-amount"
          :label="'create-trade-offer-form.amount-lbl' | globalize({
            asset: form.asset
          })"
          :error-message="getFieldErrorMessage(
            'form.amount',
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
        <readonly-field
          :label="'create-trade-offer-form.total-amount-lbl' | globalize"
          :value="{
            value: quoteAmount,
            currency: assetPair.quote,
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
      </div>
    </div>

    <template v-if="formMixin.isConfirmationShown">
      <form-confirmation
        @cancel="hideConfirmation"
        @ok="submit"
        :is-pending="isOfferCreating"
        class="app__form-confirmation"
      />
    </template>

    <template v-else>
      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="app__button-raised create-trade-offer-form__btn"
          :disabled="formMixin.isDisabled"
        >
          <template v-if="isBuy">
            {{ 'create-trade-offer-form.buy-btn' | globalize }}
          </template>

          <template v-else>
            {{ 'create-trade-offer-form.sell-btn' | globalize }}
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
  offerCreated: 'offer-created',
}

export default {
  name: 'create-trade-offer-form',
  components: { ReadonlyField },
  mixins: [
    FormMixin,
    OfferManagerMixin,
  ],

  props: {
    assetPair: { type: Object, required: true },
    isBuy: { type: Boolean, default: false },
  },

  data: () => ({
    form: {
      price: '',
      amount: '',
      asset: '',
    },
    isLoaded: false,
    isOfferCreating: false,
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
        amount: {
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
        ? 'create-trade-offer-form.asset-to-buy-lbl'
        : 'create-trade-offer-form.asset-to-sell-lbl'
    },

    accountAssets () {
      return this.accountBalances
        .map(balance => balance.asset)
        .filter(asset => asset !== this.assetPair.quote)
    },

    baseAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset === this.form.asset)

      return balanceItem ? balanceItem.balance : ''
    },

    quoteAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset === this.assetPair.quote)
      return balanceItem ? balanceItem.balance : ''
    },

    quoteAmount () {
      if (this.form.price && this.form.amount) {
        return MathUtil.multiply(this.form.price, this.form.amount)
      } else {
        return ''
      }
    },

    createOfferOpts () {
      return {
        pair: {
          base: this.form.asset,
          quote: this.assetPair.quote,
        },
        baseAmount: this.form.amount,
        quoteAmount: this.quoteAmount,
        price: this.form.price,
        isBuy: this.isBuy,
      }
    },
  },

  async created () {
    try {
      await this.loadBalances()
      this.form.asset = this.assetPair.base
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    async submit () {
      this.isOfferCreating = true
      try {
        await this.createOffer(this.createOfferOpts)

        Bus.success('create-trade-offer-form.order-created-msg')
        this.$emit(EVENTS.offerCreated)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isOfferCreating = false
      this.hideConfirmation()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../app-form';

.create-trade-offer-form__btn {
  max-width: 14rem;
  width: 100%;
}
</style>
