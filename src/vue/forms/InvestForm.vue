<template>
  <div class="invest-form">
    <template v-if="isLoaded && quoteAssetBalances.length">
      <form
        novalidate
        class="app__form"
        @submit.prevent="isFormValid() && showConfirmation()"
      >
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              v-model="form.asset"
              :values="quoteAssetListValues"
              key-as-value-text="nameAndCode"
              :label="'invest-form.asset-lbl' | globalize"
              id="invest-asset"
              @blur="touchField('form.asset')"
              :disabled="formMixin.isDisabled || !canUpdateOffer"
            />

            <vue-markdown
              class="app__form-field-description invest-form__amount-hint"
              :source="'invest-form.available-amount-hint' | globalize({
                amount: availableAmount
              })"
              :html="false"
            />
          </div>
        </div>

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

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.amount"
              @input="touchField('form.amount')"
              id="invest-amount"
              :label="'invest-form.amount-lbl' | globalize({
                asset: form.asset.code
              })"
              :error-message="getFieldErrorMessage(
                'form.amount',
                { from: MIN_AMOUNT, to: availableAmount.value }
              )"
              :disabled="formMixin.isDisabled || !canUpdateOffer"
            />

            <p class="app__form-field-description">
              <vue-markdown
                v-if="isConvertedAmountLoaded"
                class="app__form-field-description invest-form__amount-hint"
                :source="'invest-form.converted-amount-hint' | globalize({
                  amount: {
                    value: convertedAmount,
                    currency: sale.defaultQuoteAsset
                  }
                })"
                :html="false"
              />

              <template v-else-if="isConvertingFailed">
                {{ 'invest-form.converting-error-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'invest-form.loading-msg' | globalize }}
              </template>
            </p>
          </div>
        </div>

        <div class="app__form-actions invest-form__actions">
          <template v-if="formMixin.isConfirmationShown">
            <form-confirmation
              @ok="hideConfirmation() || submit()"
              @cancel="hideConfirmation"
            />
          </template>

          <template v-else>
            <template v-if="currentAssetOffer.offerId">
              <button
                v-ripple
                type="submit"
                class="app__button-raised invest-form__submit-btn"
                :disabled="formMixin.isDisabled || !canSubmit"
              >
                {{ 'invest-form.update-offer-btn' | globalize }}
              </button>

              <button
                v-ripple
                type="button"
                @click="cancelOffer"
                class="app__button invest-form__cancel-btn"
                :disabled="formMixin.isDisabled || !canUpdateOffer"
              >
                {{ 'invest-form.cancel-offer-btn' | globalize }}
              </button>
            </template>

            <template v-else>
              <button
                v-ripple
                type="submit"
                class="app__button-raised invest-form__submit-btn"
                :disabled="formMixin.isDisabled || !canSubmit"
              >
                {{ 'invest-form.invest-btn' | globalize }}
              </button>
            </template>
          </template>
        </div>

        <p class="app__form-field-description">
          <template v-if="sale.owner === accountId">
            {{ 'invest-form.sale-owner-msg' | globalize }}
          </template>

          <template v-else-if="sale.isClosed">
            {{ 'invest-form.closed-sale-msg' | globalize }}
          </template>

          <template v-else-if="sale.isUpcoming">
            {{ 'invest-form.upcoming-sale-msg' | globalize }}
          </template>

          <template v-else-if="sale.isCanceled">
            {{ 'invest-form.canceled-sale-msg' | globalize }}
          </template>

          <template v-else-if="isCapExceeded">
            <vue-markdown
              class="invest-form__amount-hint"
              :source="'invest-form.cap-exceeded-msg' | globalize({
                amount: {
                  value: investedCap,
                  currency: sale.defaultQuoteAsset
                }
              })"
              :html="false"
            />
          </template>
        </p>
      </form>
    </template>

    <template v-else-if="isLoaded">
      <no-data-message
        icon-name="alert-circle"
        :title-id="'invest-form.insufficient-balance-title'"
        :message-id="'invest-form.insufficient-balance-desc'"
      />
    </template>

    <template v-else-if="isLoadingFailed">
      <p>
        {{ 'invest-form.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <loader message-id="invest-form.loading-msg" />
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import VueMarkdown from 'vue-markdown'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import config from '@/config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Sdk } from '@/sdk'
import { base, FEE_TYPES } from '@tokend/js-sdk'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { required, amountRange } from '@validators'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import _throttle from 'lodash/throttle'

const EVENTS = {
  submitted: 'submitted',
  canceled: 'canceled',
}

const OFFER_CREATE_ID = '0'
const CANCEL_OFFER_FEE = '0'
const DEFAULT_QUOTE_PRICE = '1'
const CONVERTING_DELAY = 1000

export default {
  name: 'invest-form',
  components: {
    VueMarkdown,
    Loader,
    NoDataMessage,
  },
  mixins: [FormMixin],

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    form: {
      asset: {},
      amount: '',
    },
    offers: [],
    isLoaded: false,
    isLoadingFailed: false,
    MIN_AMOUNT: config.MIN_AMOUNT,
    convertedAmount: 0,
    isConvertedAmountLoaded: true,
    isConvertingFailed: false,
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

    quoteAssetBalances () {
      let quoteAssetBalances = []

      this.sale.quoteAssets.forEach(quote => {
        const balance = this.balances.find(balanceItem => {
          return balanceItem.asset === quote.asset &&
            Number(balanceItem.balance) > 0
        })

        if (balance) {
          quoteAssetBalances.push(balance)
        }
      })

      return quoteAssetBalances
    },

    quoteAssetListValues () {
      return this.quoteAssetBalances.map(balance => balance.assetDetails)
    },

    availableAmount () {
      const quoteBalance = this.quoteAssetBalances
        .find(balance => balance.asset === this.form.asset.code)

      const availableBalance = this.currentAssetOffer.quoteAmount
        ? Number(quoteBalance.balance) +
            Number(this.currentAssetOffer.quoteAmount)
        : quoteBalance.balance

      return {
        value: availableBalance,
        currency: this.form.asset.code,
      }
    },

    convertAmountLoader () {
      return _throttle(this.loadConvertedAmount, CONVERTING_DELAY)
    },

    currentAssetOffer () {
      return this.offers
        .find(offer => offer.quoteAssetCode === this.form.asset.code) || {}
    },

    isCapExceeded () {
      return Number(this.convertedAmount) > this.investedCap
    },

    investedCap () {
      const availableCap = this.sale.hardCap - this.sale.currentCap

      if (this.currentAssetOffer.quoteAmount) {
        return availableCap + Number(this.currentAssetOffer.quoteAmount)
      } else {
        return availableCap
      }
    },

    canUpdateOffer () {
      return this.sale.owner !== this.accountId &&
        !this.sale.isUpcoming &&
        !this.sale.isClosed &&
        !this.sale.isCanceled
    },

    canSubmit () {
      return this.canUpdateOffer &&
        !this.isCapExceeded &&
        this.isConvertedAmountLoaded
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
    try {
      await this.loadBalances()
      await this.loadOffers()

      if (this.quoteAssetListValues.length) {
        this.form.asset = this.quoteAssetListValues[0]
      }

      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback()
    }
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async loadOffers () {
      const { data } = await Sdk.horizon.account.getOffers(this.accountId, {
        is_buy: true,
        order_book_id: this.sale.id,
      })
      this.offers = data
    },

    setConvertedAmount () {
      if (this.form.asset.code === this.sale.defaultQuoteAsset) {
        this.convertedAmount = this.form.amount
      } else if (this.form.amount === '') {
        this.convertedAmount = 0
      } else {
        this.convertAmountLoader()
      }
    },

    async loadConvertedAmount () {
      this.isConvertingFailed = false
      this.isConvertedAmountLoaded = false

      try {
        const { data } = await Sdk.horizon.assetPairs.convert({
          source_asset: this.form.asset.code,
          dest_asset: this.sale.defaultQuoteAsset,
          amount: this.form.amount,
        })
        this.convertedAmount = data.amount
        this.isConvertedAmountLoaded = true
      } catch (e) {
        this.isConvertingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async submit () {
      if (!this.isFormValid()) return

      this.disableForm()

      try {
        const baseBalance = this.balances
          .find(balance => balance.asset === this.sale.baseAsset)
        if (!baseBalance) {
          await this.createBalance(this.sale.baseAsset)
        }

        const operations = await this.getOfferOperations()
        await Sdk.horizon.transactions.submitOperations(...operations)
        await this.loadBalances()

        Bus.success({
          messageId: 'invest-form.investment-submitted-msg',
          messageArgs: {
            asset: this.sale.baseAsset,
          },
        })
        this.$emit(EVENTS.submitted)
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },

    async createBalance (assetCode) {
      const operation = base.Operation.manageBalance({
        destination: this.accountId,
        asset: assetCode,
        action: base.xdr.ManageBalanceAction.createUnique(),
      })

      await Sdk.horizon.transactions.submitOperations(operation)
      await this.loadBalances()
    },

    async getOfferOperations () {
      const { data: fee } = await Sdk.horizon.fees.get(FEE_TYPES.offerFee, {
        asset: this.form.asset.code,
        account: this.accountId,
        amount: this.converted,
      })

      let operations = []

      if (this.currentAssetOffer.offerId) {
        operations.push(base.ManageOfferBuilder.cancelOffer(
          this.getOfferOpts(
            String(this.currentAssetOffer.offerId),
            CANCEL_OFFER_FEE
          )
        ))
      }

      operations.push(
        base.ManageOfferBuilder.manageOffer(
          this.getOfferOpts(OFFER_CREATE_ID, fee.percent)
        ),
      )

      return operations
    },

    getOfferOpts (offerId, offerFee) {
      return {
        offerID: offerId,
        baseBalance: this.balances
          .find(balance => balance.asset === this.sale.baseAsset).balanceId,
        quoteBalance: this.balances
          .find(balance => balance.asset === this.form.asset.code).balanceId,
        isBuy: true,
        amount: this.form.amount,
        price: this.sale.quoteAssetPrices[this.form.asset.code] ||
          DEFAULT_QUOTE_PRICE,
        fee: offerFee,
        orderBookID: this.sale.id,
      }
    },

    async cancelOffer () {
      this.disableForm()

      try {
        const operation = base.ManageOfferBuilder.cancelOffer(
          this.getOfferOpts(
            String(this.currentAssetOffer.offerId),
            CANCEL_OFFER_FEE
          )
        )
        await Sdk.horizon.transactions.submitOperations(operation)
        await this.loadBalances()

        Bus.success('invest-form.offer-canceled-msg')
        this.$emit(EVENTS.canceled)
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss">
@import './app-form';

.invest-form__amount-hint {
  p {
    font-size: 1.2rem;
  }

  strong {
    color: $col-text-highlighted;
  }
}

.invest-form__current-offer {
  margin-top: 2rem;

  p {
    font-size: 1.6rem;
  }

  strong {
    color: $col-text-highlighted;
  }
}

.invest-form__actions {
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 1.9rem -.5rem -.5rem;
}

.invest-form__submit-btn {
  margin: .5rem;
  max-width: 18rem;
  width: 100%;
}

.invest-form__cancel-btn {
  padding: 0;
  font-weight: normal;
  max-width: 13rem;
  margin: .5rem;

  &[disabled] {
    filter: grayscale(100%);
    cursor: default;
  }
}
</style>
