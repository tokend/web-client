<template>
  <div class="invest-form">
    <!-- eslint-disable-next-line -->
    <template v-if="isLoaded && quoteAssetBalances.length && isAllowedAccountType">
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
              name="invest-asset"
              @blur="touchField('form.asset')"
              :disabled="formMixin.isDisabled || !canUpdateOffer"
            />

            <vue-markdown
              class="app__form-field-description invest-form__amount-hint"
              :source="'invest-form.available-amount-hint' | globalize({
                amount: availableAmount
              })"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.amount"
              @input="touchField('form.amount')"
              id="invest-amount"
              name="invest-amount"
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

        <vue-markdown
          v-if="currentInvestment.quoteAmount"
          class="invest-form__current-investment"
          :source="'invest-form.current-investment' | globalize({
            amount: {
              value: currentInvestment.quoteAmount,
              currency: currentInvestment.quoteAssetCode
            }
          })"
        />

        <div class="app__form-actions invest-form__actions">
          <template v-if="formMixin.isConfirmationShown">
            <form-confirmation
              @ok="submit"
              :is-pending="isSubmitting"
              @cancel="hideConfirmation"
            />
          </template>

          <template v-else>
            <template v-if="currentInvestment.offerId">
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
                class="app__button-flat"
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
            />
          </template>
        </p>
      </form>
    </template>

    <template v-else-if="isLoaded && isAllowedAccountType">
      <no-data-message
        icon-name="alert-circle"
        :title="'invest-form.insufficient-balance-title' | globalize"
        :message="'invest-form.insufficient-balance-desc' | globalize"
      >
        <router-link
          :to="vueRoutes.movements"
          tag="button"
          type="button"
          class="app__button-raised invest-form__discover-assets-btn"
        >
          {{ 'invest-form.deposit-btn' | globalize }}
        </router-link>
      </no-data-message>
    </template>

    <template v-else-if="isLoadingFailed && isAllowedAccountType">
      <p>
        {{ 'invest-form.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else-if="!isAllowedAccountType">
      <no-data-message
        icon-name="alert-circle"
        :title="'invest-form.requires-kyc-title' | globalize"
        :message="'invest-form.requires-kyc-desc' | globalize"
      />
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
import { AssetRecord } from '@/js/records/entities/asset.record'

import { required, amountRange } from '@validators'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { MathUtil } from '@/js/utils'

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
    saleBaseAsset: null,
    isLoaded: false,
    isLoadingFailed: false,
    MIN_AMOUNT: config.MIN_AMOUNT,
    convertedAmount: 0,
    isConvertedAmountLoaded: true,
    isConvertingFailed: false,
    isSubmitting: false,
    vueRoutes,
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
      isAccountUnverified: vuexTypes.isAccountUnverified,
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

      const availableBalance = this.currentInvestment.quoteAmount
        ? Number(quoteBalance.balance) +
            Number(this.currentInvestment.quoteAmount)
        : quoteBalance.balance

      return {
        value: availableBalance,
        currency: this.form.asset.code,
      }
    },

    convertAmountLoader () {
      return _throttle(this.loadConvertedAmount, CONVERTING_DELAY)
    },

    currentInvestment () {
      return this.offers
        .find(offer => offer.quoteAssetCode === this.form.asset.code) || {}
    },

    isCapExceeded () {
      return Number(this.convertedAmount) > this.investedCap
    },

    investedCap () {
      const availableCap = this.sale.hardCap - this.sale.currentCap

      if (this.currentInvestment.quoteAmount) {
        return availableCap + Number(this.currentInvestment.quoteAmount)
      } else {
        return availableCap
      }
    },

    isAllowedAccountType () {
      if (this.saleBaseAsset) {
        return !(this.saleBaseAsset.isRequiresKYC && this.isAccountUnverified)
      } else {
        return true
      }
    },

    canUpdateOffer () {
      return this.sale.owner !== this.accountId &&
        !this.sale.isUpcoming &&
        !this.sale.isClosed &&
        !this.sale.isCanceled &&
        this.isAllowedAccountType
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
      await this.loadSaleBaseAsset()
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

    async loadSaleBaseAsset () {
      const { data } = await Sdk.horizon.assets.get(this.sale.baseAsset)

      this.saleBaseAsset = new AssetRecord(data)
    },

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
      this.isSubmitting = true

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
        ErrorHandler.process(e)
      }

      this.enableForm()
      this.isSubmitting = false
      this.hideConfirmation()
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

      if (this.currentInvestment.offerId) {
        operations.push(base.ManageOfferBuilder.cancelOffer(
          this.getOfferOpts(
            String(this.currentInvestment.offerId),
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
        amount: MathUtil.divide(
          this.form.amount,
          // TODO: remove DEFAULT_QUOTE_PRICE
          this.sale.quoteAssetPrices[this.form.asset.code] ||
            DEFAULT_QUOTE_PRICE
        ),
        // TODO: remove DEFAULT_QUOTE_PRICE
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
            String(this.currentInvestment.offerId),
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

.invest-form__current-investment {
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
  margin: -.5rem;
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

.invest-form__discover-assets-btn {
  margin: 2rem auto 0;
}
</style>
