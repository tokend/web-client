<template>
  <div
    class="confirmation-state-viewer"
    :class="invoice.isSuccessful
      ? 'confirmation-state-viewer--successful'
      : 'confirmation-state-viewer--pending'"
  >
    <p
      v-if="invoice.isSuccessful"
      class="confirmation-state-viewer__icon"
    >
      <i class="mdi mdi-check-circle" />
    </p>

    <p
      v-else
      class="confirmation-state-viewer__icon"
    >
      <i class="mdi mdi-timer-sand" />
    </p>

    <p class="confirmation-state-viewer__count">
      {{
        'create-invoice-form.confirmations-count' | globalize({
          current: currentConfirmationsCount,
          total: TOTAL_CONFIRMATIONS,
        })
      }}
    </p>
  </div>
</template>

<script>
import { Invoice } from '../wrappers/invoice'

const PENDING_CONFIRMATIONS = 1
const TOTAL_CONFIRMATIONS = 2

export default {
  name: 'confirmation-state-viewer',

  props: {
    invoice: { type: Invoice, required: true },
  },

  data: _ => ({
    TOTAL_CONFIRMATIONS,
  }),

  computed: {
    currentConfirmationsCount () {
      if (this.invoice.isSuccessful) {
        return TOTAL_CONFIRMATIONS
      } else {
        return PENDING_CONFIRMATIONS
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.confirmation-state-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.confirmation-state-viewer--successful {
  color: $col-success;
}

.confirmation-state-viewer--pending {
  color: $col-pending;
}

.confirmation-state-viewer__icon {
  font-size: 8rem;
}

.confirmation-state-viewer__count {
  font-size: 2.4rem;
}
</style>
