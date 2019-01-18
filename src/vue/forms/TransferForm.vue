<template>
  <div class="transfer app__page-content-wrp">
    <template v-if="!tokenCodes.length">
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
      <h2 class="app__page-heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </h2>
      <form
        @submit.prevent="processTransfer"
        id="transfer-form"
        v-if="view.mode === VIEW_MODES.submit ||
          view.mode === VIEW_MODES.confirm">
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              :values="tokenCodes"
              v-model="form.tokenCode"
              :label="'transfer-form.asset' | globalize"
              :readonly="view.mode === VIEW_MODES.confirm" />
            <div class="app__form-field-description">
              <p v-if="form.tokenCode">
                {{
                  'transfer-form.balance' | globalize({
                    amount: balance.balance,
                    asset: form.tokenCode
                  })
                }}
              </p>
            </div>
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
              :label="'transfer-form.amount' | globalize"
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
              :label="'transfer-form.recipient-email-or-account-id' | globalize"
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
              :label="'transfer-form.add-note' | globalize({ length: 250 })"
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

          <!-- eslint-disable-next-line -->
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
            - {{ form.amount }} {{ form.tokenCode }}
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
          :is-pending="formMixin.isDisabled"
          :message="'transfer-form.recheck-form' | globalize"
          :ok-button="'transfer-form.submit-btn' | globalize"
          @cancel="updateView(VIEW_MODES.submit)"
          @ok="submit(form.isPaidForRecipient)"
        />
      </div>
    </template>
  </div>
</template>

<script>
import get from 'lodash/get'

import FormMixin from '@/vue/mixins/form.mixin'
import FormConfirmation from '@/vue/common/FormConfirmation'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import {
  base,
  PAYMENT_FEE_SUBTYPES,
  ASSET_POLICIES,
  FEE_TYPES
} from '@tokend/js-sdk'
import config from '@/config'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'
import { required, emailOrAccountId, amount } from '@validators'

const VIEW_MODES = {
  submit: 'submit',
  confirm: 'confirm',
  success: 'success'
}

export default {
  name: 'transfers-form',
  components: {
    FormConfirmation
  },
  mixins: [FormMixin],
  data: () => ({
    form: {
      tokenCode: null,
      amount: '',
      recipient: '',
      subject: '',
      isPaidForRecipient: false
    },
    view: {
      mode: VIEW_MODES.submit,
      opts: {}
    },
    fees: {
      source: {
        fixed: '',
        percent: '',
        feeAsset: ''
      },
      destination: {
        fixed: '',
        percent: '',
        feeAsset: ''
      }
    },
    isFeesLoaded: false,
    VIEW_MODES,
    FEE_TYPES,
    ASSET_POLICIES,
    config
  }),
  validations: {
    form: {
      amount: {
        required,
        amount
        // TODO: fix it
        // maxValueWrapper: maxValueWrapper(() => {
        //   console.log('this', this)
        //   return +this.selectedTokenAvailableToIssuance
        // })
      },
      recipient: { required, emailOrAccountId },
      subject: { required }
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.accountId
    ]),
    userTransferableTokens () {
      return this.accountBalances.filter(i => {
        const policies = i.assetDetails.policies.map(i => i.value)
        return policies.includes(ASSET_POLICIES.transferable)
      })
    },
    tokenCodes () {
      return this.userTransferableTokens.map(token => token.asset)
    },
    balance () {
      return this.accountBalances.find(i => i.asset === this.form.tokenCode)
    },
    isLimitExceeded () {
      const amount = Number(this.form.amount)
      const balance = Number(get(this.balance, 'balance') || 0)
      return amount > balance
    }
  },
  created () {
    this.setTokenCode()
    this.loadCurrentBalances()
  },
  methods: {
    globalize,
    ...mapActions({
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS
    }),
    async submit () {
      this.disableForm()
      try {
        await Sdk.horizon.transactions
          .submitOperations(this.buildPaymentOperation())

        Bus.success(globalize('transfer-form.payment-successful'))

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
          tokenCode: this.form.tokenCode
        }
        this.updateView(VIEW_MODES.confirm, opts)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },
    async getCounterparty (recipient) {
      if (!base.Keypair.isValidPublicKey(recipient)) {
        const response = await Sdk.api.users.getPage({
          email: recipient
        })
        return response.data[0].id
      } else {
        return recipient
      }
    },
    async getFees (recipientAccountId) {
      const [senderFees, recipientFees] = await Promise.all([
        this.loadPaymentFee({
          asset: this.form.tokenCode,
          amount: this.form.amount,
          account: this.accountId,
          subtype: PAYMENT_FEE_SUBTYPES.outgoing
        }),
        this.loadPaymentFee({
          asset: this.form.tokenCode,
          amount: this.form.amount,
          account: recipientAccountId,
          subtype: PAYMENT_FEE_SUBTYPES.incoming
        })
      ])
      return {
        source: senderFees,
        destination: recipientFees
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
            maxPaymentFee: +this.view.opts.sourcePercentFee,
            fixedFee: +this.view.opts.sourceFixedFee,
            feeAsset: this.view.opts.sourceFeeAsset
          },
          destinationFee: {
            maxPaymentFee: +this.view.opts.destinationPercentFee,
            fixedFee: +this.view.opts.destinationFixedFee,
            feeAsset: this.view.opts.destinationFeeAsset
          },
          sourcePaysForDest: this.view.opts.feeFromSource
        },
        subject: this.view.opts.subject,
        asset: this.form.tokenCode
      })
    },
    updateView (mode, opts = {}, clear = false) {
      this.view.mode = mode
      this.view.opts = opts
      if (clear) {
        this.clearFields()
        this.setTokenCode()
      }
    },
    rerenderForm () {
      this.updateView(null)
      this.isFeesLoaded = false
      setTimeout(() => this.updateView(VIEW_MODES.submit, {}, true), 1)
    },
    setTokenCode () {
      this.form.tokenCode =
        this.$route.params.tokenCode ||
        this.tokenCodes[0] ||
        null
    }
  }
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
