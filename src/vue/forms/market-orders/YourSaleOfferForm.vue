<template>
  <form v-if="isLoadedInfo">
    <div class="app__form-row">
      <div class="app__form-field">
        <div class="app__form-field">
          <select-field
            :values="accountAssets"
            v-model="form.baseAssetCode"
            name="create-sale-base-asset"
            :disabled="formMixin.isDisabled"
            :label="'create-sale-form.base-asset-lbl' | globalize"
          />
        </div>
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          name="submit-trade-offers-offer-price"
          :label="
            'submit-trade-offers-form.price-label' | globalize({
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
          :white-autofill="true"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.baseAmount"
          name="submit-trade-offers-offer-base-amount"
          :label="'submit-trade-offers-form.want-label' | globalize({
            asset: form.baseAssetCode
          })"
          :error-message="getFieldErrorMessage(
            'form.baseAmount',
            {
              minValue: config.MIN_AMOUNT,
              available: baseAssetBalance.balance,
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
            }
          )"
          @blur="touchField('form.amount')"
          :white-autofill="true"
          :max="baseAssetBalance.balance"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          :label="
            'submit-trade-offers-form.offer-label' | globalize({
              asset: assetPair.quote
            })
          "
          v-model.trim="totalValue"
          name="submit-trade-offers-offer-quote-amount"
          :white-autofill="true"
          :error-message="getFieldErrorMessage(
            'totalValue',
            {
              minValue: config.MIN_AMOUNT,
              available: isBuy ? quoteAssetBalance : baseAssetBalance,
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
            }
          )"
          @change="touchField('totalValue')"
          :readonly="true"
        />
      </div>
    </div>

    <template v-if="formMixin.isConfirmationShown">
      <form-confirmation
        @cancel="hideConfirmation"
        @ok="submit"
        :is-pending="isOfferSubmitting"
        class="app__form-confirmation"
      />
    </template>
    <template v-else>
      <div class="submit-trade-offer-form__actions">
        <!-- TODO: make it via tooltip message -->
        <p
          v-if="!isEnoughOnBalance && !isOwner"
          class="app__form-field-description"
        >
          {{
            'submit-trade-offers-form.insufficient-funds' | globalize({
              amount: formatNumber(
                isBuy ? baseAssetBalance.balance : quoteAssetBalance.balance
              )
            })
          }}
        </p>
        <div class="app__form-actions">
          <button
            v-ripple
            type="button"
            @click="cancelOfferAction"
            class="app__form-submit-btn app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'submit-trade-offers-form.cancel-offer-btn' | globalize }}
          </button>
          <button
            v-ripple
            type="button"
            @click="updateOfferAction"
            class="app__form-submit-btn app__button-raised"
            :disabled="isDisabledSubmitButton"
          >
            <template>
              {{ 'submit-trade-offers-form.update-offer-btn' | globalize }}
            </template>
          </button>
        </div>
      </div>
    </template>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import OfferManagerMixin from '@/vue/mixins/offer-manager.mixin'
import FormConfirmation from '@/vue/common/FormConfirmation'
import { formatNumber } from '@/vue/filters/formatNumber'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import config from '@/config'
import { ErrorHandler } from '@/js/helpers/error-handler'
import {
  required,
  amountRange,
  minValue,
  noMoreThanAvailableOnBalance,
  decimal,
} from '@validators'
import { MathUtil } from '@/js/utils/math.util'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'your-sale-offer',
  components: {
    FormConfirmation,
  },
  mixins: [
    FormMixin,
    OfferManagerMixin,
  ],
  props: {
    assetPair: {
      type: Object,
      default: () => ({}),
    },
    isBuy: {
      type: Boolean,
      require: false,
      default: true,
    },
    offer: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    config,
    isOfferSubmitting: false,
    isCancelOrderAction: false,
    isUpdatinglOrderAction: false,
    isWraningShown: false,
    isLoadedInfo: false,
    form: {
      baseAmount: '0',
      baseAssetCode: null,
      offerId: null,
      ownerId: null,
      price: '0',
      quoteAmount: null,
      quoteAssetCode: null,
      quoteBalanceId: null,
    },
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.accountBalances,
    ]),
    accountAssets () {
      return this.accountBalances
        .map(balance => balance.asset)
        .filter(asset => asset !== this.assetPair.quote)
    },
    baseAssetBalance () {
      return this.accountBalances
        .find(balance => balance.asset === this.form.baseAssetCode) || {}
    },
    quoteAssetBalance () {
      return this.accountBalances
        .find(item => item.asset === this.form.quoteAssetCode)
    },
    isEnoughOnBalance () {
      if (this.isBuy) {
        return +this.baseAssetBalance.balance >= +this.form.baseAmount
      }
      return +this.quoteAssetBalance.balance >= +this.form.baseAmount
    },
    isDisabledSubmitButton () {
      return !this.isEnoughOnBalance ||
        this.formMixin.isDisabled ||
        !this.totalValue
    },
    formQuoteAmount () {
      return MathUtil.multiply(this.form.price, this.form.baseAmount)
    },
    totalValue () {
      return +this.formQuoteAmount ? this.formQuoteAmount : ''
    },
    isOwner () {
      return this.form.ownerId === this.accountId
    },
  },
  async created () {
    try {
      await this.loadBalances()
      this.form = {
        baseAmount: this.offer.baseAmount,
        baseAssetCode: this.offer.baseAsset.id,
        offerId: this.offer.id,
        ownerId: this.offer.owner.id,
        price: this.offer.price,
        quoteAmount: this.offer.quoteAmount,
        quoteAssetCode: this.offer.quoteAsset.id,
        quoteBalanceId: this.offer.quoteBalance.id,
      }
      this.isLoadedInfo = true
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  },
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
          minValue: minValue(config.MIN_AMOUNT),
          noMoreThanAvailableOnBalance: this.isBuy
            ? this.isBuy
            : noMoreThanAvailableOnBalance(this.baseAssetBalance),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
      },
      totalValue: {
        noMoreThanAvailableOnBalance: this.isBuy
          ? noMoreThanAvailableOnBalance(this.quoteAssetBalance)
          : !this.isBuy,
        amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
      },
    }
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    formatNumber,
    async submit () {
      this.disableForm()
      this.isOfferSubmitting = true
      try {
        if (this.isCancelOrderAction && this.isOwner) {
          await this.cancelOffer(
            this.getCancelOfferOpts()
          )
        }
        if (this.isUpdatinglOrderAction) {
          await this.cancelOffer(
            this.getCancelOfferOpts()
          )
          await this.createOffer(
            this.getCreateOfferOpts()
          )
        }
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isOfferSubmitting = false
      this.resetStatateActions()
      this.enableForm()
      this.$emit(EVENTS.closeDrawer)
      this.hideConfirmation()
    },
    cancelOfferAction () {
      this.isCancelOrderAction = true
      this.showConfirmation()
    },
    updateOfferAction () {
      this.isUpdatinglOrderAction = true
      this.showConfirmation()
    },
    resetStatateActions () {
      this.isCancelOrderAction = false
      this.isUpdatinglOrderAction = false
    },

    getCreateOfferOpts () {
      return {
        pair: {
          base: this.form.baseAssetCode,
          quote: this.form.quoteAssetCode,
        },
        baseAmount: this.form.baseAmount,
        quoteAmount: this.form.quoteAmount,
        price: this.form.price,
        isBuy: !this.isBuy,
      }
    },
    getCancelOfferOpts () {
      return {
        price: this.form.price,
        baseBalance: this.baseAssetBalance.id,
        quoteBalance: this.quoteAssetBalance.id,
        offerId: this.form.offerId,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../app-form';

  .submit-trade-offer-form__actions {
    margin-top: 5rem;
    /* stylelint-disable selector-nested-pattern */
    & > .app__form-actions {
      margin-top: 1.6rem;
    }
    /* stylelint-enable selector-nested-pattern */
  }
</style>
