<template>
  <p
    v-if="invoice.isSuccessful"
    class="invoice-state-viewer invoice-state-viewer--successful"
  >
    <i class="mdi mdi-check-circle" />
    <span>
      {{ 'create-invoice-form.payment-successful-state' | globalize }}
    </span>
  </p>

  <p
    v-else-if="invoice.isPending"
    class="invoice-state-viewer invoice-state-viewer--pending"
  >
    <i class="mdi mdi-clock-outline" />
    <span>
      {{ 'create-invoice-form.payment-pending-state' | globalize }}
    </span>
  </p>

  <p
    v-else
    class="invoice-state-viewer invoice-state-viewer--none"
  >
    <i class="mdi mdi-progress-clock" />
    <span>
      {{ 'create-invoice-form.payment-not-confirmed-state' | globalize }}
    </span>
  </p>
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
@import '~@scss/variables';

.invoice-state-viewer--successful {
  color: $col-success;
}

.invoice-state-viewer--pending {
  color: $col-pending;
}

.invoice-state-viewer--none {
  color: $col-text-secondary;
}
</style>
