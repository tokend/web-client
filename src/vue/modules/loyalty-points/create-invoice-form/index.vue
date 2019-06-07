<template>
  <div
    v-if="isLoaded"
    class="create-invoice-form-module"
  >
    <template v-if="assetPairs.length">
      <invoice-form
        v-if="!isTransactionSent"
        :amount="amount"
        :subject="subject"
        :merchant-email="walletEmail"
        :merchant-system="horizonUrl"
        @submit="initConfirmation"
      />

      <invoice-confirmation
        v-else
        :invoice="invoice"
        :merchant-email="walletEmail"
        :merchant-system="horizonUrl"
        @close="$emit(EVENTS.close)"
      />
    </template>

    <no-data-message
      v-else
      :title="'create-invoice-form.no-pairs-message' | globalize"
      :message="'create-invoice-form.here-will-pairs-list' | globalize"
    />
  </div>

  <p v-else-if="isLoadFailed">
    {{ 'create-invoice-form.load-failed-msg' | globalize }}
  </p>

  <load-spinner
    v-else
    :message-id="'create-invoice-form.loading-msg'"
  />
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import InvoiceForm from './components/invoice-form'
import InvoiceConfirmation from './components/invoice-confirmation'

import { config } from './_config'

import { mapGetters, mapActions } from 'vuex'
import { types } from './store/types'
import { vuexTypes } from '@/vuex/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  close: 'close',
}

export default {
  name: 'create-invoice-form',
  components: {
    NoDataMessage,
    LoadSpinner,
    InvoiceForm,
    InvoiceConfirmation,
  },
  props: {
    horizonUrl: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      default: '',
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isTransactionSent: false,
    invoice: {},
    EVENTS,
  }),

  computed: {
    ...mapGetters('create-invoice-form', {
      assetPairs: types.assetPairs,
    }),
    ...mapGetters({
      walletEmail: vuexTypes.walletEmail,
    }),
  },

  async created () {
    try {
      await this.loadAssetPairs({ asset: config.DEFAULT_POINT_CODE })
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    ...mapActions('create-invoice-form', {
      loadAssetPairs: types.LOAD_ASSET_PAIRS,
    }),

    async initConfirmation (payload) {
      try {
        this.invoice = payload
        this.isTransactionSent = true
      } catch (e) {
        ErrorHandler.process(e)
      }
    },
  },
}
</script>
