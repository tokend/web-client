<template>
  <div class="transfer app__page-content-wrp">
    <template v-if="isLoaded">
      <template v-if="!tokens.length">
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
          view.mode === VIEW_MODES.confirm">
        <form
          @submit.prevent="processTransfer"
          id="transfer-form"
          v-if="view.mode === VIEW_MODES.submit ||
            view.mode === VIEW_MODES.confirm">
          <div class="app__form-row">
            <div class="app__form-field">
              <select-field
                name="transfer-token"
                :values="tokens"
                v-model="form.asset"
                key-as-value-text="nameAndCode"
                :label="'transfer-form.asset-lbl' | globalize"
                :disabled="view.mode === VIEW_MODES.confirm"
              />
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
              <input-field
                name="transfer-amount"
                :step="config.MINIMAL_NUMBER_INPUT_STEP"
                type="number"
                v-model.trim="form.amount"
                autocomplete="off"
                :label="'transfer-form.amount-lbl' | globalize"
                :readonly="view.mode === VIEW_MODES.confirm"
                @blur="touchField('form.amount')"
                :error-message="getFieldErrorMessage('form.amount', {
                  available: balance.balance
                })"
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
                :readonly="view.mode === VIEW_MODES.confirm"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <textarea-field
                id="transfer-description"
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
        </form>

        <div
          class="transfer__fee-box"
          v-if="isFeesLoaded"
        >
          <fees
            :fees="fees"
            :asset-code="form.asset.code"
            :is-external-system-type="form.asset.externalSystemType"
            @isPayForDestination="form.isPaidForRecipient = $event"
          />
        </div>

        <div class="app__form-actions">
          <button
            v-ripple
            v-if="view.mode === VIEW_MODES.submit"
            type="submit"
            class="app__form-submit-btn"
            :disabled="formMixin.isDisabled"
            form="transfer-form">
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
      </template>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader message-id="transfer-form.loading-msg" />
    </template>

    <template v-else>
      <p>
        {{ 'transfer-form.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'

import FormMixin from '@/vue/mixins/form.mixin'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import { vueRoutes } from '@/vue-router/routes'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import {
  base,
  FEE_TYPES,
} from '@tokend/js-sdk'
import FeesMixin from '@/vue/common/fees/fees.mixin'
import config from '@/config'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'
import {
  required,
  emailOrAccountId,
  amount,
  noMoreThanAvailableOnBalance,
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
    Loader,
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
  }),
  validations () {
    return {
      form: {
        amount: {
          required,
          amount,
          noMoreThanAvailableOnBalance:
            noMoreThanAvailableOnBalance(this.balance.balance),
        },
        recipient: { required, emailOrAccountId },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.accountId,
    ]),
    userTransferableTokens () {
      return this.accountBalances.filter(i => i.assetDetails.isTransferable)
    },
    tokens () {
      return this.userTransferableTokens.map(token => token.assetDetails)
    },
    balance () {
      return this.accountBalances
        .find(i => i.asset === this.form.asset.code) || {}
    },
  },
  async created () {
    try {
      await this.loadCurrentBalances()
      this.setToken()
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorEvent.processWithoutFeedback(e)
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
        await Sdk.horizon.transactions
          .submitOperations(this.buildPaymentOperation())

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
        const feesParams = {
          assetCode: this.form.asset.code,
          amount: this.form.amount,
          accountId: recipientAccountId,
          type: FEE_TYPES.paymentFee,
        }
        const fees = await this.calculateFees(feesParams)
        this.fees = fees
        this.isFeesLoaded = true

        const opts = {
          amount: this.form.amount,
          destinationAccountId: recipientAccountId,
          destinationFixedFee: fees.destination.data.fixed,
          destinationPercentFee: fees.destination.data.calculatedPercent,
          destinationFeeAsset: this.form.asset,
          sourceBalanceId: this.balance.balanceId,
          sourceFixedFee: fees.source.data.fixed,
          sourcePercentFee: fees.source.data.calculatedPercent,
          sourceFeeAsset: this.form.asset,
          subject: this.form.subject,
          tokenCode: this.form.asset.code,
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
          sourcePaysForDest: this.view.opts.feeFromSource,
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
        this.setToken()
      }
    },
    rerenderForm () {
      this.updateView(null)
      this.isFeesLoaded = false
      setTimeout(() => this.updateView(VIEW_MODES.submit, {}, true), 1)
    },
    setToken () {
      this.form.asset =
        this.tokens.find(token => token.code === this.assetToTransfer) ||
        this.tokens[0] ||
        {}
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import "~@scss/variables";

.transfer__fee-box {
  padding-top: 4rem;
}

.transfer__fee-box-heading {
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: normal;
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
