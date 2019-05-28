<template>
  <div class="invest-form">
    <!-- eslint-disable-next-line -->
    <template v-if="isLoaded && isAllowedAccountType">
      <form
        novalidate
        id="invest-form"
        class="app__form"
        @submit.prevent="processInvestment"
      >
        <message-box
          v-if="!canUpdateOffer"
          type="danger"
          :title="'invest-form.investment-disabled-title' | globalize"
          :message="investmentDisabledMessageId | globalize"
        />

        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              v-model="form.asset"
              :values="quoteAssetListValues"
              key-as-value-text="nameAndCode"
              :label="'invest-form.asset-lbl' | globalize"
              name="invest-asset"
              @blur="touchField('form.asset')"
              :disabled="view.mode === VIEW_MODES.confirm || !canUpdateOffer"
            />

            <vue-markdown
              class="app__form-field-description invest-form__amount-hint"
              :source="'invest-form.balance-hint' | globalize({
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
              name="invest-amount"
              :label="'invest-form.amount-lbl' | globalize({
                asset: form.asset.code
              })"
              :error-message="getFieldErrorMessage(
                'form.amount',
                {
                  from: MIN_AMOUNT,
                  to: availableAmount.value,
                  saleCap: {
                    value: investedCap,
                    currency: sale.defaultQuoteAsset
                  }
                }
              )"
              :disabled="view.mode === VIEW_MODES.confirm || !canUpdateOffer"
            />

            <p class="app__form-field-description">
              <vue-markdown
                v-if="isAssetPairPriceLoaded"
                class="app__form-field-description invest-form__amount-hint"
                :source="'invest-form.converted-amount-hint' | globalize({
                  amount: {
                    value: convertedAmount,
                    currency: sale.defaultQuoteAsset
                  }
                })"
              />

              <template v-else-if="isPriceLoadFailed">
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
              currency: currentInvestment.quoteAsset.id
            }
          })"
        />
      </form>

      <transition name="app__fade-in">
        <div
          class="invest-form__fee-box"
          v-if="isFeesLoaded">
          <h3 class="invest-form__fee-box-heading">
            {{ 'invest-form.transaction-fees-heading' | globalize }}
          </h3>
          <template v-if="+fees.fixed || +fees.percent">
            <p
              class="invest-form__fee"
              v-if="fees.fixed">
              - {{ fees.fixed | formatNumber }}
              {{ form.asset.code }}
              <span class="invest-form__fee-type">
                {{ 'invest-form.fixed-fee-label' | globalize }}
              </span>
            </p>

            <p
              class="invest-form__fee"
              v-if="fees.percent">
              - {{ fees.percent | formatNumber }}
              {{ form.asset.code }}
              <span class="invest-form__fee-type">
                {{ 'invest-form.percent-fee-label' | globalize }}
              </span>
            </p>
          </template>

          <template v-else>
            <p class="invest-form__no-fee-msg">
              {{ 'invest-form.no-transaction-fees-msg' | globalize }}
            </p>
          </template>

          <h3 class="invest-form__fee-box-heading">
            {{ 'invest-form.total-fee-label' | globalize }}
          </h3>

          <p class="invest-form__fee">
            - {{
              { value: totalAmount, currency: form.asset.code } | formatMoney
            }}
            <span class="invest-form__fee-type">
              {{ 'invest-form.total-amount-label' | globalize }}
            </span>
          </p>
        </div>
      </transition>

      <div class="app__form-actions">
        <template
          v-if="currentInvestment.id &&
            view.mode === VIEW_MODES.submit">
          <button
            v-ripple
            type="button"
            @click="processInvestment"
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
            v-if="view.mode === VIEW_MODES.submit"
            click="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled || !canSubmit"
            form="invest-form">
            {{ 'invest-form.continue-btn' | globalize }}
          </button>
        </template>

        <form-confirmation
          v-if="view.mode === VIEW_MODES.confirm"
          :message="'invest-form.recheck-form-msg' | globalize"
          :ok-button="'invest-form.invest-btn' | globalize"
          :is-pending="isSubmitting"
          @cancel="updateView(VIEW_MODES.submit)"
          @ok="submit()"
        />
      </div>
    </template>

    <template v-else-if="isLoadingFailed && isAllowedAccountType">
      <p>
        {{ 'invest-form.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else-if="!isAllowedAccountType">
      <no-data-message
        icon-name="alert-circle"
        :title="
          (
            isAccountUsVerified
              ? 'invest-form.requires-us-accreditation-title'
              : 'invest-form.requires-verification-title'
          ) | globalize
        "
        :message="
          (
            isAccountUsVerified
              ? 'invest-form.requires-us-accreditation-desc'
              : 'invest-form.requires-verification-desc'
          ) | globalize
        "
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
import MessageBox from '@/vue/common/MessageBox'

import config from '@/config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { api } from '@/api'
import { base, FEE_TYPES } from '@tokend/js-sdk'

import { SaleRecord } from '@/js/records/entities/sale.record'
import { AssetRecord } from '@/js/records/entities/asset.record'

import { required, amountRange } from '@validators'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { MathUtil } from '@/js/utils'

const EVENTS = {
  submitted: 'submitted',
  canceled: 'canceled',
}

const VIEW_MODES = {
  submit: 'submit',
  confirm: 'confirm',
}

const OFFER_CREATE_ID = '0'
const CANCEL_OFFER_FEE = '0'
const DEFAULT_QUOTE_PRICE = '1'

export default {
  name: 'invest-form',
  components: {
    VueMarkdown,
    Loader,
    NoDataMessage,
    MessageBox,
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
    assetPairPrice: '',
    currentInvestment: {},
    view: {
      mode: VIEW_MODES.submit,
    },
    fees: {
      fixed: '',
      percent: '',
    },
    saleBaseAsset: null,
    isLoaded: false,
    isLoadingFailed: false,
    MIN_AMOUNT: config.MIN_AMOUNT,
    isAssetPairPriceLoaded: true,
    isPriceLoadFailed: false,
    isFeesLoaded: false,
    isSubmitting: false,
    VIEW_MODES,
    vueRoutes,
  }),

  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.availableAmount.value),
          noMoreThanSaleCap: _ => !this.isCapExceeded,
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      kvAssetTypeKycRequired: vuexTypes.kvAssetTypeKycRequired,
      kvAssetTypeSecurity: vuexTypes.kvAssetTypeSecurity,
      isAccountCorporate: vuexTypes.isAccountCorporate,
      isAccountUnverified: vuexTypes.isAccountUnverified,
      isAccountGeneral: vuexTypes.isAccountGeneral,
      isAccountUsAccredited: vuexTypes.isAccountUsAccredited,
      isAccountUsVerified: vuexTypes.isAccountUsVerified,
      balances: vuexTypes.accountBalances,
    }),

    convertedAmount () {
      if (this.form.asset.code === this.sale.defaultQuoteAsset) {
        return this.form.amount
      } else {
        return MathUtil.multiply(this.form.amount, this.assetPairPrice)
      }
    },

    quoteAssetBalances () {
      let quoteAssetBalances = []

      this.sale.quoteAssets.forEach(quote => {
        const balance = this.balances.find(balanceItem => {
          return balanceItem.asset.code === quote.asset.id
        })

        if (balance) {
          quoteAssetBalances.push(balance)
        }
      })

      return quoteAssetBalances
    },

    quoteAssetListValues () {
      return this.quoteAssetBalances.map(balance => balance.asset)
    },

    availableAmount () {
      const quoteBalance = this.quoteAssetBalances
        .find(balance => balance.asset.code === this.form.asset.code)

      const availableBalance = this.currentInvestment.quoteAmount
        ? Number(quoteBalance.balance) +
        Number(this.currentInvestment.quoteAmount)
        : quoteBalance.balance

      return {
        value: availableBalance,
        currency: this.form.asset.code,
      }
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
      switch (this.sale.baseAsset.assetType) {
        case this.kvAssetTypeKycRequired:
          return !this.isAccountUnverified
        case this.kvAssetTypeSecurity:
          return this.isAccountGeneral ||
                 this.isAccountUsAccredited ||
                 this.isAccountCorporate
        default:
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
        this.isAssetPairPriceLoaded
    },

    totalAmount () {
      const fees = MathUtil
        .add(this.fees.fixed, this.fees.percent)
      return MathUtil.add(fees, this.form.amount)
    },

    investmentDisabledMessageId () {
      let messageId

      if (this.sale.owner === this.accountId) {
        messageId = 'invest-form.sale-owner-msg'
      } else if (this.sale.isClosed) {
        messageId = 'invest-form.closed-sale-msg'
      } else if (this.sale.isUpcoming) {
        messageId = 'invest-form.upcoming-sale-msg'
      } else if (this.sale.isCanceled) {
        messageId = 'invest-form.canceled-sale-msg'
      }

      return messageId
    },
  },

  watch: {
    'form.asset': async function () {
      try {
        if (this.form.asset.code !== this.sale.defaultQuoteAsset) {
          await this.loadAssetPairPrice()
        }

        await this.loadCurrentInvestment()
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },

  async created () {
    try {
      await this.loadSaleBaseAsset()
      await this.loadBalances()
      if (this.quoteAssetListValues.length) {
        this.form.asset = this.quoteAssetListValues[0]
      }

      await this.loadCurrentInvestment()

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
      const endpoint = `/v3/assets/${this.sale.baseAsset}`
      const { data } = await api.get(endpoint)

      this.saleBaseAsset = new AssetRecord(data)
    },

    async loadCurrentInvestment () {
      const { data: offers } = await api.getWithSignature('/v3/offers', {
        filter: {
          order_book: this.sale.id,
          owner: this.accountId,
          is_buy: 1,
          quote_asset: this.form.asset.code,
          base_asset: this.sale.baseAsset,
        },
      })

      this.currentInvestment = offers[0] || {}
    },

    async loadAssetPairPrice () {
      this.isPriceLoadFailed = false
      this.isAssetPairPriceLoaded = false

      try {
        const sourceAsset = this.form.asset.code
        const destAsset = this.sale.defaultQuoteAsset

        const endpoint = `/v3/asset_pairs/${sourceAsset}:${destAsset}`
        const { data: assetPair } = await api.get(endpoint)

        this.assetPairPrice = assetPair.price
        this.isAssetPairPriceLoaded = true
      } catch (e) {
        this.isPriceLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async submit () {
      if (!this.isFormValid()) return
      this.updateView(VIEW_MODES.submit)
      this.disableForm()
      this.isSubmitting = true

      try {
        const baseBalance = this.balances
          .find(balance => balance.asset.code === this.sale.baseAsset)
        if (!baseBalance) {
          await this.createBalance(this.sale.baseAsset)
        }

        const operations = await this.getOfferOperations()
        await api.postOperations(...operations)
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
      this.isSubmitting = false
      this.enableForm()
      this.hideConfirmation()
    },

    async createBalance (assetCode) {
      const operation = base.Operation.manageBalance({
        destination: this.accountId,
        asset: assetCode,
        action: base.xdr.ManageBalanceAction.createUnique(),
      })

      await api.postOperations(operation)
      await this.loadBalances()
    },

    async getOfferOperations () {
      const fee = await this.getOfferFee()

      let operations = []

      if (this.currentInvestment.id) {
        operations.push(base.ManageOfferBuilder.cancelOffer(
          this.getOfferOpts(
            String(this.currentInvestment.id),
            CANCEL_OFFER_FEE
          )
        ))
      }
      operations.push(
        base.ManageOfferBuilder.manageOffer(
          this.getOfferOpts(OFFER_CREATE_ID, fee.calculatedPercent)
        ),
      )

      return operations
    },

    async getOfferFee () {
      const baseEndpoint = `/v3/accounts/${this.accountId}/calculated_fees`
      const params = [
        `asset=${this.form.asset.code}`,
        `fee_type=${FEE_TYPES.investFee}`,
        `amount=${this.form.amount}`,
      ]

      const endpoint = `${baseEndpoint}?${params.join('&')}`
      const { data: fee } = await api.get(endpoint)

      return fee
    },

    getOfferOpts (id, offerFee) {
      return {
        offerID: id,
        baseBalance: this.balances
          .find(balance => balance.asset.code === this.sale.baseAsset).id,
        quoteBalance: this.balances
          .find(balance => balance.asset.code === this.form.asset.code).id,
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
            String(this.currentInvestment.id),
            CANCEL_OFFER_FEE
          )
        )
        await api.postOperations(operation)
        await this.loadBalances()

        Bus.success('invest-form.offer-canceled-msg')
        this.$emit(EVENTS.canceled)
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },

    async processInvestment () {
      if (!await this.isFormValid()) return
      this.disableForm()
      try {
        const fee = await this.getOfferFee()
        this.fees.fixed = fee.fixed
        this.fees.percent = fee.calculatedPercent
        this.isFeesLoaded = true
        this.updateView(VIEW_MODES.confirm)
      } catch (error) {
        ErrorHandler.process(error)
        this.isFeesLoaded = false
      }
      this.enableForm()
    },

    updateView (mode) {
      this.view.mode = mode
    },
  },
}
</script>

<style lang="scss">
@import './app-form';

// Disabled because vue-markdown
/* stylelint-disable selector-nested-pattern */
.invest-form__amount-hint {
  p {
    font-size: 1.2rem;
  }

  strong {
    color: $col-text-highlighted;
  }
}
/* stylelint-enable selector-nested-pattern */

// Disabled because vue-markdown
/* stylelint-disable selector-nested-pattern */
.invest-form__current-investment {
  margin-top: 2rem;

  p {
    font-size: 1.6rem;
  }

  strong {
    color: $col-text-highlighted;
  }
}
/* stylelint-enable selector-nested-pattern */

.invest-form__actions {
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: -0.5rem;
}

.invest-form__submit-btn {
  margin: 0.5rem;
  max-width: 18rem;
  width: 100%;
}

.invest-form__cancel-btn {
  padding: 0;
  font-weight: 400;
  max-width: 13rem;
  margin: 0.5rem;

  &:disabled {
    filter: grayscale(100%);
    cursor: default;
  }
}

.invest-form__discover-tokens-btn {
  margin: 2rem auto 0;
}

.invest-form__fee {
  color: $col-details-value;
  font-size: 1.6rem;
  line-height: 1.5;
  margin: 0;
}

.invest-form__fee-box {
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 0.1rem dashed $col-text-field-hint-inactive;
}

.invest-form__fee-box-heading:not(:first-child) {
  margin-top: 2.5rem;
}

.invest-form__fee-type {
  color: $col-details-label;
}

.invest-form__no-fee-msg {
  color: $col-details-label;
  font-size: 1.6rem;
  line-height: 1.5;
  margin: 1rem 0;
}
</style>
