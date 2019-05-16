<template>
  <form
    v-if="isLoaded"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <div class="app__form-field">
          <readonly-field
            :label="'your-sale-offer-form.base-asset-lbl' | globalize"
            :value="offer.baseAsset.id"
          />
        </div>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          name="your-sale-offer-price"
          :label="
            'your-sale-offer-form.price-label' | globalize({
              asset: assetPair.quote
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
          name="your-sale-offer-base-amount"
          :label="'your-sale-offer.base-amount-label' | globalize({
            asset: offer.baseAsset.id
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
        <readonly-field
          :label="
            'your-sale-offer-form.offer-label' | globalize({
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
          class="app__form-submit-btn app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ 'submit-trade-offers-form.update-offer-btn' | globalize }}
        </button>

        <button
          v-ripple
          type="submit"
          @click="setCancelSubmitMode"
          class="app__form-submit-btn app__button-flat"
          :disabled="formMixin.isDisabled"
        >
          {{ 'submit-trade-offers-form.cancel-offer-btn' | globalize }}
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
  offerCanceled: 'offer-canceled',
  offerUpdated: 'offer-updated',
}

const SUBMIT_MODES = {
  cancel: 'cancel',
  update: 'update',
}

export default {
  name: 'your-sale-offer-form',
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
    accountAssets () {
      return this.accountBalances
        .map(balance => balance.asset)
        .filter(asset => asset !== this.assetPair.quote)
    },

    baseAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset === this.offer.baseAsset.id)

      if (balanceItem) {
        return this.isBuy
          ? balanceItem.balance
          : MathUtil.add(balanceItem.balance, this.offer.baseAmount)
      } else {
        return ''
      }
    },

    quoteAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset === this.assetPair.quote)

      if (balanceItem) {
        return this.isBuy
          ? balanceItem.balance
          : MathUtil.add(balanceItem.balance, this.offer.quoteAmount)
      } else {
        return ''
      }
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
          base: this.offer.baseAsset.id,
          quote: this.assetPair.quote,
        },
        baseAmount: this.form.baseAmount,
        quoteAmount: this.quoteAmount,
        price: this.form.price,
        isBuy: this.isBuy,
      }
    },

    cancelOfferOpts () {
      return {
        offerId: this.offer.id,
        baseBalance: this.offer.baseBalance.id,
        quoteBalance: this.offer.quoteBalance.id,
        price: this.offer.price,
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
      this.form.baseAmount = this.offer.baseAmount
      this.form.price = this.offer.price
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
            await this.cancelOffer(this.cancelOfferOpts)

            Bus.success()
            this.$emit(EVENTS.offerCanceled)

            break
          case SUBMIT_MODES.update:
            await this.cancelOffer(this.cancelOfferOpts)
            await this.createOffer(this.createOfferOpts)

            Bus.success()
            this.$emit(EVENTS.offerUpdated)

            break
        }
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
@import '../app-form';
</style>
