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
        @cancel="cancelConfirmation"
        @ok="submit"
        :is-pending="isOfferCreatingProcess"
        class="app__form-confirmation"
      />
    </template>
    <template v-else>
      <div class="app__form-actions">
        <button
          v-ripple
          type="button"
          @click="tryToSubmit"
          class="app__form-submit-btn"
          :disabled="formMixin.isDisabled">
          <template v-if="isBuy">
            {{ 'submit-trade-offers-form.submit-sell-btn' | globalize }}
          </template>
          <template v-else>
            {{ 'submit-trade-offers-form.submit-buy-btn' | globalize }}
          </template>
        </button>
      </div>
    </template>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import OfferMakerMixin from '@/vue/mixins/offer-maker.mixin'
import FormConfirmation from '@/vue/common/FormConfirmation'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'submit-trade-offer-form',
  components: { FormConfirmation },
  mixins: [FormMixin, OfferMakerMixin],
  props: {
    assetPair: { type: Object, require: true, default: () => ({}) },
    isBuy: { type: Boolean, require: false, default: true },
    offer: { type: Object, require: true, default: () => ({}) },
  },
  data: () => ({
    isOfferCreatingProcess: false,
  }),
  methods: {
    tryToSubmit () {
      this.showConfirmation()
    },
    async submit () {
      this.disableForm()
      this.isOfferCreatingProcess = true

      await this.createOffer(this.getCreateOfferOpts())

      this.isOfferCreatingProcess = false
      this.enableForm()
      this.$emit(EVENTS.closeDrawer)
      this.hideConfirmation()
    },
    cancelConfirmation () {
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
  },
}
</script>

<style lang="scss" scoped>
  @import './app-form';
</style>
