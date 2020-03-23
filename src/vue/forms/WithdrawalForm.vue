<template>
  <div class="withdrawal">
    <template v-if="isLoaded">
      <template v-if="withdrawableBalancesAssets.length">
        <form
          @submit.prevent="isFormValid() && showConfirmation()"
          novalidate
        >
          <div class="app__form-row withdrawal__form-row">
            <div class="app__form-field">
              <select-field
                name="withdrawal-asset"
                :value="form.asset.code"
                @input="setAssetByCode"
                :disabled="formMixin.isDisabled"
                :label="'withdrawal-form.asset' | globalize"
              >
                <option
                  v-for="asset in withdrawableBalancesAssets"
                  :key="asset.code"
                  :value="asset.code"
                >
                  {{ asset.nameAndCode }}
                </option>
              </select-field>
              <div class="withdrawal__form-field-description">
                <p>
                  {{
                    'withdrawal-form.balance' | globalize({
                      balance: {
                        value: selectedAssetBalance.balance,
                        currency: selectedAssetBalance.asset.code
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
            <amount-input-field
              class="app__form-field"
              v-model="form.amount"
              name="withdrawal-amount"
              validation-type="outgoing"
              :label="'withdrawal-form.amount' | globalize({
                asset: form.asset.code
              })"
              :asset="form.asset"
              :disabled="formMixin.isDisabled"
              is-max-button-shown
            />
          </div>

          <div class="app__form-row withdrawal__form-row">
            <template v-if="isMasterAssetOwner">
              <input-field
                white-autofill
                :maxlength="ADDRESS_MAX_LENGTH"
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

          <div class="app__form-row withdrawal__form-row">
            <template v-if="isFeesLoaded">
              <fees-renderer :fees-collection="fees" />
            </template>

            <template v-else>
              <loader message-id="withdrawal-form.loading-msg" />
            </template>
          </div>

          <div class="app__form-actions">
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
          class="app__button-raised"
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

import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import { FEE_TYPES, base } from '@tokend/js-sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { vueRoutes } from '@/vue-router/routes'
import { api } from '@/api'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import {
  required,
  address,
} from '@validators'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

const ADDRESS_MAX_LENGTH = 256

export default {
  name: 'withdrawal-form',
  components: {
    Loader,
    EmailGetter,
  },
  mixins: [FormMixin, FeesMixin, IdentityGetterMixin],
  props: {
    assetCode: { type: String, default: '' },
  },
  data: () => ({
    isLoaded: false,
    isFailed: false,
    form: {
      asset: {},
      amount: '',
      address: '',
    },
    fees: {},
    MIN_AMOUNT: config.MIN_AMOUNT,
    feesDebouncedRequest: null,
    isFeesLoaded: false,
    isFeesLoadFailed: false,
    DECIMAL_POINTS: config.DECIMAL_POINTS,
    vueRoutes,
    FEE_TYPES,
    ADDRESS_MAX_LENGTH,
  }),
  validations () {
    const addressRules = {
      required,
      address: address(this.form.asset.code),
    }
    return {
      form: {
        asset: { required },
        address: this.isMasterAssetOwner ? addressRules : {},
      },
    }
  },
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      withdrawableBalancesAssets: vuexTypes.withdrawableBalancesAssets,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),

    isMasterAssetOwner () {
      return this.form.asset.owner === api.networkDetails.adminAccountId
    },
    selectedAssetBalance () {
      return this.accountBalanceByCode(this.form.asset.code)
    },
  },
  watch: {
    'form.amount' (value) {
      this.tryLoadFees()
    },
    'form.asset.code' () {
      this.tryLoadFees()
    },
  },
  async created () {
    try {
      await this.loadBalances()
      await this.initAssetSelector()
      await this.loadFees()
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
    setAssetByCode (code) {
      this.form.asset = this.withdrawableBalancesAssets
        .find(item => item.code === code)
    },
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
    tryLoadFees () {
      this.isFeesLoaded = false
      this.isFeesLoadFailed = false

      if (!this.feesDebouncedRequest) {
        this.feesDebouncedRequest = debounce(() => this.loadFees(), 300)
      }
      return this.feesDebouncedRequest()
    },
    async loadFees () {
      try {
        this.fees = await this.calculateFees({
          assetCode: this.form.asset.code,
          amount: this.form.amount || 0,
          senderAccountId: this.accountId,
          type: FEE_TYPES.withdrawalFee,
        })

        this.isFeesLoaded = true
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
    composeOptions () {
      const creatorDetails = {}

      if (this.isMasterAssetOwner) {
        creatorDetails.address = this.form.address
      } else {
        creatorDetails.comment = this.form.comment
      }

      return {
        balance: this.selectedAssetBalance.id,
        amount: this.form.amount,
        creatorDetails: creatorDetails,
        destAsset: this.form.asset.code,
        expectedDestAssetAmount: this.form.amount,
        fee: {
          fixed: this.fees.sourceFee.fixed,
          percent: this.fees.sourceFee.calculatedPercent,
        },
      }
    },
    async initAssetSelector () {
      if (this.withdrawableBalancesAssets.length) {
        const selectedAsset = this.withdrawableBalancesAssets
          .find(a => a.code === this.assetCode)
        this.form.asset = selectedAsset || this.withdrawableBalancesAssets[0]
      }
    },
    async reinitAssetSelector () {
      await this.loadBalances()
      if (this.withdrawableBalancesAssets.length) {
        const updatedAsset = this.withdrawableBalancesAssets
          .find(item => item.code === this.form.asset.code)
        this.form.asset = updatedAsset || this.withdrawableBalancesAssets[0]
      }
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

.withdrawal__data--loading {
  opacity: 0.4;
}
</style>
