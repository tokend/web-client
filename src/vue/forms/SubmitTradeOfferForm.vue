<template>
  <form>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.price"
          :label="
            'submit-trade-offers-form.price-label' | globalize({
              asset: assetPair.quote
            })
          "
          :error-message="getFieldErrorMessage(
            'form.price', {
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
              available: offerQuoteAssetBalance.balance
            }
          )"
          name="submit-trade-offers-offer-price"
          :white-autofill="true"
          @blur="touchField('form.price')"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.baseAmount"
          :label="
            'submit-trade-offers-form.want-label' | globalize({
              asset: assetPair.base
            })
          "
          :error-message="getFieldErrorMessage(
            'form.baseAmount',
            {
              available: offerQuoteAssetBalance.balance,
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
            }
          )"
          name="submit-trade-offers-offer-base-amount"
          :white-autofill="true"
          @blur="touchField('form.baseAmount')"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="totalValue"
          :label="
            'submit-trade-offers-form.offer-label' | globalize({
              asset: assetPair.quote
            })
          "
          name="submit-trade-offers-offer-quote-amount"
          :white-autofill="true"
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
                ? offerBaseAssetBalance.balance
                : offerQuoteAssetBalance.balance)
            })
          }}
        </p>
        <div class="app__form-actions">
          <button
            v-ripple
            v-if="isOwner"
            type="button"
            @click="showConfirmation"
            class="app__form-submit-btn"
            :disabled="formMixin.isDisabled"
          >
            {{ 'submit-trade-offers-form.cancel-offer-btn' | globalize }}
          </button>
          <button
            v-ripple
            v-else
            type="button"
            @click="showConfirmation"
            class="app__form-submit-btn"
            :disabled="!isEnoughOnBalance || formMixin.isDisabled"
          >
            <template v-if="isBuy">
              {{ 'submit-trade-offers-form.submit-sell-btn' | globalize }}
            </template>
            <template v-else>
              {{ 'submit-trade-offers-form.submit-buy-btn' | globalize }}
            </template>
          </button>
          <div class="app__button-tooltip">
            <button
              v-ripple
              type="button"
              @click="updateOrder"
              class="app__form-submit-btn"
              :disabled="!isEnoughOnBalance
                || formMixin.isDisabled
                || !isOwnerOrder"
            >
              <template v-if="!isShownToolTip">
                {{ 'submit-trade-offers-form.update-order' | globalize }}
              </template>
              <template v-else-if="isOfferSubmitting">
                {{ 'form-confirmation.submit-processing' | globalize }}
              </template>
              <template v-else>
                {{ 'form-confirmation.button-text-ok' | globalize }}
              </template>
            </button>
            <transition name="fade">
              <div
                v-if="isShownToolTip"
                class="app__tool-tip"
              >
                <span>
                  {{ 'submit-trade-offers-form.cancel-order' | globalize }}
                </span>
              </div>
            </transition>
          </div>
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
import { vuexTypes, mapActions } from '@/vuex'
import { mapGetters } from 'vuex'
import { MathUtil } from '@/js/utils/math.util'

import {
  required,
  amountRange,
  minValue,
  noMoreThanAvailableOnBalance,
  decimal,
} from '@validators'
import config from '@/config'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'submit-trade-offer-form',
  components: { FormConfirmation },
  mixins: [FormMixin, OfferManagerMixin],
  props: {
    assetPair: { type: Object, require: true, default: () => ({}) },
    isBuy: { type: Boolean, require: false, default: true },
    offer: { type: Object, require: true, default: () => ({}) },
  },
  data: () => ({
    config,
    isOfferSubmitting: false,
    form: {},
    isShownToolTip: false,
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
          minValue: minValue(config.MIN_AMOUNT),
          noMoreThanAvailableOnBalance: this.offer.isBuy
            ? true
            : noMoreThanAvailableOnBalance(
              this.offerBaseAssetBalance.balance
            ),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.accountBalances,
    ]),
    offerBaseAssetBalance () {
      return this.accountBalances
        .find(item => item.asset === this.offer.baseAssetCode) || {}
    },
    offerQuoteAssetBalance () {
      return this.accountBalances
        .find(item => item.asset === this.offer.quoteAssetCode)
    },
    formQuoteAmount () {
      return MathUtil.multiply(this.form.price, this.form.baseAmount)
    },
    totalValue () {
      return +this.formQuoteAmount ? this.formQuoteAmount : ''
    },
    isEnoughOnBalance () {
      return this.isBuy
        ? +this.offerBaseAssetBalance.balance >= +this.offer.baseAmount
        : +this.offerQuoteAssetBalance.balance >= +this.offer.baseAmount
    },
    isOwner () {
      return this.offer.ownerId === this.accountId
    },
  },
  async created () {
    await this.loadBalances()
    this.form = Object.assign({}, this.offer)
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
        await this.cancelOffer(this.getCancelOfferOpts())
      } else {
        await this.createOffer(this.getCreateOfferOpts())
      }

      this.isOfferSubmitting = false
      this.enableForm()
      this.$emit(EVENTS.closeDrawer)
      this.hideConfirmation()
    },
    async updateOrder () {
      if (!this.isFormValid()) return
      if (!this.isShownToolTip) {
        this.isShownToolTip = true
        return
      }
      this.disableForm()
      this.isOfferSubmitting = true
      await this.updateOffer(
        this.getUpdateOfferOpts()
      )
      this.isOfferSubmitting = false
      this.enableForm()
      this.$emit(EVENTS.closeDrawer)
    },
    getCancelOfferOpts () {
      return {
        price: this.offer.price,
        baseBalance: this.offerBaseAssetBalance.balanceId,
        quoteBalance: this.offerQuoteAssetBalance.balanceId,
        offerId: this.offer.offerId,
      }
    },
    getCreateOfferOpts () {
      return {
        pair: {
          base: this.form.baseAssetCode,
          quote: this.form.quoteAssetCode,
        },
        baseAmount: this.from.baseAmount,
        quoteAmount: this.from.quoteAmount,
        price: this.form.price,
        isBuy: !this.from.isBuy,
      }
    },
    getUpdateOfferOpts () {
      return {
        creating: {
          pair: {
            base: this.form.baseAssetCode,
            quote: this.form.quoteAssetCode,
          },
          baseAmount: this.form.baseAmount,
          quoteAmount: this.form.quoteAmount,
          price: this.form.price,
          isBuy: this.form.isBuy,
        },
        canceling: {
          price: this.offer.price,
          baseBalance: this.offerBaseAssetBalance.balanceId,
          quoteBalance: this.offerQuoteAssetBalance.balanceId,
          offerId: this.offer.offerId,
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import './app-form';

  .submit-trade-offer-form__actions {
    margin-top: 5rem;

    & > .app__form-actions {
      margin-top: 1.6rem;
    }
  }

  .app__button-tooltip {
    margin-left: 1.2rem;
  }

  .app__tool-tip {
    padding: 1rem .5rem;
    margin-top: 1rem;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
