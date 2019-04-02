<template>
  <div class="incoming-state-viewer">
    <p
      v-if="invoice.isSuccessful"
      class="invoice-state-viewer__state--successful"
    >
      <i class="mdi mdi-check-circle" />
      <span>
        {{ 'create-invoice-form.payment-successful-state' | globalize }}
      </span>
    </p>

    <p
      v-else-if="invoice.isPending"
      class="invoice-state-viewer__state--pending"
    >
      <i class="mdi mdi-clock-outline" />
      <span>
        {{ 'create-invoice-form.payment-pending-state' | globalize }}
      </span>
    </p>
  </div>
</template>

<script>
import { Invoice } from '../wrappers/invoice'

export default {
  name: 'invoice-state-viewer',

  props: {
    invoice: { type: Invoice, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.invoice-state-viewer__state--successful {
  color: $col-success;
}

.invoice-state-viewer__state--pending {
  color: $col-pending;
}
</style>
