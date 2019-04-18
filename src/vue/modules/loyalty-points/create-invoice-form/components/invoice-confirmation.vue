<template>
  <div class="create-invoice-form__payment">
    <invoice-viewer :invoice="invoice" />

    <button
      v-ripple
      type="button"
      class="create-invoice-form__close-btn app__button-raised"
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

import { mapGetters, mapActions } from 'vuex'
import { types } from '../store/types'

import { config } from '../_config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Invoice } from '../wrappers/invoice'

const EVENTS = {
  close: 'close',
}

export default {
  name: 'invoice-confirmation',
  components: { InvoiceViewer },

  props: {
    invoice: { type: Invoice, required: true },
  },

  data: _ => ({
    pollIntervalId: 0,
    EVENTS,
  }),

  computed: {
    ...mapGetters('create-invoice-form', {
      movements: types.movements,
    }),

    isPaymentConfirmed () {
      return this.invoice.isSuccessful
    },
  },

  created () {
    this.initPolling()
  },

  destroyed () {
    clearInterval(this.pollIntervalId)
  },

  methods: {
    ...mapActions('create-invoice-form', {
      loadMovements: types.LOAD_MOVEMENTS,
    }),

    initPolling () {
      this.pollIntervalId = setInterval(
        this.checkForPayment,
        config.RELOAD_DATA_TICKER_INTERVAL_MS
      )
    },

    async checkForPayment () {
      try {
        await this.loadMovements(config.DEFAULT_POINT)
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }

      const payment = this.movements
        .find(m => m.reference === this.invoice.reference)

      if (payment) {
        clearInterval(this.pollIntervalId)
        this.invoice.setSuccessfulState()
        Bus.success('create-invoice-form.payment-successful-msg')
      }
    },
  },
}
</script>

<style scoped>
.create-invoice-form__close-btn {
  margin-top: 4rem;
}
</style>
