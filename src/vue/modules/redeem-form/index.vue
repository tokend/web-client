<template>
  <div>
    <div
      class="redeem-form-module"
      v-if="isInitialized && assetsInBalance.length"
    >
      <form @submit.prevent="showConfirmation">
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              v-model="form.asset"
              :values="assetsInBalance"
              key-as-value-text="nameAndCode"
              class="app__select"
              :label="'redeem-form.opportunity-uniq-code-lbl' | globalize"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              v-if="selectedSale.defaultQuoteAsset"
              :label="'redeem-form.quote-asset-lbl' | globalize"
              v-model="selectedSale.defaultQuoteAsset.id"
              name="redeem-quote-asset"
              :readonly="true"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              :label="'redeem-form.total-lbl' | globalize"
              v-model="form.totalAmount"
              name="redeem-total"
              :readonly="true"
            />
          </div>
        </div>

        <template v-if="formMixin.isConfirmationShown">
          <form-confirmation
            @cancel="hideConfirmation"
            @ok="submit"
            :is-pending="isRedeemProcessing"
            class="app__form-confirmation"
          />
        </template>

        <template v-else>
          <div class="app__form-actions">
            <button
              v-ripple
              type="submit"
              class="app__form-submit-btn app__button-raised"
              :disabled="formMixin.isDisabled"
            >
              <template>
                {{ 'redeem-form.submit-sell-btn' | globalize }}
              </template>
            </button>
          </div>
        </template>
      </form>
    </div>
    <no-data-message
      :title="'redeem-form.no-investments' | globalize"
      :message="'redeem-form.here-will-investments-list' | globalize"
      v-else-if="!assetsInBalance.length && isInitialized"
    />
    <loader v-else message-id="redeem-form.loading-msg" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { Wallet, errors } from '@tokend/js-sdk'
import { initApi } from './_api'

import FormConfirmation from '@/vue/common/FormConfirmation'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import FormMixin from '@/vue/mixins/form.mixin'

import { MathUtil } from '@/js/utils/math.util'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { OPERATION_ERROR_CODES } from '@/js/const/operation-error-codes'

const EVENTS = {
  redeemed: 'redeemed',
}

export default {
  name: 'redeem-form',
  components: {
    FormConfirmation,
    NoDataMessage,
    Loader,
  },
  mixins: [FormMixin],
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     * @property config.minAmount - min allowed amount
     * @property config.maxAmount - max allowed amount
     * @property [config.defaultAssetCode] - prefills the asset-selector with
     *           this asset code
     */
    config: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    isInitialized: false,
    form: {
      asset: {},
      quoteAsset: {},
      totalAmount: '',
    },
    selectedSale: {},
    isRedeemProcessing: false,
  }),
  computed: {
    ...mapGetters('redeem-form', {
      balances: types.balances,
      assets: types.assets,
      assetsInBalance: types.assetsInBalance,
      selectedAssetBalance: types.selectedAssetBalance,
      accountId: types.accountId,
    }),
  },
  watch: {
    async 'form.asset' (asset) {
      this.disableForm()
      this.selectedSale = await this.loadSaleByBaseAsset(asset.code)
      this.form.quoteAsset = this.selectedSale.quoteAssets[0]
      this.enableForm()
    },
    selectedSale (sale) {
      this.form.totalAmount = this.calculateRedeemPrice(sale)
    },
  },
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
    await this.loadAccountBalances()
    await this.loadAssets()
    this.setDefaultAsset()
    this.isInitialized = true
  },
  methods: {
    ...mapMutations('redeem-form', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('redeem-form', {
      loadBalances: types.LOAD_BALANCES,
      loadAssets: types.LOAD_ASSETS,
      loadSaleByBaseAsset: types.LOAD_SALE_BY_BASE_ASSET,
      createOffer: types.CREATE_OFFER,
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async submit () {
      this.disableForm()
      this.isRedeemProcessing = true
      try {
        await this.createOffer(this.getCreateOfferOpts())
        Bus.success('offer-manager.success-creating')
      } catch (error) {
        if (
          error instanceof errors.TransactionError &&
          error.includesOpCode(OPERATION_ERROR_CODES.opCrossSelf)
        ) {
          Bus.error('offer-manager.error-operation-cross-self')
        } else {
          ErrorHandler.process(error)
        }
      }
      this.isRedeemProcessing = false
      this.enableForm()
      this.hideConfirmation()
      this.$emit(EVENTS.redeemed)
    },
    getCreateOfferOpts () {
      return {
        pair: {
          base: this.form.asset.code,
          quote: this.form.quoteAsset.id,
        },
        baseAmount: this.selectedAssetBalance(this.form.asset.code),
        quoteAmount: this.form.totalAmount,
        price: this.form.asset.details.redeemPrice,
        isBuy: false,
        accountId: this.accountId,
      }
    },
    setDefaultAsset () {
      if (this.config.defaultAssetCode) {
        this.setDefaultAssetCodeAsSelected()
      } else {
        this.form.asset = this.assetsInBalance[0]
      }
    },
    setDefaultAssetCodeAsSelected () {
      if (!this.config.defaultAssetCode) {
        throw new Error('The "defaultAssetCode" property is not defined in the module config!')
      }

      this.form.asset = this.assetsInBalance
        .find(item => item.code === this.config.defaultAssetCode)
    },
    calculateRedeemPrice (sale) {
      return MathUtil.multiply(
        this.form.asset.details.redeemPrice || '0',
        this.selectedAssetBalance(this.form.asset.code)
      )
    },
  },
}
</script>

<style lang="scss">
@import '@/vue/forms/_app-form';
</style>
