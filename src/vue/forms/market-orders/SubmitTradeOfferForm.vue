<template>
  <form>
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
              available: quoteAssetBalance.balance
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
            asset: assetPair.base
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
              amount: formatNumber(isBuy
                ? baseAssetBalance.balance
                : quoteAssetBalance.balance)
            })
          }}
        </p>
        <div class="app__form-actions">
          <button
            v-ripple
            v-if="isOwner"
            type="button"
            @click="showConfirmation"
            class="app__form-submit-btn app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'submit-trade-offers-form.cancel-offer-btn' | globalize }}
          </button>
          <button
            v-ripple
            v-else
            type="button"
            @click="showConfirmation"
            class="app__form-submit-btn app__button-raised"
            :disabled="isDisabledSubmitButton"
          >
            <template v-if="isBuy">
              {{ 'submit-trade-offers-form.submit-sell-btn' | globalize }}
            </template>
            <template v-else>
              {{ 'submit-trade-offers-form.submit-buy-btn' | globalize }}
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
  name: 'submit-trade-offer-form',
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
      default: false,
    },
    offer: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  },
  data: () => ({
    config,
    isOfferSubmitting: false,
    isCancelingOrder: false,
    form: {
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
    },
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.accountBalances,
    ]),
    baseAssetBalance () {
      return this.accountBalances
        .find(item => item.asset === this.form.baseAssetCode) || {}
    },
    quoteAssetBalance () {
      return this.accountBalances
        .find(item => item.asset === this.form.quoteAssetCode) || {}
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
        !this.form.price ||
        !this.form.baseAmount
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
    await this.loadBalances()
    this.form = {
      baseAmount: this.offer.baseAmount,
      baseAssetCode: this.offer.baseAssetCode,
      offerId: this.offer.offerId,
      ownerId: this.offer.ownerId,
      price: this.offer.price,
      quoteAmount: this.offer.quoteAmount,
      quoteAssetCode: this.offer.quoteAssetCode,
      quoteBalanceId: this.offer.quoteBalanceId,
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

      if (this.isOwner) {
        await this.cancelOffer(
          this.getCancelOfferOpts()
        )
      } else {
        await this.createOffer(
          this.getCreateOfferOpts()
        )
      }

      this.isOfferSubmitting = false
      this.enableForm()
      this.$emit(EVENTS.closeDrawer)
      this.hideConfirmation()
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
        isBuy: !this.form.isBuy,
      }
    },
    getCancelOfferOpts () {
      return {
        price: this.form.price,
        baseBalance: this.baseAssetBalance.balanceId,
        quoteBalance: this.quoteAssetBalance.balanceId,
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
