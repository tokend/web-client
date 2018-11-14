<template>
  <div class="transfer app__page-content-wrp">
    <template v-if="!tokenCodes.length">
      <h2 class="app__page-heading">
        {{ i18n.transfer_no_assets_heading() }}
      </h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ i18n.transfer_no_assets() }}
      </p>
      <router-link
        to="/tokens"
        tag="button"
        class="app__button-raised">
        {{ i18n.transfer_discover_assets_btn() }}
      </router-link>
    </template>

    <template
      v-else-if="view.mode === VIEW_MODES.submit ||
      view.mode === VIEW_MODES.confirm">
      <h2 class="app__page-heading">{{ i18n.transfer_heading() }}</h2>
      <form
        @submit.prevent="processTransfer"
        id="transfer-form"
        v-if="view.mode === VIEW_MODES.submit ||
        view.mode === VIEW_MODES.confirm">
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field-unchained
              :values="tokenCodes"
              v-model="form.tokenCode"
              :label="i18n.lbl_asset()"
              :readonly="view.mode === VIEW_MODES.confirm" />
            <div class="app__form-field-description">
              <p v-if="form.tokenCode">
                {{
                  i18n.transfer_balance({
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
            <input-field-unchained
              name="amount"
              :step="config.MINIMAL_NUMBER_INPUT_STEP"
              type="number"
              v-model.trim="form.amount"
              autocomplete="off"
              v-validate="'required|amount'"
              :label="i18n.lbl_amount()"
              :readonly="view.mode === VIEW_MODES.confirm"
              :error-message="errors.first('amount') ||
                (isLimitExceeded
                  ? i18n.transfer_error_insufficient_funds() : ''
              )"
            />
          </div>
        </div>

        <div class="app__form-row">
          <input-field-unchained
            name="recipient"
            v-model.trim="form.recipient"
            v-validate="'required|email_or_account_id'"
            :label="i18n.lbl_recipient_email_or_account()"
            :error-message="errorMessage('recipient')"
            :readonly="view.mode === VIEW_MODES.confirm"
          />
        </div>

        <div class="app__form-row">
          <textarea-field-unchained
            id="transfer-description"
            name="description"
            v-model="form.subject"
            v-validate="'max:250'"
            :label="i18n.lbl_add_note({ length: 250 })"
            :maxlength="250"
            :error-message="errorMessage('subject')"
            :readonly="view.mode === VIEW_MODES.confirm"
          />
        </div>
      </form>

      <transition name="app__fade-in">
        <div
          class="transfer__fee-box"
          v-if="isFeesLoaded">
          <h3 class="transfer__fee-box-heading">
            {{ i18n.transfer_source_fees() }}
          </h3>

          <!-- eslint-disable-next-line -->
          <template v-if=" +fees.source.fixed || +fees.source.percent || form.isPaidForRecipient ">
            <p
              class="transfer__fee"
              v-if="fees.source.fixed">
              - {{ fees.source.fixed }} {{ fees.source.feeAsset }}
              <span class="transfer__fee-type">
                {{ i18n.transfer_source_fixed_fee() }}
              </span>
            </p>

            <p
              class="transfer__fee"
              v-if="fees.source.percent">
              - {{ fees.source.percent }} {{ fees.source.feeAsset }}
              <span class="transfer__fee-type">
                {{ i18n.transfer_source_percent_fee() }}
              </span>
            </p>

            <p
              class="transfer__fee"
              v-if="form.isPaidForRecipient && +fees.destination.fixed">
              - {{ fees.destination.fixed }} {{ fees.destination.feeAsset }}
              <span class="transfer__fee-type">
                {{ i18n.transfer_destination_fixed_fee() }}
              </span>
            </p>

            <p
              class="transfer__fee"
              v-if="form.isPaidForRecipient && +fees.destination.percent">
              - {{ fees.destination.percent }} {{ fees.destination.feeAsset }}
              <span class="transfer__fee-type">
                {{ i18n.transfer_destination_percent_fee() }}
              </span>
            </p>
          </template>

          <template v-else>
            <p class="transfer__no-fee-msg">
              {{ i18n.transfer_source_no_fees() }}
            </p>
          </template>

          <h3 class="transfer__fee-box-heading">
            {{ i18n.transfer_destination_fees() }}
          </h3>

          <!-- eslint-disable-next-line -->
          <template v-if="(+fees.destination.fixed || +fees.destination.percent) && !form.isPaidForRecipient">
            <p
              class="transfer__fee"
              v-if="fees.destination.fixed">
              - {{ fees.destination.fixed }} {{ fees.destination.feeAsset }}
              <span class="transfer__fee-type">
                {{ i18n.transfer_destination_fixed_fee() }}
              </span>
            </p>

            <p
              class="transfer__fee"
              v-if="fees.destination.percent">
              - {{ fees.destination.percent }} {{ fees.destination.feeAsset }}
              <span class="transfer__fee-type">
                {{ i18n.transfer_destination_percent_fee() }}
              </span>
            </p>
          </template>

          <template v-else>
            <p class="transfer__no-fee-msg">
              {{ i18n.transfer_destination_no_fees() }}
            </p>
          </template>

          <h3 class="transfer__fee-box-heading">
            {{ i18n.transfer_total() }}
          </h3>

          <p class="transfer__fee">
            - {{ +(fees.source.fixed) + +(fees.source.percent) }}
            {{ fees.source.feeAsset }}
            <span class="transfer__fee-type">
              {{ i18n.transfer_total_sender_fee() }}
            </span>
          </p>

          <p class="transfer__fee">
            - {{ +(fees.destination.fixed) + +(fees.destination.percent) }}
            {{ fees.destination.feeAsset }}
            <span class="transfer__fee-type">
              {{ i18n.transfer_total_receiver_fee() }}
            </span>
          </p>

          <p class="transfer__fee">
            - {{ form.amount }} {{ form.tokenCode }}
            <span class="transfer__fee-type">
              {{ i18n.tr_total_amount() }}
            </span>
          </p>

          <!-- eslint-disable-next-line -->
          <div
            class="app__form-row"
            v-if="+fees.destination.fixed || +fees.destination.percent"
          >
            <tick-field v-model="form.isPaidForRecipient">
              {{ i18n.transfer_pay_fees_for_recipient() }}
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
          :disabled="isPending"
          form="transfer-form">
          {{ i18n.transfer_continue_btn() }}
        </button>

        <form-confirmation
          v-if="view.mode === VIEW_MODES.confirm"
          :pending="isPending"
          :message="i18n.transfer_recheck_form()"
          :ok-button="i18n.transfer_submit()"
          @cancel="updateView(VIEW_MODES.submit)"
          @ok="submit(form.isPaidForRecipient)"
        />
      </div>
    </template>
  </div>
</template>

<script>
import get from 'lodash/get'

import FormMixin from 'L@/vue/common/mixins/form.mixin'
import SelectFieldUnchained from 'L@/vue/common/fields/SelectFieldUnchained'
import InputFieldUnchained from 'L@/vue/common/fields/InputFieldUnchained'
import TickField from 'L@/vue/common/fields/TickField'
import FormConfirmation from 'L@/vue/common/form-confirmation/FormConfirmation'

import { ErrorHandler } from 'L@/js/errors/error_handler'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import { Keypair } from 'tokend-js-sdk'
import { errors } from 'L@/js/errors/factory'
import { i18n } from 'L@/js/i18n'
import config from '@/config'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { PAYMENT_FEE_SUBTYPES } from 'L@/js/const/xdr.const'

import { accountsService } from 'L@/js/services/accounts.service'
import { feeService } from 'L@/js/services/fees.service'
import { transferService } from 'L@/js/services/transfers.service'

const VIEW_MODES = {
  submit: 'submit',
  confirm: 'confirm',
  success: 'success'
}

export default {
  name: 'transfers-make',
  components: {
    SelectFieldUnchained,
    InputFieldUnchained,
    FormConfirmation,
    TickField
  },
  mixins: [FormMixin],
  data: _ => ({
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
    i18n,
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
    config
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.userTransferableTokens
    ]),
    tokenCodes () {
      return this.userTransferableTokens.map(token => token.code)
    },
    balance () {
      return this.accountBalances[this.form.tokenCode]
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
    ...mapActions({
      loadCurrentBalances: vuexTypes.GET_ACCOUNT_BALANCES
    }),
    async submit (feeFromSource) {
      this.disable()
      try {
        await transferService.createTransfer({
          ...this.view.opts,
          feeFromSource,
          asset: this.form.tokenCode
        })
        EventDispatcher.dispatchShowSuccessEvent(i18n.transfer_successful())
        await this.loadCurrentBalances()
        this.rerenderForm()
      } catch (error) {
        console.error(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },
    async processTransfer () {
      if (!await this.isValid()) return
      this.disable()
      try {
        const counterparty = await this.loadCounterparty()
        const fees = await this.loadFees(counterparty.accountId)
        this.fees = fees
        this.isFeesLoaded = true

        const opts = {
          amount: this.form.amount,
          destinationAccountId: counterparty.accountId,
          destinationEmail: counterparty.email,
          destinationFixedFee: fees.destination.fixed,
          destinationPercentFee: fees.destination.percent,
          destinationFeeAsset: fees.destination.feeAsset,
          sourceBalanceId: this.balance.balance_id,
          sourceFixedFee: fees.source.fixed,
          sourcePercentFee: fees.source.percent,
          sourceFeeAsset: fees.source.feeAsset,
          subject: this.form.subject,
          tokenCode: this.form.tokenCode
        }
        this.updateView(VIEW_MODES.confirm, opts)
      } catch (error) {
        console.error(error)
        if (error instanceof errors.NotFoundError) {
          error.showBanner(i18n.tr_recipient_not_found())
          this.enable()
          return
        }
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },
    async loadCounterparty () {
      const counterparty = {}
      const providedRecipient = this.form.recipient
      if (Keypair.isValidPublicKey(providedRecipient)) {
        counterparty.accountId = providedRecipient
        counterparty.email =
          await accountsService.loadEmailByAccountId(providedRecipient)
        return counterparty
      }
      counterparty.email = providedRecipient
      counterparty.accountId =
        await accountsService.loadAccountIdByEmail(providedRecipient)
      return counterparty
    },
    async loadFees (recipientAccountId) {
      const fees = { source: {}, destination: {} }
      const [senderFees, recipientFees] = await Promise.all([
        feeService.loadPaymentFeeByAmount(
          this.form.tokenCode,
          this.form.amount
        ),
        feeService.loadPaymentFeeByAmount(
          this.form.tokenCode,
          this.form.amount,
          recipientAccountId,
          PAYMENT_FEE_SUBTYPES.incoming
        )
      ])
      fees.source.fixed = senderFees.fixed
      fees.source.percent = senderFees.percent
      fees.source.feeAsset = senderFees.feeAsset
      fees.destination.fixed = recipientFees.fixed
      fees.destination.percent = recipientFees.percent
      fees.destination.feeAsset = recipientFees.feeAsset
      return fees
    },
    updateView (mode, opts = {}, clear = false) {
      this.view.mode = mode
      this.view.opts = opts
      if (clear) {
        this.clear()
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
@import "~L@scss/variables";

.transfer__fee-box {
  margin-top: 4 * $point;
  padding-top: 4 * $point;
  border-top: 0.1 * $point dashed $col-text-field-hint-inactive;
}

.transfer__fee-box-heading {
  margin-top: 0;
  margin-bottom: 1 * $point;
  font-weight: normal;
  display: block;
  font-size: 1.6 * $point;
  color: $col-text-page-heading;
}

.transfer__fee-box-heading:not(:first-child) {
  margin-top: 2.5 * $point;
}

.transfer__fee {
  color: $col-details-value;
  font-size: 1.6 * $point;
  line-height: 1.5;
  margin: 0;
}

.transfer__no-fee-msg {
  color: $col-details-label;
  font-size: 1.6 * $point;
  line-height: 1.5;
  margin: 1 * $point 0;
}

.transfer__fee-type {
  color: $col-details-label;
}
</style>
