<template>
  <div class="withdrawal">
    <template v-if="isLoaded">
      <template v-if="assets.length">
        <form
          @submit.prevent="isFormValid() && showConfirmation()"
          novalidate
        >
          <div class="app__form-row withdrawal__form-row">
            <div class="app__form-field">
              <select-field
                name="withdrawal-asset"
                v-model="form.asset"
                :values="assets"
                key-as-value-text="nameAndCode"
                :disabled="formMixin.isDisabled"
                :label="'withdrawal-form.asset' | globalize"
              />
              <div class="withdrawal__form-field-description">
                <p>
                  {{
                    'withdrawal-form.balance' | globalize({
                      balance: {
                        value: form.asset.balance.value,
                        currency: form.asset.code
                      }
                    })
                  }}
                </p>
              </div>
              <div class="withdrawal__form-field-description">
                <p>
                  <span>{{ 'withdrawal-form.reviewer' | globalize }}</span>
                  <email-getter :account-id="form.asset.owner" />
                </p>
              </div>
            </div>
          </div>

          <div class="app__form-row withdrawal__form-row">
            <input-field
              white-autofill
              class="app__form-field"
              v-model.trim="form.amount"
              type="number"
              name="withdrawal-amount"
              @blur="touchField('form.amount')"
              :label="'withdrawal-form.amount' | globalize({
                asset: form.asset.code
              })"
              :step="selectedAssetStep"
              :disabled="formMixin.isDisabled"
              :error-message="getFieldErrorMessage('form.amount', {
                available: form.asset.balance.value,
                maxDecimalDigitsCount: DECIMAL_POINTS,
                minValue: selectedAssetStep
              })"
            />
          </div>

          <div class="app__form-row withdrawal__form-row">
            <template v-if="isMasterAssetOwner">
              <input-field
                white-autofill
                class="app__form-field"
                v-model.trim="form.address"
                name="withdrawal-address"
                @blur="touchField('form.address')"
                :error-message="getFieldErrorMessage('form.address')"
                :label="'withdrawal-form.destination-address' | globalize({
                  asset: form.asset.code
                })"
                :disabled="formMixin.isDisabled"
              />
            </template>

            <template v-else>
              <input-field
                white-autofill
                class="app__form-field"
                v-model.trim="form.comment"
                name="withdrawal-address"
                @blur="touchField('form.address')"
                :error-message="getFieldErrorMessage('form.address')"
                :label="'withdrawal-form.comment' | globalize"
                :disabled="formMixin.isDisabled"
              />
            </template>
          </div>

          <div
            class="app__form-row withdrawal__form-row"
            v-if="!isFeesLoadPending"
          >
            <fees :fees="fees" />
          </div>

          <div class="app__form-actions withdrawal__action">
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              type="submit"
              class="app__button-raised"
              :disabled="formMixin.isDisabled"
            >
              {{ 'withdrawal-form.withdraw-btn' | globalize }}
            </button>
            <form-confirmation
              v-if="formMixin.isConfirmationShown"
              @ok="hideConfirmation() || submit()"
              @cancel="hideConfirmation()"
            />
          </div>
        </form>
      </template>
      <template v-else>
        <h2 class="app__page-heading">
          {{ 'withdrawal-form.no-assets-heading' | globalize }}
        </h2>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ 'withdrawal-form.no-assets' | globalize }}
        </p>
        <router-link
          :to="vueRoutes.assets"
          tag="button"
          class="app__button-raised withdrawal__action"
        >
          {{ 'withdrawal-form.discover-assets-btn' | globalize }}
        </router-link>
      </template>
    </template>
    <template v-else-if="isFailed">
      {{ 'withdrawal-form.can-not-load-assets' | globalize }}
    </template>
    <template v-else>
      <loader message-id="withdrawal-form.loading-msg" />
    </template>
  </div>
</template>

<script>
import config from '@/config'
import debounce from 'lodash/debounce'
import FormMixin from '@/vue/mixins/form.mixin'
import FeesMixin from '@/vue/common/fees/fees.mixin'
import Loader from '@/vue/common/Loader'
import EmailGetter from '@/vue/common/EmailGetter'

import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { FEE_TYPES, base } from '@tokend/js-sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { vueRoutes } from '@/vue-router/routes'
import { api } from '@/api'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import {
  required,
  noMoreThanAvailableOnBalance,
  address,
  minValue,
  maxDecimalDigitsCount,
} from '@validators'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

const EMPTY_FEE = '0.000000'

export default {
  name: 'withdrawal-form',
  components: {
    Loader,
    EmailGetter,
  },
  mixins: [FormMixin, FeesMixin, IdentityGetterMixin],
  data: () => ({
    isLoaded: false,
    isFailed: false,
    form: {
      asset: {},
      amount: '',
      address: '',
    },
    fees: {
      destination: {
        fixed: 0,
        calculatedPercent: 0,
      },
      source: {
        fixed: 0,
        calculatedPercent: 0,
      },
    },
    assets: [],
    MIN_AMOUNT: config.MIN_AMOUNT,
    fixedFee: EMPTY_FEE,
    percentFee: EMPTY_FEE,
    feesDebouncedRequest: null,
    isFeesLoadPending: false,
    isFeesLoadFailed: false,
    DECIMAL_POINTS: config.DECIMAL_POINTS,
    vueRoutes,
    FEE_TYPES,
  }),
  validations () {
    const addressRules = {
      required,
      address: address(this.form.asset.code),
    }
    return {
      form: {
        asset: { required },
        amount: {
          required,
          noMoreThanAvailableOnBalance: noMoreThanAvailableOnBalance(
            this.form.asset.balance.value
          ),
          maxDecimalDigitsCount: maxDecimalDigitsCount(config.DECIMAL_POINTS),
          minValue: minValue(this.selectedAssetStep),
        },
        address: this.isMasterAssetOwner ? addressRules : {},
      },
    }
  },
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      balances: vuexTypes.accountBalances,
    }),

    isMasterAssetOwner () {
      return this.form.asset.owner === api.networkDetails.adminAccountId
    },

    selectedAssetStep () {
      // eslint-disable-next-line
      return inputStepByDigitsCount(this.form.asset.trailingDigitsCount) || config.MIN_AMOUNT
    },
  },
  watch: {
    'form.amount' (value) {
      if (value === '' || value < +this.MIN_AMOUNT) {
        this.fixedFee = EMPTY_FEE
        this.percentFee = EMPTY_FEE
        return
      }
      this.tryGetFees()
    },
    'form.asset.code' () {
      this.tryGetFees()
    },
  },
  async created () {
    try {
      await this.loadBalances()
      await this.initAssetSelector()
      this.isLoaded = true
    } catch (error) {
      this.isFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        if (this.isFeesLoadFailed) {
          Bus.error('withdrawal-form.failed-load-fees')
          return false
        }
        const operation = base.CreateWithdrawRequestBuilder
          .createWithdrawWithAutoConversion(this.composeOptions())
        await api.postOperations(operation)
        await this.reinitAssetSelector()
        Bus.success('withdrawal-form.withdraw-success')
        this.$emit(EVENTS.operationSubmitted)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async getFees () {
      try {
        const fees = await this.calculateFees({
          type: FEE_TYPES.withdrawalFee,
          assetCode: this.form.asset.code,
          amount: this.form.amount || 0,
          senderAccountId: this.accountId,
          recipientAccountId: this.accountId,
        })
        this.fees = fees
        this.fixedFee = fees.source.fixed
        this.percentFee = fees.destination.calculatedPercent

        this.isFeesLoadFailed = false
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isFeesLoadPending = false
    },
    tryGetFees () {
      this.isFeesLoadPending = true
      if (!this.feesDebouncedRequest) {
        this.feesDebouncedRequest = debounce(() => this.getFees(), 300)
      }
      return this.feesDebouncedRequest()
    },
    composeOptions () {
      const creatorDetails = {}

      if (this.isMasterAssetOwner) {
        creatorDetails.address = this.form.address
      } else {
        creatorDetails.comment = this.form.comment
      }

      return {
        balance: this.form.asset.balance.id,
        amount: this.form.amount,
        creatorDetails: creatorDetails,
        destAsset: this.form.asset.code,
        expectedDestAssetAmount: this.form.amount,
        fee: {
          fixed: this.fixedFee,
          percent: this.percentFee,
        },
      }
    },
    async initAssetSelector () {
      await this.loadAssets()
      if (this.assets.length) {
        this.form.asset = this.assets[0]
      }
    },
    async reinitAssetSelector () {
      await this.loadAssets()
      if (this.assets.length) {
        const updatedAsset = this.assets
          .find(item => item.code === this.form.asset.code)
        this.form.asset = updatedAsset || this.assets[0]
      }
    },
    async loadAssets () {
      await this.loadBalances()
      const endpoint = `/v3/accounts/${this.accountId}`
      const { data: account } = await api.get(endpoint, {
        include: ['balances.asset'],
      })

      this.assets = account.balances
        .map(b => b.asset)
        .map(item => new AssetRecord(item, this.balances))
        .filter(item => item.isWithdrawable && item.balance.id)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/variables';

.withdrawal__form-row {
  margin-bottom: 2.5rem;
}

.withdrawal__form-field-description {
  margin-top: 0.7rem;
  opacity: 0.7;
}

.withdrawal__fee-table {
  width: 100%;
  font-size: 1.2rem;
}

.withdrawal__fee-table tr {
  height: 2rem;
}

.withdrawal__fee-table td:last-child {
  text-align: right;
}

.withdrawal__fee-tbody {
  color: $col-text-secondary;
}

.withdrawal__total-fee-row {
  color: $col-text;
  font-weight: 600;
}

.withdrawal__action {
  margin-top: 2.5rem;
}

.withdrawal__data--loading {
  opacity: 0.4;
}
</style>
