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
                <p
                  :class="{
                    'withdrawal__form-field-description--error'
                      :!balance
                  }"
                >
                  {{
                    'withdrawal-form.balance' | globalize({
                      balance: {
                        value: balance,
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
              @change="former.setAttr('amount', form.amount)"
              validation-type="outgoing"
              :label="'withdrawal-form.amount' | globalize({
                asset: form.asset.code
              })"
              :asset="form.asset"
              :disabled="formMixin.isDisabled || !balance"
              is-max-button-shown
            />
          </div>

          <div class="app__form-row withdrawal__form-row">
            <template v-if="form.asset.erc20Withdraw">
              <input-field
                white-autofill
                :maxlength="ADDRESS_MAX_LENGTH"
                class="app__form-field"
                v-model.trim="form.address"
                name="withdrawal-address"
                @change="former.setAttr('creatorDetails.address', form.address)"
                @blur="touchField('form.address')"
                :error-message="getFieldErrorMessage('form.address')"
                :label="'withdrawal-form.destination-address' | globalize({
                  asset: form.asset.code
                })"
                :disabled="formMixin.isDisabled || !balance"
              />
            </template>
          </div>

          <div class="app__form-row withdrawal__form-row">
            <input-field
              white-autofill
              class="app__form-field"
              v-model.trim="form.comment"
              name="withdrawal-address"
              @change="former.setAttr('creatorDetails.comment', form.comment)"
              @blur="touchField('form.address')"
              :error-message="getFieldErrorMessage('form.address')"
              :label="'withdrawal-form.comment' | globalize"
              :disabled="formMixin.isDisabled || !balance"
            />
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
              :disabled="formMixin.isDisabled || !balance"
            >
              {{ 'withdrawal-form.withdraw-btn' | globalize }}
            </button>
            <form-confirmation
              v-else
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
import debounce from 'lodash/debounce'
import FormMixin from '@/vue/mixins/form.mixin'
import FeesRenderer from '@/vue/common/fees/FeesRenderer.vue'
import Loader from '@/vue/common/Loader'
import EmailGetter from '@/vue/common/EmailGetter'

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
import { WithdrawalFormer } from '@/js/formers/WithdrawalFormer'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

const ADDRESS_MAX_LENGTH = 256

export default {
  name: 'withdrawal-form',
  components: {
    Loader,
    EmailGetter,
    FeesRenderer,
  },
  mixins: [FormMixin],
  props: {
    assetCode: { type: String, default: '' },
    former: { type: WithdrawalFormer, default: () => new WithdrawalFormer() },
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
    feesDebouncedRequest: null,
    isFeesLoaded: false,
    isFeesLoadFailed: false,
    vueRoutes,
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
    balance () {
      return +this.selectedAssetBalance.balance
    },
    isMasterAssetOwner () {
      return this.form.asset.owner === api.networkDetails.adminAccountId
    },
    selectedAssetBalance () {
      return this.accountBalanceByCode(this.form.asset.code)
    },
  },
  watch: {
    'form.amount' (value) {
      this.former.setAttr('amount', this.form.amount)
      this.tryLoadFees()
    },
    'form.asset.code' () {
      this.former.setAttr('assetCodeForWithdrawal', this.form.asset.code)
      this.tryLoadFees()
    },
  },
  async created () {
    try {
      await this.loadBalances()
      await this.initAssetSelector()
      this.former.setAttr('senderAccountId', this.accountId)

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

        if (this.isMasterAssetOwner) {
          this.former.setAttr('creatorDetails.address', this.form.address)
        } else {
          this.former.setAttr('creatorDetails.comment', this.form.comment)
        }
        this.former.setAttr('selectedAssetBalanceId', this.selectedAssetBalance.id)

        const operation = this.former.buildOps()
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
        this.fees = await this.former.calculateFees()
        this.isFeesLoaded = true
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
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

.withdrawal__form-field-description--error {
  color: $col-error;
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
