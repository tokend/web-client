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
          class="app__button-raised transfer-form__discover-asset-btn">
          {{ 'transfer-form.discover-assets-btn' | globalize }}
        </router-link>
      </template>

      <template
        v-else-if="view.mode === VIEW_MODES.submit ||
          view.mode === VIEW_MODES.confirm"
      >
        <form
          id="transfer-form"
          @submit.prevent="processTransfer"
        >
          <div class="app__form-row">
            <div class="app__form-field">
              <select-field
                name="transfer-asset"
                :value="form.asset.code"
                @input="setAsset"
                :label="'transfer-form.asset-lbl' | globalize"
                :readonly="view.mode === VIEW_MODES.confirm"
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
                <p class="app__form-field-description">
                  {{
                    'transfer-form.balance' | globalize({
                      amount: balance.balance,
                      asset: form.asset.code,
                      available: balance.balance
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
                :label="'transfer-form.amount-lbl' | globalize"
                :asset="form.asset"
                is-max-button-shown
                :readonly="view.mode === VIEW_MODES.confirm"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                name="transfer-recipient"
                v-model.trim="form.recipient"
                :label="'transfer-form.recipient-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.recipient')"
                @blur="touchField('form.recipient')"
                :disabled="view.mode === VIEW_MODES.confirm"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <textarea-field
                name="transfer-description"
                v-model="form.subject"
                :label="'transfer-form.subject-lbl' | globalize({
                  length: 250
                })"
                :maxlength="250"
                :readonly="view.mode === VIEW_MODES.confirm"
              />
            </div>
          </div>

          <div
            class="transfer__fee-box"
            v-if="isFeesLoaded && view.mode === VIEW_MODES.confirm"
          >
            <fees-renderer
              :fees-collection="fees"
              :paid-for-destination.sync="form.isPaidForRecipient"
            />
          </div>

          <div class="app__form-actions">
            <button
              v-ripple
              v-if="view.mode === VIEW_MODES.submit"
              type="submit"
              class="app__form-submit-btn app__button-raised"
              :disabled="formMixin.isDisabled"
              form="transfer-form"
            >
              {{ 'transfer-form.continue-btn' | globalize }}
            </button>

            <form-confirmation
              v-if="view.mode === VIEW_MODES.confirm"
              :message="'transfer-form.recheck-form' | globalize"
              :ok-button="'transfer-form.submit-btn' | globalize"
              @cancel="updateView(VIEW_MODES.submit)"
              @ok="submit(form.isPaidForRecipient)"
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
import FeesMixin from '@/vue/common/fees/fees.mixin'
import {
  base,
  FEE_TYPES,
} from '@tokend/js-sdk'
import config from '@/config'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'
import {
  required,
  emailOrAccountId,
} from '@validators'

const VIEW_MODES = {
  submit: 'submit',
  confirm: 'confirm',
}

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

export default {
  name: 'transfers-form',
  components: {
    TransferFormSkeletonLoader,
  },
  mixins: [
    FormMixin,
    IdentityGetterMixin,
    FeesMixin,
  ],
  props: {
    assetToTransfer: { type: String, default: '' },
  },
  data: () => ({
    form: {
      asset: {},
      amount: '',
      recipient: '',
      subject: '',
      isPaidForRecipient: false,
    },
    fees: {},
    view: {
      mode: VIEW_MODES.submit,
      opts: {},
    },
    isLoaded: false,
    isLoadingFailed: false,
    isFeesLoaded: false,
    VIEW_MODES,
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
      return this.accountBalanceByCode(this.form.asset.code)
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
      this.updateView(VIEW_MODES.submit, this.view.opts)
      this.disableForm()
      try {
        await api.postOperations(this.buildPaymentOperation())

        Bus.success('transfer-form.payment-successful')
        this.$emit(EVENTS.operationSubmitted)

        await this.loadCurrentBalances()
        this.rerenderForm()
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },
    async processTransfer () {
      if (!await this.isFormValid()) return
      this.disableForm()
      try {
        const recipientAccountId =
          await this.getCounterparty(this.form.recipient)

        this.fees = await this.calculateFees({
          assetCode: this.form.asset.code,
          amount: this.form.amount,
          recipientAccountId: recipientAccountId,
          senderAccountId: this.accountId,
          type: FEE_TYPES.paymentFee,
        })
        this.isFeesLoaded = true

        const opts = {
          amount: this.form.amount,
          destinationAccountId: recipientAccountId,
          destinationFixedFee: this.fees.destinationFee.fixed,
          destinationPercentFee: this.fees.destinationFee.calculatedPercent,
          destinationFeeAsset: this.form.asset,
          sourceBalanceId: this.balance.id,
          sourceFixedFee: this.fees.sourceFee.fixed,
          sourcePercentFee: this.fees.sourceFee.calculatedPercent,
          sourceFeeAsset: this.form.asset,
          subject: this.form.subject,
        }
        this.updateView(VIEW_MODES.confirm, opts)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },
    async getCounterparty (recipient) {
      if (!base.Keypair.isValidPublicKey(recipient)) {
        return this.getAccountIdByEmail(recipient)
      } else {
        return recipient
      }
    },
    buildPaymentOperation () {
      return base.PaymentBuilder.payment({
        sourceBalanceId: this.view.opts.sourceBalanceId,
        destination: this.view.opts.destinationAccountId,
        amount: this.view.opts.amount,
        feeData: {
          sourceFee: {
            percent: this.view.opts.sourcePercentFee,
            fixed: this.view.opts.sourceFixedFee,
          },
          destinationFee: {
            percent: this.view.opts.destinationPercentFee,
            fixed: this.view.opts.destinationFixedFee,
          },
          sourcePaysForDest: this.form.isPaidForRecipient,
        },
        subject: this.view.opts.subject,
        asset: this.form.asset.code,
      })
    },
    updateView (mode, opts = {}, clear = false) {
      this.view.mode = mode
      this.view.opts = opts
      if (clear) {
        this.clearFields()
        this.setAsset()
      }
    },
    rerenderForm () {
      this.updateView(null)
      this.isFeesLoaded = false
      setTimeout(() => this.updateView(VIEW_MODES.submit, {}, true), 1)
    },
    setAsset (payload) {
      const assetCode = payload || this.assetToTransfer
      this.form.asset = this.transferableBalancesAssets
        .find(asset => asset.code === assetCode) ||
        this.transferableBalancesAssets[0] ||
        {}
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
