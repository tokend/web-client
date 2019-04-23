<template>
  <div class="invoice-confirmation">
    <invoice-viewer :invoice="invoice" />

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
    pollTimeoutId: 0,
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

  async created () {
    await this.checkForPayment()
  },

  destroyed () {
    clearTimeout(this.pollTimeoutId)
  },

  methods: {
    ...mapActions('create-invoice-form', {
      loadMovements: types.LOAD_MOVEMENTS,
    }),

    async checkForPayment () {
      try {
        await this.loadMovements(config.DEFAULT_POINT)
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }

      const payment = this.movements
        .find(m => m.reference === this.invoice.reference)

      if (payment) {
        clearTimeout(this.pollTimeoutId)
        this.invoice.setSuccessfulState()
        Bus.success('create-invoice-form.payment-successful-msg')
      } else {
        this.pollTimeoutId = setTimeout(
          this.checkForPayment, config.RELOAD_DATA_TICKER_INTERVAL_MS
        )
      }
    },
  },
}
</script>

<style scoped>
.invoice-confirmation__close-btn {
  margin-top: 4rem;
}
</style>
