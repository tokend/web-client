<template>
  <form
    v-if="isLoaded"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <readonly-field
          :label="baseAssetLabelTranslationId | globalize"
          :value="offer.baseAsset.id"
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
          name="your-trade-offer-base-amount"
          type="number"
          :min="0"
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          :label="'your-trade-offer-form.base-amount-lbl' | globalize({
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
        <template v-if="isFeesLoaded">
          <readonly-field
            :label="
              'your-trade-offer-form.total-amount-lbl' | globalize({
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

  <loader v-else message-id="your-trade-offer-form.loading-msg" />
</template>

<script>
import debounce from 'lodash/debounce'

import ReadonlyField from '@/vue/fields/ReadonlyField'
import FeesRenderer from '@/vue/common/fees/FeesRenderer'
import Loader from '@/vue/common/Loader'

import FormMixin from '@/vue/mixins/form.mixin'
import OfferManagerMixin from '@/vue/mixins/offer-manager.mixin'
import FeesMixin from '@/vue/common/fees/fees.mixin'

import { FEE_TYPES } from '@tokend/js-sdk'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { MathUtil } from '@/js/utils/math.util'
import config from '@/config'

import {
  required,
  amountRange,
  lessThenMax,
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
    OfferManagerMixin,
    FeesMixin,
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
          noMoreThanAvailableOnBalance: this.isBuy ||
            lessThenMax(this.baseAssetBalance),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
      },

      quoteAmount: {
        noMoreThanAvailableOnBalance: !this.isBuy ||
          lessThenMax(this.quoteAssetBalance),
        amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
      },
    }
  },

  computed: {
    baseAssetLabelTranslationId () {
      return this.isBuy
        ? 'your-trade-offer-form.asset-to-buy-lbl'
        : 'your-trade-offer-form.asset-to-sell-lbl'
    },

    accountAssets () {
      return this.accountBalances
        .map(balance => balance.asset.code)
        .filter(asset => asset !== this.assetPair.quote)
    },

    baseAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset.code === this.offer.baseAsset.id)

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
        .find(balance => balance.asset.code === this.assetPair.quote)

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
        fee: this.fees.totalFee,
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

  watch: {
    'form.baseAmount' () {
      this.tryLoadFees()
    },

    'form.price' () {
      this.tryLoadFees()
    },
  },

  async created () {
    try {
      await this.loadBalances()
      this.populateForm()
      await this.loadFees()
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
          assetCode: this.assetPair.quote,
          amount: this.quoteAmount || 0,
          senderAccountId: this.accountId,
          type: FEE_TYPES.offerFee,
        })

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
            await this.cancelOffer(this.cancelOfferOpts)

            Bus.success('your-trade-offer-form.order-canceled-msg')
            this.$emit(EVENTS.offerCanceled)

            break
          case SUBMIT_MODES.update:
            await this.cancelOffer(this.cancelOfferOpts)
            await this.createOffer(this.createOfferOpts)

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
