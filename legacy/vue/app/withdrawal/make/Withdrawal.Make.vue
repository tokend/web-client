<template>
  <div class="withdraw">
    <template v-if="tokenCodes.length">
      <div class="app__page-content-wrp">
        <h2 class="app__page-heading">{{ i18n.withdraw_heading() }}</h2>
        <form
          @submit.prevent="processTransfer"
          id="withdrawal-form"
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
                <p v-if="minAmounts[form.tokenCode]">
                  {{
                    i18n.withdraw_how_much({
                      asset: form.tokenCode,
                      value: minAmounts[form.tokenCode]
                    })
                  }}
                </p>
                <p>
                  {{
                    i18n.withdraw_balance({
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
                v-model.trim="form.amount"
                :step="config.MINIMAL_NUMBER_INPUT_STEP"
                :label="i18n.lbl_amount()"
                name="amount"
                type="number"
                title="Amount"
                :readonly="view.mode === VIEW_MODES.confirm"
                vv-validate-on="change"
                v-validate="'required|amount'"
                :error-message="errors.first('amount') ||
                  (isLimitExceeded
                  ? i18n.withdraw_error_insufficient_funds() : '') ||
                  (lessThenMinimumAmount
                    ? i18n.withdraw_error_minimum_amount({
                      value: minAmounts[form.tokenCode],
                      asset: form.tokenCode })
                : '')"
              />

              <div
                class="withdraw__fees-container app__form-field-description"
                :class="{ loading: isFeesLoadPending }">
                <p>
                  - {{ i18n.withdraw_network_fee_prefix() }}
                  <span class="fee__fee-type">
                    {{ i18n.withdraw_network_fee() }}
                  </span>
                  <hint-wrapper
                    :hint="i18n.withdraw_network_fee_hint()"
                    :decorated="false">
                    <span class="fee__hint-icon">
                      <md-icon>help_outline</md-icon>
                    </span>
                  </hint-wrapper>
                </p>

                <p v-if="fixedFee">
                  - {{ fixedFee }} {{ form.tokenCode }}
                  <span class="fee__fee-type">
                    {{ i18n.withdraw_fixed_fee() }}
                  </span>
                </p>

                <p v-if="percentFee">
                  - {{ percentFee }} {{ form.tokenCode }}
                  <span class="fee__fee-type">
                    {{ i18n.withdraw_percent_fee() }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="app__form-row">
            <input-field-unchained
              v-model.trim="form.wallet"
              :label="i18n.withdraw_wallet({ asset: form.tokenCode })"
              :monospaced="true"
              name="wallet-address"
              :readonly="view.mode === VIEW_MODES.confirm"
              v-validate="'required|wallet_address'"
              :error-message="
                errors.first('wallet-address') ||
                  (isTryingToSendToYourself
                    ? i18n.withdraw_error_is_trying_to_send_to_yourself()
                    : '')
              "
            />
          </div>
        </form>

        <div class="app__form-actions">
          <button
            v-ripple
            v-if="view.mode === VIEW_MODES.submit"
            type="submit"
            class="app__form-submit-btn"
            :disabled="isPending || !isAllowedToSubmit"
            form="withdrawal-form">
            {{ i18n.withdraw_withdrawal() }}
          </button>

          <form-confirmation
            v-if="view.mode === VIEW_MODES.confirm"
            :pending="isPending"
            @cancel="updateView(VIEW_MODES.submit)"
            @ok="submit"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <h2 class="app__page-heading">
        {{ i18n.withdraw_no_assets_heading() }}
      </h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ i18n.withdraw_no_assets() }}
      </p>
      <router-link
        to="/tokens"
        tag="button"
        class="app__button-raised">
        {{ i18n.withdraw_discover_assets_btn() }}
      </router-link>
    </template>
  </div>
</template>

<script>
import formMixin from 'L@/vue/common/mixins/form.mixin'
import debounce from 'lodash/debounce'
import get from 'lodash/get'

import SelectFieldUnchained from 'L@/vue/common/fields/SelectFieldUnchained'
import HintWrapper from 'L@/vue/common/hint-wrapper/HintWrapper'
import FormConfirmation from 'L@/vue/common/form-confirmation/FormConfirmation'
import InputFieldUnchained from 'L@/vue/common/fields/InputFieldUnchained'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'

import { i18n } from 'L@/js/i18n'
import { feeService } from 'L@/js/services/fees.service'
import { withdrawService } from 'L@/js/services/withdraw.service'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { errors } from 'L@/js/errors/factory'
import config from '@/config'

const VIEW_MODES = {
  submit: 'submit',
  confirm: 'confirm',
  success: 'success'
}

export default {
  name: 'withdraw',
  components: {
    HintWrapper,
    SelectFieldUnchained,
    InputFieldUnchained,
    FormConfirmation
  },
  mixins: [formMixin],
  data: _ => ({
    form: {
      tokenCode: null,
      amount: '',
      wallet: ''
    },
    view: {
      mode: VIEW_MODES.submit,
      opts: {}
    },
    minAmounts: {
      BTC: '0.00001',
      ETH: '0.01'
    },
    fixedFee: '',
    percentFee: '',
    isFeesLoadPending: false,
    isFeesLoadFailed: false,
    feesDebouncedRequest: null,
    i18n,
    config,
    VIEW_MODES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.userWithdrawableTokens,
      vuexTypes.accountDepositAddresses,
      vuexTypes.accountBalances
    ]),
    tokenCodes () {
      return this.userWithdrawableTokens.map(token => token.code)
    },
    balance () {
      return this.accountBalances[this.form.tokenCode]
    },
    isLimitExceeded () {
      const amount = Number(this.form.amount)
      const balance = Number(get(this.balance, 'balance') || 0)
      return amount > balance
    },
    isTryingToSendToYourself () {
      const wallet = this.form.wallet
      const address = this.accountDepositAddresses[this.form.tokenCode]
      return wallet === address
    },
    lessThenMinimumAmount () {
      return this.form.amount !== ''
        ? Number(this.form.amount) < this.minAmounts[this.form.tokenCode]
        : false
    },
    isAllowedToSubmit () {
      return !this.isFeesLoadPending &&
        !this.isLimitExceeded &&
        !this.isTryingToSendToYourself &&
        !this.lessThenMinimumAmount
    }
  },
  watch: {
    'form.amount' (value) {
      if (this.isLimitExceeded) return
      if (value === '' || value < this.minAmounts[this.form.tokenCode]) {
        this.fixedFee = '0.0000'
        this.percentFee = '0.0000'
        return
      }
      this.tryGetFees()
    },
    'form.tokenCode' (value) {
      this.tryGetFees()
    }
  },
  created () {
    this.form.tokenCode = this.tokenCodes[0] || null
    this.loadBalances()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
    }),
    async submit () {
      if (!this.isAllowedToSubmit) return
      this.disableLong()
      try {
        const options = this.composeOptions()
        if (this.isFeesLoadFailed) {
          EventDispatcher.dispatchShowErrorEvent('Failed to load fees')
          return false
        }
        await withdrawService.createWithdrawalRequest(options)
        await this.loadBalances()
        EventDispatcher.dispatchShowSuccessEvent(i18n.withdraw_success())
        this.rerenderForm()
      } catch (error) {
        console.error(error)
        error.showBanner(i18n.unexpected_error)
      }
      this.enable()
      this.errors.clear()
    },
    async processTransfer () {
      if (!this.isAllowedToSubmit) return
      if (!await this.isValid()) return
      this.disable()
      try {
        this.updateView(VIEW_MODES.confirm)
      } catch (error) {
        console.error(error)
        if (error instanceof errors.NotFoundError) {
          error.showBanner(i18n.withdraw_error_invalid_address())
          this.enable()
          return
        }
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },
    composeOptions () {
      return {
        balance: this.balance.balance_id,
        amount: this.form.amount,
        externalDetails: { address: this.form.wallet },
        destAsset: this.form.tokenCode,
        expectedDestAssetAmount: this.form.amount,
        fee: {
          fixed: this.fixedFee,
          percent: this.percentFee
        }
      }
    },
    async getFees () {
      try {
        const fees = await feeService.loadWithdrawalFeeByAmount(
          this.form.tokenCode,
          this.form.amount
        )
        this.fixedFee = fees.fixed
        this.percentFee = fees.percent
        this.isFeesLoadFailed = false
      } catch (err) {
        this.isFeesLoadFailed = true
        EventDispatcher.dispatchShowErrorEvent('Failed to load fees')
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

    updateView (mode, clear = false) {
      this.view.mode = mode
      if (clear) {
        this.clear(['tokenCode'])
      }
    },
    rerenderForm () {
      this.updateView(null)
      setTimeout(() => this.updateView(VIEW_MODES.submit, true), 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~L@scss/variables.scss";
@import "~L@scss/mixins.scss";

.withdraw__fees-container {
  &.loading {
    opacity: 0.7;
  }

  .fee__fee-type {
    color: $col-text-accented;
  }
}

.fee__hint-icon {
  .md-icon {
    width: 1 * $point;
    height: 1 * $point;
    font-size: 1.6 * $point !important;
  }
}
</style>
