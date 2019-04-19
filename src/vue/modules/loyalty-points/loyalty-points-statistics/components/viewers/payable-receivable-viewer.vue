<template>
  <div class="payable-receivable-viewer">
    <div
      v-if="isLoaded"
      :data="payableReceivable"
    />

    <p v-else-if="isLoadFailed">
      {{ 'payable-receivable-viewer.loading-error-msg' | globalize }}
    </p>

    <load-spinner
      v-else
      message-id="payable-receivable-viewer.loading-msg"
    />
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'

import payableReceivableMock from '../../mocks/payable-receivable'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'payable-receivable-viewer',
  components: {
    LoadSpinner,
  },

  data: _ => ({
    payableReceivable: {},
    isLoaded: false,
  }),

  created () {
    this.loadPayableReceivable()
  },

  methods: {
    loadPayableReceivable () {
      try {
        // TODO: load payable receivable info from the API
        const { data } = payableReceivableMock
        this.payableReceivable = data
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>
