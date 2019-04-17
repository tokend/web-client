<template>
  <div class="create-invoice-form__payment">
    <invoice-viewer :invoice="invoice" />

    <button
      v-ripple
      type="button"
      class="create-invoice-form__close-btn app__button-raised"
      :disabled="!isPaymentConfirmed"
      @click="closeForm"
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
    isPaymentConfirmed: false,
    pollIntervalId: 0,
  }),

  computed: {
    ...mapGetters('create-invoice-form', {
      movements: types.movements,
    }),
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

    closeForm () {
      this.$emit(EVENTS.close)
    },

    initPolling () {
      this.pollIntervalId = setInterval(
        this.checkForPayment,
        config.RELOAD_DATA_TICKER_INTERVAL_MS
      )
    },

    async checkForPayment () {
      try {
        await this.loadMovements(this.form.asset)
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }

      const payment = this.movements
        .find(m => m.reference === this.reference)

      if (payment) {
        clearInterval(this.pollIntervalId)
        this.isPaymentConfirmed = true
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
