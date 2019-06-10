<template>
  <div class="invoice-confirmation">
    <invoice-viewer :invoice="invoice" />

    <balances-viewer
      class="invoice-confirmation__balances"
      :invoice="invoice"
      :customer-balance="customerBalance.amount"
      :merchant-balance="merchantBalance.amount"
    />

    <button
      v-ripple
      type="button"
      class="invoice-confirmation__close-btn app__button-raised"
      :disabled="!isPaymentConfirmed"
      @click="$emit(EVENTS.close)"
    >
      <template v-if="isPaymentConfirmed">
        {{ 'create-invoice-form.close-btn' | globalize }}
      </template>

      <template v-else>
        {{ 'create-invoice-form.waiting-for-payment-btn' | globalize }}
      </template>
    </button>
  </div>
</template>

<script>
import InvoiceViewer from './invoice-viewer'
import BalancesViewer from './balances-viewer'

import { mapGetters, mapActions } from 'vuex'
import { types } from '../store/types'

import { api } from '@/api'
import { Wallet, base, ApiCaller } from '@tokend/js-sdk'
import { config } from '../_config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Invoice } from '../wrappers/invoice'
import { Balance } from '../wrappers/balance'

const EVENTS = {
  close: 'close',
}

const EMPTY_FEE = {
  sourceFee: {
    percent: '0.000000',
    fixed: '0.000000',
  },
  destinationFee: {
    percent: '0.000000',
    fixed: '0.000000',
  },
  sourcePaysForDest: true,
}

export default {
  name: 'invoice-confirmation',
  components: {
    InvoiceViewer,
    BalancesViewer,
  },

  props: {
    invoice: { type: Invoice, required: true },
    merchantEmail: { type: String, required: true },
    merchantSystem: { type: String, required: true },
  },

  data: _ => ({
    customerApi: null,
    customerBalance: {},
    pollTimeoutId: 0,
    EVENTS,
  }),

  computed: {
    ...mapGetters('create-invoice-form', {
      movements: types.movements,
      getBalanceByAssetCode: types.getBalanceByAssetCode,
    }),

    isPaymentConfirmed () {
      return this.invoice.isSuccessful
    },

    transactionSubject () {
      const firstLine = `${config.MERCHANT_ACCOUNT_ID}@${btoa(this.merchantSystem)}`
      const secondLine = JSON.stringify({
        merchant: config.MERCHANT_NAME,
        subject: this.invoice.subject,
      })

      return `${firstLine}\n${secondLine}`
    },

    merchantBalance () {
      return this.getBalanceByAssetCode(config.DEFAULT_POINT_CODE) || {}
    },
  },

  async created () {
    try {
      await this.initCustomerApi()
      await this.loadCustomerBalance()
      await this.sendTransaction()
      await this.checkForPayment()
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  destroyed () {
    clearTimeout(this.pollTimeoutId)
  },

  methods: {
    ...mapActions('create-invoice-form', {
      loadMovements: types.LOAD_MOVEMENTS,
      loadBalances: types.LOAD_BALANCES,
    }),

    async initCustomerApi () {
      const newWallet = new Wallet(
        this.merchantEmail,
        this.invoice.loyaltyAccount.secretSeed,
        this.invoice.loyaltyAccount.accountId
      )

      this.customerApi = await ApiCaller
        .getInstanceWithPassphrase(this.invoice.system)
      this.customerApi.useWallet(newWallet)
    },

    async checkForPayment () {
      try {
        await this.loadMovements(config.DEFAULT_POINT_CODE)
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }

      const payment = this.movements
        .find(m => m.reference === this.invoice.reference)

      if (payment) {
        try {
          clearTimeout(this.pollTimeoutId)
          await this.loadBalances()
          this.invoice.setSuccessfulState()
          Bus.success('create-invoice-form.payment-successful-msg')
        } catch (e) {
          ErrorHandler.process(e)
        }
      } else {
        this.pollTimeoutId = setTimeout(
          this.checkForPayment,
          config.RELOAD_DATA_TICKER_INTERVAL_MS
        )
      }
    },

    async sendTransaction () {
      const recipient = this.getPaymentRecipient()
      const operation = base.PaymentBuilder.payment({
        sourceBalanceId: this.customerBalance.id,
        destination: recipient,
        amount: this.invoice.totalPrice,
        feeData: EMPTY_FEE,
        subject: this.transactionSubject,
        asset: this.invoice.asset.code,
        reference: this.invoice.reference,
      })

      await this.customerApi.postOperations(operation)
      await this.loadCustomerBalance()
      this.invoice.setPendingState()
    },

    async loadCustomerBalance () {
      const { data: account } = await this.customerApi.getWithSignature(
        `/v3/accounts/${this.invoice.loyaltyAccount.accountId}`,
        { include: ['balances', 'balances.state'] }
      )

      const balance = account.balances
        .find(b => b.asset.id === this.invoice.asset.code)
      this.customerBalance = new Balance(balance || {})
    },

    getPaymentRecipient () {
      if (this.invoice.system === this.merchantSystem) {
        return config.MERCHANT_ACCOUNT_ID
      } else {
        return api.networkDetails.adminAccountId
      }
    },
  },
}
</script>

<style scoped>
.invoice-confirmation__close-btn {
  margin-top: 4rem;
}

.invoice-confirmation__balances {
  margin-top: 4rem;
}
</style>
