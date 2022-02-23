<template>
  <form
    v-if="isLoaded"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="form.assetCode"
          name="trade-offer-base-asset"
          :disabled="formMixin.isDisabled"
          :label="baseAssetLabelTranslationId | globalize"
        >
          <option
            v-for="asset in accountAssets"
            :key="asset"
            :value="asset"
          >
            {{ asset }}
          </option>
        </select-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          name="trade-offer-price"
          type="number"
          :min="0"
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          :label="
            'create-trade-offer-form.price-lbl' | globalize({
              baseAsset: form.assetCode,
              quoteAsset: assetPair.quote
            })
          "
          :error-message="getFieldErrorMessage(
            'form.price', {
              min: config.MIN_AMOUNT,
              max: config.MAX_AMOUNT,
              available: quoteAssetBalance
            }
          )"
          @blur="touchField('form.price')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.amount"
          name="trade-offer-amount"
          type="number"
          :min="0"
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          :label="'create-trade-offer-form.amount-lbl' | globalize({
            asset: form.assetCode
          })"
          :error-message="getFieldErrorMessage(
            'form.amount',
            {
              available: baseAssetBalance,
              min: config.MIN_AMOUNT,
              max: config.MAX_AMOUNT,
            }
          )"
          @blur="touchField('form.amount')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <template v-if="isFeesLoaded">
          <readonly-field
            :label="'create-trade-offer-form.total-amount-lbl' | globalize"
            :value="{
              value: quoteAmount,
              currency: assetPair.quote,
            } | formatMoney"
            :error-message="getFieldErrorMessage(
              'quoteAmount',
              {
                available: quoteAssetBalance,
                min: config.MIN_AMOUNT,
                max: config.MAX_AMOUNT,
              }
            )"
          />

          <fees-renderer
            class="create-trade-offer-form__fees"
            :fees-collection="fees"
          />
        </template>

        <template v-else>
          <loader message-id="create-trade-offer-form.loading-msg" />
        </template>
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
      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="app__button-raised create-trade-offer-form__btn"
          :disabled="formMixin.isDisabled || !isFeesLoaded"
        >
          <template v-if="isBuy">
            {{ 'create-trade-offer-form.buy-btn' | globalize }}
          </template>

          <template v-else>
            {{ 'create-trade-offer-form.sell-btn' | globalize }}
          </template>
        </button>
      </div>
    </template>
  </form>
  <skeleton-loader-offer-form
    v-else
  />
</template>

<script>
import debounce from 'lodash/debounce'

import ReadonlyField from '@/vue/fields/ReadonlyField'
import Loader from '@/vue/common/Loader'
import SkeletonLoaderOfferForm from './SkeletonLoaderOfferForm'
import FeesRenderer from '@/vue/common/fees/FeesRenderer'

import FormMixin from '@/vue/mixins/form.mixin'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { TradeFormer } from '@/js/formers/TradeFormer'

import { MathUtil } from '@/js/utils/math.util'
import config from '@/config'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

import _get from 'lodash/get'
import { api } from '@/api'

import {
  required,
  amountRange,
  maxValueBig,
  decimal,
} from '@validators'

const EVENTS = {
  offerCreated: 'offer-created',
}

const FEES_LOADING_DELAY_MS = 300

export default {
  name: 'create-trade-offer-form',
  components: {
    ReadonlyField,
    SkeletonLoaderOfferForm,
    FeesRenderer,
    Loader,
  },
  mixins: [
    FormMixin,
  ],

  props: {
    assetPair: { type: Object, required: true },
    isBuy: { type: Boolean, default: false },
    former: { type: TradeFormer, default: () => new TradeFormer() },
  },

  data: () => ({
    form: {
      price: '',
      amount: '0',
      assetCode: '',
    },
    fees: {},
    feesDebouncedRequest: null,
    isFeesLoaded: false,
    isFeesLoadFailed: false,
    isLoaded: false,
    isOfferCreating: false,
    config,
  }),

  validations () {
    return {
      form: {
        price: {
          required,
          decimal,
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
        amount: {
          required,
          decimal,
          noMoreThanAvailableOnBalance: this.isBuy ||
            maxValueBig(this.baseAssetBalance),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
      },

      quoteAmount: {
        noMoreThanAvailableOnBalance: !this.isBuy ||
          maxValueBig(this.quoteAssetBalance),
        amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
      },
    }
  },

  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
      accountId: vuexTypes.accountId,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),

    baseAssetLabelTranslationId () {
      return this.isBuy
        ? 'create-trade-offer-form.asset-to-buy-lbl'
        : 'create-trade-offer-form.asset-to-sell-lbl'
    },

    accountAssets () {
      return this.accountBalances
        .map(balance => balance.asset.code)
        .filter(asset => asset !== this.assetPair.quote)
    },

    baseAssetBalance () {
      const balanceItem = this.accountBalanceByCode(this.form.assetCode)

      return balanceItem ? balanceItem.balance : ''
    },

    quoteAssetBalance () {
      const balanceItem = this.accountBalanceByCode(this.assetPair.quote)

      if (balanceItem) {
        this.former.setAttr('quoteBalanceId', balanceItem.id)
      }

      return balanceItem ? balanceItem.balance : ''
    },

    quoteAmount () {
      if (this.form.price && this.form.amount) {
        let quoteAmount = MathUtil.multiply(this.form.price, this.form.amount)
        this.former.setAttr('quoteAmount', quoteAmount)
        return quoteAmount
      } else {
        return ''
      }
    },
  },

  watch: {
    'form.amount' () {
      this.former.setAttr('baseAmount', this.form.amount)
      this.tryLoadFees()
    },

    'form.price' () {
      this.tryLoadFees()
    },

    'form.assetCode' () {
      this.former.setAttr('baseAssetCode', this.form.assetCode)
      this.former.setAttr('baseBalanceId',
        this.accountBalanceByCode(this.form.assetCode).id)
      this.tryLoadFees()
    },
  },

  async created () {
    try {
      await this.loadBalances()
      this.setDefaultAsset()
      this.former.setAttr('isBuy', this.isBuy)
      this.former.setAttr('quoteAssetCode', this.assetPair.quote)
      this.former.setAttr('creatorAccountId', this.accountId)
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
      createBalance: vuexTypes.CREATE_BALANCE,
    }),
    tryLoadFees () {
      this.isFeesLoaded = false
      this.isFeesLoadFailed = false

      if (!this.feesDebouncedRequest) {
        this.feesDebouncedRequest = debounce(
          () => this.loadFees(),
          FEES_LOADING_DELAY_MS,
        )
      }
      return this.feesDebouncedRequest()
    },

    async loadFees () {
      try {
        this.fees = await this.former.calculateFees()
        this.isFeesLoaded = true
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async submit () {
      this.isOfferCreating = true
      try {
        await this.createBalance([this.former.attrs.quoteAssetCode])

        this.former.setAttr('quoteBalanceId',
          this.accountBalanceByCode(this.former.attrs.quoteAssetCode).id)

        const operation = await this.former.buildOpCreate()
        await api.postOperations(operation)
        Bus.success('create-trade-offer-form.order-created-msg')
        this.$emit(EVENTS.offerCreated)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isOfferCreating = false
      this.hideConfirmation()
    },

    setDefaultAsset () {
      const accountBalances = this.accountBalanceByCode(this.assetPair.base)
      this.form.assetCode = _get(accountBalances, 'asset.code', this.accountAssets[0])
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../app-form';

.create-trade-offer-form__btn {
  max-width: 14rem;
  width: 100%;
}

.create-trade-offer-form__fees {
  margin-top: 1rem;
}
</style>
