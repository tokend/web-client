<template>
  <form
    @submit.prevent="isFormValid() && showConfirmation()"
    v-if="isLoadedInfo"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          :values="accountAssets"
          v-model="form.asset"
          name="create-sale-base-asset"
          :disabled="formMixin.isDisabled"
          :label="'create-sale-form.base-asset' | globalize"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          name="trade-offer-price"
          :label="
            'offer-creation-form.price-per-asset' | globalize({
              asset: form.asset
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
          v-model.trim="form.amount"
          name="trade-offer-amount"
          :label="'offer-creation-form.amount' | globalize({
            asset: form.asset
          })"
          :error-message="getFieldErrorMessage(
            'form.amount',
            {
              minValue: config.MIN_AMOUNT,
              available: baseAssetBalance,
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
            }
          )"
          @blur="touchField('form.amount')"
          :white-autofill="true"
          :max="baseAssetBalance"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <readonly-field
          :label="'offer-creation-form.total' | globalize"
          :value="totalValue | formatMoney"
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
      <div
        class="app__form-actions
               app__form-submit-btn--margin_small"
      >
        <button
          v-ripple
          type="submit"
          class="app__form-submit-btn app__button-raised"
          :disabled="!+formQuoteAmount || formMixin.isDisabled"
        >
          <template v-if="isBuy">
            {{ 'offer-creation-form.submit-buy-btn' | globalize }}
          </template>

          <template v-else>
            {{ 'offer-creation-form.submit-sell-btn' | globalize }}
          </template>
        </button>
      </div>
    </template>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import OfferManagerMixin from '@/vue/mixins/offer-manager.mixin'
import ReadonlyField from '@/vue/fields/ReadonlyField'
import FormConfirmation from '@/vue/common/FormConfirmation'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { MathUtil } from '@/js/utils/math.util'
import config from '@/config'

import {
  required,
  amountRange,
  minValue,
  noMoreThanAvailableOnBalance,
  decimal,
} from '@validators'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'create-trade-offer-form',
  components: {
    FormConfirmation,
    ReadonlyField,
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
  },
  data: () => ({
    form: {
      price: '',
      amount: '',
      asset: '',
    },
    config,
    isOfferCreating: false,
    isLoadedInfo: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
    ]),

    accountAssets () {
      return this.accountBalances
        .map(balance => balance.asset)
        .filter(asset => asset !== this.assetPair.quote)
    },
    baseAssetBalance () {
      return (this.accountBalances
        .find(balance => balance.asset === this.form.asset) || {}).balance
    },
    quoteAssetBalance () {
      return (this.accountBalances
        .find(balance => balance.asset === this.assetPair.quote) || {}).balance
    },
    formQuoteAmount () {
      return MathUtil.multiply(this.form.price, this.form.amount)
    },
    totalValue () {
      return +this.formQuoteAmount
        ? {
          value: this.formQuoteAmount,
          currency: this.assetPair.quote,
        } : ''
    },
  },
  validations () {
    return {
      form: {
        price: {
          required,
          decimal,
          amountRange: amountRange(
            config.MIN_AMOUNT,
            config.MAX_AMOUNT
          ),
        },
        amount: {
          required,
          decimal,
          minValue: minValue(config.MIN_AMOUNT),
          noMoreThanAvailableOnBalance: this.isBuy
            ? this.isBuy
            : noMoreThanAvailableOnBalance(this.baseAssetBalance),
          amountRange: amountRange(
            config.MIN_AMOUNT,
            config.MAX_AMOUNT
          ),
        },
      },
      totalValue: {
        noMoreThanAvailableOnBalance: this.isBuy
          ? noMoreThanAvailableOnBalance(this.quoteAssetBalance)
          : !this.isBuy,
        amountRange: amountRange(
          config.MIN_AMOUNT,
          config.MAX_AMOUNT
        ),
      },
    }
  },
  async created () {
    try {
      await this.loadBalances()
      this.form.asset = this.assetPair.base
      this.isLoadedInfo = true
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async submit () {
      this.disableForm()
      this.isOfferCreating = true
      try {
        await this.createOffer(
          this.getCreateOfferOpts()
        )
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isOfferCreating = false
      this.enableForm()
      this.hideConfirmation()
      this.$emit(EVENTS.closeDrawer)
    },
    getCreateOfferOpts () {
      return {
        pair: {
          base: this.form.asset,
          quote: this.assetPair.quote,
        },
        baseAmount: this.form.amount,
        quoteAmount: this.formQuoteAmount,
        price: this.form.price,
        isBuy: this.isBuy,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../app-form';

.app__form-submit-btn--margin_small {
  // need override margin for case with readonly field
  // stylelint-disable-next-line
  margin-top: 3rem !important;
}
</style>
