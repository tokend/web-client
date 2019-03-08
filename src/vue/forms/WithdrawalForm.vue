<template>
  <div class="withdrawal">
    <template v-if="isLoaded">
      <template v-if="assets.length">
        <form
          @submit.prevent="isFormValid() && showConfirmation()"
          id="withdrawal-form"
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
                  <!-- eslint-disable-next-line max-len -->
                  {{ 'withdrawal-form.balance' | globalize({ amount: form.asset.balance.value, asset: form.asset.code }) }}
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
              :disabled="formMixin.isDisabled"
              :error-message="getFieldErrorMessage('form.amount', {
                available: form.asset.balance.value,
                maxDecimalDigitsCount: DECIMAL_POINTS,
              })"
            />
          </div>

          <div class="app__form-row withdrawal__form-row">
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
              :monospaced="true"
              :disabled="formMixin.isDisabled"
            />
          </div>

          <div class="app__form-row withdrawal__form-row">
            <table class="withdrawal__fee-table">
              <tbody
                class="withdrawal__fee-tbody"
                :class="{ 'withdrawal__data--loading': isFeesLoadPending }"
              >
                <tr>
                  <td>
                    {{ 'withdrawal-form.network-fee-hint' | globalize }}
                  </td>
                  <td>
                    {{ 'withdrawal-form.network-fee-unknown' | globalize }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ 'withdrawal-form.fixed-fee' | globalize }}
                  </td>
                  <td>
                    <template v-if="isFeesLoadPending">
                      {{ 'withdrawal-form.fee-loading-msg' | globalize }}
                    </template>
                    <template v-else>
                      <!-- eslint-disable-next-line max-len -->
                      {{ { value: fixedFee, currency: form.asset.code } | formatMoney }}
                    </template>
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ 'withdrawal-form.percent-fee' | globalize }}
                  </td>
                  <td>
                    <template v-if="isFeesLoadPending">
                      {{ 'withdrawal-form.fee-loading-msg' | globalize }}
                    </template>
                    <template v-else>
                      <!-- eslint-disable-next-line max-len -->
                      {{ { value: percentFee, currency: form.asset.code } | formatMoney }}
                    </template>
                  </td>
                </tr>
                <tr class="withdrawal__total-fee-row">
                  <td>
                    {{ 'withdrawal-form.total-amount-account' | globalize }}
                  </td>
                  <td>
                    <template v-if="isFeesLoadPending">
                      {{ 'withdrawal-form.fee-loading-msg' | globalize }}
                    </template>
                    <template v-else>
                      <!-- eslint-disable-next-line max-len -->
                      {{ { value: (+percentFee + +fixedFee), currency: form.asset.code } | formatMoney }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="app__form-actions withdrawal__action">
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              type="submit"
              class="app__button-raised"
              :disabled="formMixin.isDisabled"
              form="withdrawal-form"
            >
              {{ 'withdrawal-form.withdrawal' | globalize }}
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
          to="/tokens"
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
import FormConfirmation from '@/vue/common/FormConfirmation'
import Loader from '@/vue/common/Loader'

import { AssetRecord } from '@/js/records/entities/asset.record'
import { FEE_TYPES } from '@tokend/js-sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import {
  required,
  noMoreThanAvailableOnBalance,
  address,
  maxDecimalDigitsCount,
} from '@validators'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

const EMPTY_FEE = '0.0000'

export default {
  name: 'withdrawal-form',
  components: {
    FormConfirmation,
    Loader,
  },
  mixins: [FormMixin],
  data () {
    return {
      isLoaded: false,
      isFailed: false,
      form: {
        asset: {},
        amount: '',
        address: '',
      },
      assets: [],
      MIN_AMOUNT: config.MIN_AMOUNT,
      fixedFee: EMPTY_FEE,
      percentFee: EMPTY_FEE,
      feesDebouncedRequest: null,
      isFeesLoadPending: false,
      isFeesLoadFailed: false,
      DECIMAL_POINTS: config.DECIMAL_POINTS,
    }
  },
  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          noMoreThanAvailableOnBalance: noMoreThanAvailableOnBalance(
            this.form.asset.balance.value
          ),
          maxDecimalDigitsCount: maxDecimalDigitsCount(config.DECIMAL_POINTS),
        },
        address: { required, address: address(this.form.asset.code) },
      },
    }
  },
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      balances: vuexTypes.accountBalances,
    }),
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
      await this.initAssetSelector()
      this.isLoaded = true
    } catch (error) {
      this.isFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },
  methods: {
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        if (this.isFeesLoadFailed) {
          Bus.error('withdrawal-form.failed-load-fees')
          return false
        }
        const operation = Sdk.base.CreateWithdrawRequestBuilder
          .createWithdrawWithAutoConversion(this.composeOptions())
        await Sdk.horizon.transactions.submitOperations(operation)
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
        const fees = await Sdk.horizon.fees.get(FEE_TYPES.withdrawalFee, {
          account: this.accountId,
          asset: this.form.asset.code,
          amount: this.form.amount,
        })
        this.fixedFee = fees.data.fixed
        this.percentFee = fees.data.percent
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
      return {
        balance: this.form.asset.balance.id,
        amount: this.form.amount,
        creatorDetails: { address: this.form.address },
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
      await this.loadAccount(this.accountId)
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets
        .map(item => new AssetRecord(item, this.balances))
        .filter(item => item.isWithdrawable && item.balance.id)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/variables";

.withdrawal__fees-container {
  &.loading {
    opacity: 0.7;
  }

  .withdrawal__fee-type {
    color: $col-info;
  }
}

.withdrawal__form-row {
  margin-bottom: 2.5rem;
}

.withdrawal__form-field-description {
  margin-top: 0.4rem;
  opacity: 0.7;
}

.withdrawal__fee-table {
  width: 100%;
  font-size: 1.2rem;

  tr {
    height: 2rem;
  }

  td:last-child {
    text-align: right;
  }
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

.withdrawal__table-description {
  opacity: 0.6;
  font-size: 1.2rem;
}
</style>
