<template>
  <form>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="offer.price"
          :label="
            'submit-trade-offers-form.price-label' | globalize({
              asset: assetPair.quote
            })
          "
          name="submit-trade-offers-offer-price"
          :white-autofill="true"
          readonly
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="offer.baseAmount"
          :label="
            'submit-trade-offers-form.want-label' | globalize({
              asset: assetPair.base
            })
          "
          name="submit-trade-offers-offer-base-amount"
          :white-autofill="true"
          readonly
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="offer.quoteAmount"
          :label="
            'submit-trade-offers-form.offer-label' | globalize({
              asset: assetPair.quote
            })
          "
          name="submit-trade-offers-offer-quote-amount"
          :white-autofill="true"
          readonly
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
        <p v-if="!isEnoughOnBalance" class="app__form-field-description">
          {{
            'submit-trade-offers-form.insufficient-sales' | globalize({
              amount: formatNumber(isBuy
                ? offerBaseAssetBalance.balance
                : offerQuoteAssetBalance.balance)
            })
          }}
        </p>
        <div class="app__form-actions">
          <button
            v-ripple
            type="button"
            @click="showConfirmation"
            class="app__form-submit-btn"
            :disabled="!isEnoughOnBalance || formMixin.isDisabled"
          >
            <template v-if="offer.ownerId === accountId">
              {{ 'submit-trade-offers-form.cancel-offer-btn' | globalize }}
            </template>
            <template v-else>
              <template v-if="isBuy">
                {{ 'submit-trade-offers-form.submit-sell-btn' | globalize }}
              </template>
              <template v-else>
                {{ 'submit-trade-offers-form.submit-buy-btn' | globalize }}
              </template>
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
import { mapGetters } from 'vuex'

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
    isOfferSubmitting: false,
  }),
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
    isEnoughOnBalance () {
      return this.isBuy
        ? +this.offerBaseAssetBalance.balance >= +this.offer.baseAmount
        : +this.offerQuoteAssetBalance.balance >= +this.offer.baseAmount
    },
  },
  methods: {
    formatNumber,
    async submit () {
      this.disableForm()
      this.isOfferSubmitting = true

      if (this.offer.ownerId === this.accountId) {
        await this.cancelOffer(this.getCancelOfferOpts())
      } else {
        await this.createOffer(this.getCreateOfferOpts())
      }

      this.isOfferSubmitting = false
      this.enableForm()
      this.$emit(EVENTS.closeDrawer)
      this.hideConfirmation()
    },
    getCreateOfferOpts () {
      return {
        pair: {
          base: this.offer.baseAssetCode,
          quote: this.offer.quoteAssetCode,
        },
        baseAmount: this.offer.baseAmount,
        quoteAmount: this.offer.quoteAmount,
        price: this.offer.price,
        isBuy: !this.offer.isBuy,
      }
    },
    getCancelOfferOpts () {
      return {
        price: this.offer.price,
        baseBalance: this.offerBaseAssetBalance.balanceId,
        quoteBalance: this.offerQuoteAssetBalance.balanceId,
        offerId: this.offer.offerId,
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
</style>
