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
          to="/tokens"
          tag="button"
          class="app__button-raised">
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
                :values="tokens"
                v-model="form.token"
                key-as-value-text="nameAndCode"
                :label="'transfer-form.asset-lbl' | globalize"
                :disabled="view.mode === VIEW_MODES.confirm"
              />
              <template v-if="form.token.code">
                <p class="app__form-field-description">
                  {{
                    'transfer-form.balance' | globalize({
                      amount: balance.balance,
                      asset: form.token.code
                    })
                  }}
                </p>
              </template>
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                name="amount"
                :step="config.MINIMAL_NUMBER_INPUT_STEP"
                type="number"
                v-model.trim="form.amount"
                autocomplete="off"
                :label="'transfer-form.amount-lbl' | globalize"
                :readonly="view.mode === VIEW_MODES.confirm"
                @blur="touchField('form.amount')"
                :error-message="getFieldErrorMessage('form.amount') ||
                  (isLimitExceeded
                    ? globalize('transfer-form.insufficient-funds') : '')
                "
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                name="recipient"
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
                name="description"
                v-model="form.subject"
                @blur="touchField('form.subject')"
                :label="'transfer-form.subject-lbl' | globalize({
                  length: 250
                })"
                :maxlength="250"
                :error-message="getFieldErrorMessage('form.subject')"
                :readonly="view.mode === VIEW_MODES.confirm"
              />
            </div>
          </div>
        </form>

        <transition name="app__fade-in">
          <div
            class="transfer__fee-box"
            v-if="isFeesLoaded">
            <h3 class="transfer__fee-box-heading">
              {{ 'transfer-form.sender-fees' | globalize }}
            </h3>

            <!-- eslint-disable-next-line -->
            <template v-if=" +fees.source.fixed || +fees.source.percent || form.isPaidForRecipient ">
              <p
                class="transfer__fee"
                v-if="fees.source.fixed">
                - {{ fees.source.fixed }} {{ fees.source.feeAsset }}
                <span class="transfer__fee-type">
                  {{ 'transfer-form.sender-fixed-fee' | globalize }}
                </span>
              </p>

              <p
                class="transfer__fee"
                v-if="fees.source.percent">
                - {{ fees.source.percent }} {{ fees.source.feeAsset }}
                <span class="transfer__fee-type">
                  {{ 'transfer-form.sender-percent-fee' | globalize }}
                </span>
              </p>

              <p
                class="transfer__fee"
                v-if="form.isPaidForRecipient && +fees.destination.fixed">
                - {{ fees.destination.fixed }} {{ fees.destination.feeAsset }}
                <span class="transfer__fee-type">
                  {{ 'transfer-form.recipient-fixed-fee' | globalize }}
                </span>
              </p>

              <p
                class="transfer__fee"
                v-if="form.isPaidForRecipient && +fees.destination.percent">
                - {{ fees.destination.percent }} {{ fees.destination.feeAsset }}
                <span class="transfer__fee-type">
                  {{ 'transfer-form.recipient-percent-fee' | globalize }}
                </span>
              </p>
            </template>

            <template v-else>
              <p class="transfer__no-fee-msg">
                {{ 'transfer-form.source-no-fees' | globalize }}
              </p>
            </template>

            <h3 class="transfer__fee-box-heading">
              {{ 'transfer-form.recipient-fees' | globalize }}
            </h3>

            <!-- eslint-disable-next-line max-len -->
            <template v-if="(+fees.destination.fixed || +fees.destination.percent) && !form.isPaidForRecipient">
              <p
                class="transfer__fee"
                v-if="fees.destination.fixed">
                - {{ fees.destination.fixed }} {{ fees.destination.feeAsset }}
                <span class="transfer__fee-type">
                  {{ 'transfer-form.recipient-fixed-fee' | globalize }}
                </span>
              </p>

              <p
                class="transfer__fee"
                v-if="fees.destination.percent">
                - {{ fees.destination.percent }} {{ fees.destination.feeAsset }}
                <span class="transfer__fee-type">
                  {{ 'transfer-form.recipient-percent-fee' | globalize }}
                </span>
              </p>
            </template>

            <template v-else>
              <p class="transfer__no-fee-msg">
                {{ 'transfer-form.recipient-no-fees' | globalize }}
              </p>
            </template>

            <h3 class="transfer__fee-box-heading">
              {{ 'transfer-form.total' | globalize }}
            </h3>

            <p class="transfer__fee">
              - {{ +(fees.source.fixed) + +(fees.source.percent) }}
              {{ fees.source.feeAsset }}
              <span class="transfer__fee-type">
                {{ 'transfer-form.total-sender-fee' | globalize }}
              </span>
            </p>

            <p class="transfer__fee">
              - {{ +(fees.destination.fixed) + +(fees.destination.percent) }}
              {{ fees.destination.feeAsset }}
              <span class="transfer__fee-type">
                {{ 'transfer-form.total-receiver-fee' | globalize }}
              </span>
            </p>

            <p class="transfer__fee">
              - {{ form.amount }} {{ form.token.code }}
              <span class="transfer__fee-type">
                {{ 'transfer-form.total-amount' | globalize }}
              </span>
            </p>

            <!-- eslint-disable-next-line -->
            <div
              class="app__form-row"
              v-if="+fees.destination.fixed || +fees.destination.percent"
            >
              <tick-field v-model="form.isPaidForRecipient">
                {{ 'transfer-form.pay-fees-for-recipient' | globalize }}
              </tick-field>
            </div>
          </div>
        </transition>

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
import get from 'lodash/get'

import Loader from '@/vue/common/Loader'

import FormMixin from '@/vue/mixins/form.mixin'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import {
  base,
  PAYMENT_FEE_SUBTYPES,
  FEE_TYPES,
} from '@tokend/js-sdk'
import config from '@/config'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'
import { required, emailOrAccountId, amount } from '@validators'

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
  mixins: [FormMixin],
  props: {
    assetToTransfer: { type: String, default: '' },
  },
  data: () => ({
    form: {
      token: {},
      amount: '',
      recipient: '',
      subject: '',
      isPaidForRecipient: false,
    },
    view: {
      mode: VIEW_MODES.submit,
      opts: {},
    },
    fees: {
      source: {
        fixed: '',
        percent: '',
        feeAsset: '',
      },
      destination: {
        fixed: '',
        percent: '',
        feeAsset: '',
      },
    },
    isLoaded: false,
    isLoadingFailed: false,
    isFeesLoaded: false,
    VIEW_MODES,
    config,
  }),
  validations: {
    form: {
      amount: {
        required,
        amount,
      },
      recipient: { required, emailOrAccountId },
      subject: { required },
    },
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
      return this.accountBalances.find(i => i.asset === this.form.token.code)
    },
    isLimitExceeded () {
      const amount = Number(this.form.amount)
      const balance = Number(get(this.balance, 'balance') || 0)
      return amount > balance
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
        const fees = await this.getFees(recipientAccountId)
        this.fees = fees
        this.isFeesLoaded = true

        const opts = {
          amount: this.form.amount,
          destinationAccountId: recipientAccountId,
          destinationFixedFee: fees.destination.fixed,
          destinationPercentFee: fees.destination.percent,
          destinationFeeAsset: fees.destination.feeAsset,
          sourceBalanceId: this.balance.balanceId,
          sourceFixedFee: fees.source.fixed,
          sourcePercentFee: fees.source.percent,
          sourceFeeAsset: fees.source.feeAsset,
          subject: this.form.subject,
          tokenCode: this.form.token.code,
        }
        this.updateView(VIEW_MODES.confirm, opts)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },
    async getCounterparty (recipient) {
      if (!base.Keypair.isValidPublicKey(recipient)) {
        const response = await Sdk.horizon.public.getAccountIdByEmail(recipient)
        return response.data.accountId
      } else {
        return recipient
      }
    },
    async getFees (recipientAccountId) {
      const [senderFees, recipientFees] = await Promise.all([
        this.loadPaymentFee({
          asset: this.form.token.code,
          amount: this.form.amount,
          account: this.accountId,
          subtype: PAYMENT_FEE_SUBTYPES.outgoing,
        }),
        this.loadPaymentFee({
          asset: this.form.token.code,
          amount: this.form.amount,
          account: recipientAccountId,
          subtype: PAYMENT_FEE_SUBTYPES.incoming,
        }),
      ])
      return {
        source: senderFees,
        destination: recipientFees,
      }
    },
    async loadPaymentFee ({ asset, amount, account, subtype }) {
      try {
        const response = await Sdk.horizon.fees
          .get(FEE_TYPES.paymentFee, { asset, amount, account, subtype })

        return response.data
      } catch (e) {
        ErrorHandler.process(e)
        return {}
      }
    },
    buildPaymentOperation () {
      return base.PaymentV2Builder.paymentV2({
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
        asset: this.form.token.code,
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
      this.form.token =
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
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 0.1rem dashed $col-text-field-hint-inactive;
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
</style>
