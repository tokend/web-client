<template>
  <div class="invest-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <!--
            :key is a hack to ensure that the component will be updated
            after property change
          -->
          <select-field
            :key="form.asset"
            v-model="form.asset"
            :values="assetListValues"
            :label="'invest-form.asset-lbl' | globalize"
            id="invest-asset"
            @blur="touchField('form.asset')"
            :disabled="formMixin.isDisabled"
          />

          <!-- eslint-disable max-len -->
          <vue-markdown
            class="app__form-field-description invest-form__amount-hint"
            :source="'invest-form.available-amount-hint' | globalize({ amount: availableAmount })"
            :html="false"
          />
          <!-- eslint-enable max-len -->
        </div>
      </div>

      <!-- eslint-disable max-len -->
      <vue-markdown
        v-if="currentAssetOffer.quoteAmount"
        class="invest-form__current-offer"
        :source="'invest-form.current-offer' | globalize({
          amount: {
            value: currentAssetOffer.quoteAmount,
            currency: currentAssetOffer.quoteAssetCode
          }
        })"
        :html="false"
      />
      <!-- eslint-enable max-len -->

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            type="number"
            v-model="form.amount"
            @input="touchField('form.amount')"
            id="invest-amount"
            :label="'invest-form.amount-lbl' | globalize({ asset: form.asset })"
            :error-message="getFieldErrorMessage(
              'form.amount',
              { from: MIN_AMOUNT, to: availableAmount.value }
            )"
            :disabled="formMixin.isDisabled"
          />

          <!-- eslint-disable max-len -->
          <vue-markdown
            v-if="isConvertedAmountLoaded"
            class="app__form-field-description invest-form__amount-hint"
            :source="'invest-form.converted-amount-hint' | globalize({ amount: convertedAmount })"
            :html="false"
          />
          <!-- eslint-enable max-len -->

          <p
            v-else-if="isConvertedAmountFailed"
            class="app__form-field-description"
          >
            Error
          </p>

          <p
            v-else
            class="app__form-field-description"
          >
            Loading...
          </p>
        </div>
      </div>

      <div class="app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          @ok="hideConfirmation() || submit()"
          @cancel="hideConfirmation"
        />

        <div
          v-else
          class="invest-form__actions"
        >
          <template v-if="currentAssetOffer.offerId">
            <button
              v-ripple
              type="submit"
              class="invest-form__submit-btn"
              :disabled="formMixin.isDisabled || isInvestmentDisabled"
            >
              {{ 'invest-form.update-offer-btn' | globalize }}
            </button>

            <button
              v-ripple
              type="button"
              @click="cancelOffer"
              class="invest-form__submit-btn"
              :disabled="formMixin.isDisabled || isInvestmentDisabled"
            >
              {{ 'invest-form.cancel-offer-btn' | globalize }}
            </button>
          </template>

          <template v-else>
            <button
              v-ripple
              type="submit"
              class="invest-form__submit-btn"
              :disabled="formMixin.isDisabled || isInvestmentDisabled"
            >
              {{ 'invest-form.invest-btn' | globalize }}
            </button>
          </template>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import VueMarkdown from 'vue-markdown'

import config from '@/config'

// import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Sdk } from '@/sdk'
import { base, FEE_TYPES } from '@tokend/js-sdk'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { required, amountRange } from '@validators'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import _throttle from 'lodash/throttle'

export default {
  name: 'invest-form',
  components: {
    VueMarkdown,
  },
  mixins: [FormMixin],
  props: {
    sale: { type: SaleRecord, required: true },
  },
  data: _ => ({
    form: {
      asset: '',
      amount: '',
    },
    offers: [],
    MIN_AMOUNT: config.MIN_AMOUNT,
    converted: 0,
    isConvertedAmountLoaded: true,
    isConvertedAmountFailed: false,
  }),
  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.availableAmount.value),
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      balances: vuexTypes.accountBalances,
    }),

    throttled () {
      return _throttle(this.loadConvertedAmount, 1000)
    },

    assetListValues () {
      const quoteBalances = this.sale.quoteAssets.map(quote => {
        return this.balances.find(balance => balance.asset === quote.asset)
      })

      return quoteBalances.map(balance => {
        const asset = balance.assetDetails

        return {
          value: asset.code,
          label: `${asset.name} (${asset.code})`,
        }
      })
    },

    availableAmount () {
      const assetBalance = this.balances
        .find(balance => balance.asset === this.form.asset)

      if (this.currentAssetOffer.quoteAmount) {
        return {
          value: +assetBalance.balance + +this.currentAssetOffer.quoteAmount,
          currency: this.form.asset,
        }
      } else {
        return {
          value: assetBalance.balance,
          currency: this.form.asset,
        }
      }
    },

    convertedAmount () {
      return {
        value: this.converted,
        currency: this.sale.defaultQuoteAsset,
      }
    },

    isInvestmentDisabled () {
      return this.sale.isUpcoming ||
        this.sale.isClosed ||
        this.sale.owner === this.accountId ||
        !this.isConvertedAmountLoaded ||
        +this.converted > +this.sale.hardCap ||
        +this.form.amount > +this.availableAmount.value
    },

    currentAssetOffer () {
      return this.offers
        .find(offer => offer.quoteAssetCode === this.form.asset) || {}
    },
  },

  watch: {
    'form.amount': function () {
      this.setConvertedAmount()
    },

    'form.asset': function () {
      this.setConvertedAmount()
    },
  },

  async created () {
    this.form.asset = this.assetListValues[0].value

    const { data } = await Sdk.horizon.account.getOffers(this.accountId, {
      is_buy: true,
      order_book_id: this.sale.id,
    })
    this.offers = data
  },

  methods: {
    setConvertedAmount () {
      if (this.form.asset === this.sale.defaultQuoteAsset) {
        this.converted = this.form.amount
      } else if (this.form.amount === '') {
        this.converted = 0
      } else {
        this.isConvertedAmountFailed = false
        this.isConvertedAmountLoaded = false
        this.throttled()
      }
    },

    async loadConvertedAmount () {
      try {
        const { data } = await Sdk.horizon.assetPairs.convert({
          source_asset: this.form.asset,
          dest_asset: this.sale.defaultQuoteAsset,
          amount: this.form.amount,
        })
        this.converted = data.amount
        this.isConvertedAmountLoaded = true
      } catch (e) {
        this.isConvertedAmountFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()

      try {
        const { data: fee } = await Sdk.horizon.fees.get(FEE_TYPES.offerFee, {
          asset: this.form.asset,
          account: this.accountId,
          amount: this.converted,
        })

        let operations = [
          base.ManageOfferBuilder.manageOffer(this.getOfferOpts('0', fee)),
        ]

        if (this.currentAssetOffer.offerId) {
          operations.push(base.ManageOfferBuilder.cancelOffer(
            this.getOfferOpts(String(this.currentAssetOffer.offerId), fee)
          ))
        }

        await Sdk.horizon.transactions.submitOperations(...operations)
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },

    getOfferOpts (offerId, offerFee) {
      return {
        offerID: offerId,
        baseBalance: this.balances
          .find(balance => balance.asset === this.sale.baseAsset).balanceId,
        quoteBalance: this.balances
          .find(balance => balance.asset === this.form.asset).balanceId,
        isBuy: true,
        amount: this.form.amount,
        price: this.sale.quoteAssetPrices[this.form.quoteAsset] || '1',
        fee: offerFee.percent,
        orderBookID: this.sale.id,
      }
    },

    async cancelOffer () {
      const { data: fee } = await Sdk.horizon.fees.get(FEE_TYPES.offerFee, {
        asset: this.form.asset,
        account: this.accountId,
        amount: this.converted,
      })
      const operation = base.ManageOfferBuilder.cancelOffer({
        offerID: String(this.currentAssetOffer.offerId),
        baseBalance: this.balances
          .find(balance => balance.asset === this.sale.baseAsset).balanceId,
        quoteBalance: this.balances
          .find(balance => balance.asset === this.form.asset).balanceId,
        isBuy: true,
        amount: this.form.amount,
        price: this.sale.quoteAssetPrices[this.form.quoteAsset] || '1',
        fee: fee.percent,
        orderBookID: this.sale.id,
      })
      await Sdk.horizon.transactions.submitOperations(operation)
    },
  },
}
</script>

<style lang="scss">
@import './app-form';

.invest-form__submit-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.invest-form__amount-hint {
  p {
    font-size: 1.2rem;
  }

  strong {
    color: #7b6eff;
  }
}

.invest-form__issuance-asset-code {
  margin-left: 1rem;
  padding-top: 1.8rem;
  font-size: 1.8rem;
}
</style>
