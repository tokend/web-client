<template>
  <div class="invoice-viewer">
    <confirmation-state-viewer
      class="invoice-viewer__confirmations"
      :invoice="invoice"
    />

    <invoice-summary-viewer
      class="invoice-viewer__summary"
      :invoice="invoice"
    />
  </div>
</template>

<script>
import InvoiceSummaryViewer from './invoice-summary-viewer'
import ConfirmationStateViewer from './confirmation-state-viewer'

import { Invoice } from '../wrappers/invoice'

export default {
  name: 'invoice-viewer',
  components: {
    InvoiceSummaryViewer,
    ConfirmationStateViewer,
  },

  props: {
    invoice: { type: Invoice, required: true },
  },
}
</script>

<style scoped>
.invoice-viewer__summary {
  margin-top: 4rem;
}
</style>
