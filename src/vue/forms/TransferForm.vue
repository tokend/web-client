<template>
  <div class="transfer app__page-content-wrp">
    <template v-if="isLoaded">
      <template v-if="!transferableBalancesAssets.length">
        <h2 class="app__page-heading">
          {{ 'transfer-form.no-assets-heading' | globalize }}
        </h2>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ 'transfer-form.no-assets' | globalize }}
        </p>
        <router-link
          :to="vueRoutes.assets.name"
          tag="button"
          class="app__button-raised transfer-form__discover-asset-btn"
        >
          {{ 'transfer-form.discover-assets-btn' | globalize }}
        </router-link>
      </template>

      <template v-else>
        <form
          id="transfer-form"
          @submit.prevent="loadFees"
        >
          <div class="app__form-row">
            <div class="app__form-field">
              <select-field
                name="transfer-asset"
                :value="form.asset.code"
                @input="setAsset"
                @change="former.setAttr('assetCode', form.asset.code)"
                :label="'transfer-form.asset-lbl' | globalize"
                :readonly="formMixin.isDisabled"
              >
                <option
                  v-for="asset in transferableBalancesAssets"
                  :key="asset.code"
                  :value="asset.code"
                >
                  {{ asset.nameAndCode }}
                </option>
              </select-field>
              <template v-if="form.asset.code">
                <p
                  class="app__form-field-description"
                  :class="{ 'app__form-field-description--error': !balance }"
                >
                  {{
                    'transfer-form.balance' | globalize({
                      amount: balance,
                      asset: form.asset.code,
                      available: balance
                    })
                  }}
                </p>
              </template>
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <amount-input-field
                v-model="form.amount"
                name="transfer-amount"
                validation-type="outgoing"
                @change="former.setAttr('amount', form.amount)"
                :label="'transfer-form.amount-lbl' | globalize"
                :asset="form.asset"
                is-max-button-shown
                :readonly="formMixin.isDisabled"
                :disabled="!balance"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                name="transfer-recipient"
                v-model.trim="form.recipient"
                @change="former.setAttr('recipient', form.recipient)"
                :label="'transfer-form.recipient-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.recipient')"
                @blur="touchField('form.recipient')"
                :disabled="formMixin.isDisabled || !balance"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <textarea-field
                name="transfer-description"
                v-model="form.subject"
                @input="former.setAttr('subject', form.subject)"
                :label="'transfer-form.subject-lbl' | globalize({
                  length: 250
                })"
                :maxlength="250"
                :readonly="formMixin.isDisabled"
                :disabled="!balance"
              />
            </div>
          </div>

          <div
            class="transfer__fee-box"
            v-if="isFeesLoaded && formMixin.isConfirmationShown &&
              fees.isAny
            "
          >
            <fees-renderer
              :fees-collection="fees"
              :paid-for-destination.sync="form.isPaidFeeForRecipient"
            />
          </div>

          <div class="app__form-actions">
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              type="submit"
              class="app__form-submit-btn app__button-raised"
              :disabled="formMixin.isDisabled || !balance"
              form="transfer-form"
            >
              {{ 'transfer-form.continue-btn' | globalize }}
            </button>

            <form-confirmation
              v-else
              :message="'transfer-form.recheck-form' | globalize"
              :ok-button="'transfer-form.submit-btn' | globalize"
              @cancel="hideConfirmation()"
              @ok="submit(form.isPaidFeeForRecipient)"
            />
          </div>
        </form>
      </template>
    </template>

    <template v-else-if="!isLoadingFailed">
      <transfer-form-skeleton-loader />
    </template>

    <template v-else>
      <p>
        {{ 'transfer-form.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import TransferFormSkeletonLoader from './TransferFormSkeletonLoader'

import FormMixin from '@/vue/mixins/form.mixin'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import { vueRoutes } from '@/vue-router/routes'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import FeesRenderer from '@/vue/common/fees/FeesRenderer.vue'

import { FEE_TYPES } from '@tokend/js-sdk'
import config from '@/config'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'
import {
  required,
  emailOrAccountId,
} from '@validators'
import { TransferFormer } from '@/js/formers/TransferFormer'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

export default {
  name: 'transfers-form',
  components: {
    TransferFormSkeletonLoader,
    FeesRenderer,
  },
  mixins: [
    FormMixin,
    IdentityGetterMixin,
  ],
  props: {
    assetToTransfer: { type: String, default: '' },
    former: { type: TransferFormer, default: () => new TransferFormer() },
  },
  data: () => ({
    form: {
      asset: {},
      amount: '',
      recipient: '',
      subject: '',
      isPaidFeeForRecipient: false,
    },
    fees: {},
    isLoaded: false,
    isLoadingFailed: false,
    isFeesLoaded: false,
    vueRoutes,
    config,
    FEE_TYPES,
  }),
  validations () {
    return {
      form: {
        recipient: { required, emailOrAccountId },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.transferableBalancesAssets,
      vuexTypes.accountBalanceByCode,
    ]),
    balance () {
      return +this.accountBalanceByCode(this.form.asset.code).balance
    },
  },
  async created () {
    try {
      await this.loadCurrentBalances()
      this.setAsset()
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },
  methods: {
    globalize,
    ...mapActions({
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async submit () {
      this.hideConfirmation()
      this.disableForm()
      try {
        this.former.setAttr('isPaidFeeForRecipient', this.form.isPaidFeeForRecipient)
        const operation = this.former.buildOps()
        await api.postOperations(operation)
        Bus.success('transfer-form.payment-successful')
        this.$emit(EVENTS.operationSubmitted)

        await this.loadCurrentBalances()
        this.rerenderForm()
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },
    async loadFees () {
      if (!await this.isFormValid()) return
      this.disableForm()
      try {
        this.fees = await this.former.calculateFees(this.accountId)
        this.isFeesLoaded = true
        this.showConfirmation()
      } catch (error) {
        ErrorHandler.process(error)
        this.enableForm()
      }
    },
    rerenderForm () {
      this.isFeesLoaded = false
      setTimeout(() => { this.clearFields(); this.setAsset() }, 1)
    },
    setAsset (payload) {
      const assetCode = payload || this.assetToTransfer
      this.form.asset = this.transferableBalancesAssets
        .find(asset => asset.code === assetCode) ||
        this.transferableBalancesAssets[0] ||
        {}
      this.former.setAttr('assetCode', this.form.asset.code)
      this.former.setAttr('sourceBalanceId', this.accountBalanceByCode(this.form.asset.code).id)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import '~@scss/variables';

.transfer__fee-box {
  padding-top: 4rem;
}

.transfer__fee-box-heading {
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 400;
  display: block;
  font-size: 1.6rem;
  color: $col-text-page-heading;
}

.transfer__fee-box-heading:not(:first-child) {
  margin-top: 2.5rem;
}

.transfer__fee {
  color: $col-details-value;
  font-size: 1.6rem;
  line-height: 1.5;
  margin: 0;
}

.transfer__no-fee-msg {
  color: $col-details-label;
  font-size: 1.6rem;
  line-height: 1.5;
  margin: 1rem 0;
}

.transfer__fee-type {
  color: $col-details-label;
}

.transfer-form__discover-asset-btn {
  margin-top: 2.5rem;
}

</style>
