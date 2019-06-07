<template>
  <div
    class="confirmation-state-viewer"
    :class="`confirmation-state-viewer--${confirmationState}`"
  >
    <p
      v-if="invoice.isSuccessful"
      class="confirmation-state-viewer__icon"
    >
      <i class="mdi mdi-check-circle" />
    </p>

    <p
      v-else-if="invoice.isPending"
      class="confirmation-state-viewer__icon"
    >
      <i class="mdi mdi-timer-sand" />
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
          total: CONFIRMATIONS.total,
        })
      }}
    </p>
  </div>
</template>

<script>
import { Invoice } from '../wrappers/invoice'

const CONFIRMATIONS = {
  none: 0,
  pending: 1,
  total: 2,
}

const CONFIRMATIONS_STATES = {
  none: 'none',
  pending: 'pending',
  successful: 'successful',
}

export default {
  name: 'confirmation-state-viewer',

  props: {
    invoice: { type: Invoice, required: true },
  },

  data: _ => ({
    CONFIRMATIONS,
  }),

  computed: {
    currentConfirmationsCount () {
      if (this.invoice.isSuccessful) {
        return CONFIRMATIONS.total
      } else if (this.invoice.isPending) {
        return CONFIRMATIONS.pending
      } else {
        return CONFIRMATIONS.none
      }
    },

    confirmationState () {
      if (this.invoice.isSuccessful) {
        return CONFIRMATIONS_STATES.successful
      } else if (this.invoice.isPending) {
        return CONFIRMATIONS_STATES.pending
      } else {
        return CONFIRMATIONS_STATES.none
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.confirmation-state-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;

  &--none { color: $col-text-secondary; }
  &--pending { color: $col-pending; }
  &--successful { color: $col-success; }
}

.confirmation-state-viewer__icon {
  font-size: 8rem;
}

.confirmation-state-viewer__count {
  font-size: 2.4rem;
}
</style>
