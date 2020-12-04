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
          :min="0"
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
          :min="0"
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
        <template v-if="isFeesLoaded">
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
    assetPair: { type: Object, required: true },
    isBuy: { type: Boolean, default: false },
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
            maxValueBig(this.baseAssetBalance),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
      },

      quoteAmount: {
        noMoreThanAvailableOnBalance: !this.isBuy ||
          maxValueBig(this.quoteAssetBalance),
        amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
      },
    }
  },

  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
      accountId: vuexTypes.accountId,
    }),
    baseAssetLabelTranslationId () {
      return this.isBuy
        ? 'submit-trade-offer-form.asset-to-buy-lbl'
        : 'submit-trade-offer-form.asset-to-sell-lbl'
    },

    baseAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset.code === this.assetPair.base)
      return balanceItem ? balanceItem.balance : ''
    },

    quoteAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset.code === this.assetPair.quote)
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
        fee: this.fees.totalFee,
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
      this.former.mergeAttrs({
        price: this.offer.price,
        amount: this.offer.baseAmount,
        assetCode: this.offer.baseAsset.id,
        isBuy: this.offer.isBuy,
        assetPair: this.assetPair,
        quoteAmount: this.offer.quoteAmount,
        accountId: this.accountId,
        accountBalances: this.accountBalances,
        fees:
        {
          totalFee: this.offer.fee,
        },
      })
      this.populateForm()
      await this.loadBalances()
      // await this.loadFees()
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    populateForm () {
      this.form.price = this.offer.price
      this.form.baseAmount = this.offer.baseAmount
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
        this.former.setAttr('quoteAmount', this.quoteAmount)
        this.fees = await this.former.calculateFees()
        this.former.setAttr('fees.totalFee', this.fees.totalFee)

        this.isFeesLoaded = true
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async submit () {
      this.isOfferSubmitting = true
      try {
        const operation = await this.former.buildOpsCreate()
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
