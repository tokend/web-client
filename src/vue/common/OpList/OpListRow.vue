<template>
  <tbody class="op-list-row">
    <tr class="op-list-row__brief">
      <td
        class="op-list-row__cell op-list-row__cell--date"
        :title="operation.date | formatCalendar"
      >
        {{ operation.date | formatCalendar }}
      </td>

      <td
        class="op-list-row__cell"
        :title="operation | getOpTypeTranslationId | globalize"
      >
        {{ operation | getOpTypeTranslationId | globalize }}
      </td>
      <!-- eslint-disable max-len -->
      <td
        class="op-list-row__cell"
        :title="operationAmount | formatMoney"
      >
        {{ operationAmount | formatMoney }}
      </td>
      <!-- eslint-enable max-len -->

      <td
        class="op-list-row__cell op-list-row__cell--counterparty"
        :title="operation.counterparty"
      >
        {{ operation.counterparty }}
      </td>

      <td
        class="op-list-row__cell"
        :class="`op-list-row__cell--status-${operation.state}`"
        :title="operation.state | getOpStateTranslationId | globalize"
      >
        {{ operation.state | getOpStateTranslationId | globalize }}
      </td>

      <td class="op-list-row__cell op-list-row__cell--toggle">
        <button
          class="op-list-row__btn"
          @click="isDetailsOpen = !isDetailsOpen"
        >
          <i
            class="mdi mdi-chevron-down op-list-row__details-icon"
            :class="{ 'op-list-row__details-icon--active': isDetailsOpen }"
          />
        </button>
      </td>
    </tr>

    <tr
      v-if="isDetailsOpen"
      class="op-list-row__details"
    >
      <td colspan="6">
        <div class="op-list-row__details-wrp">
          <op-list-item-details :operation="operation" />
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script>
import { OP_TYPES } from '@tokend/js-sdk'
import { TX_STATES } from '@/js/const/transaction-statuses.const'
import OpListItemDetails from './OpListItemDetails'

export default {
  name: 'op-list-row',

  components: {
    OpListItemDetails,
  },

  filters: {
    getOpTypeTranslationId (operation) {
      return {
        [OP_TYPES.createIssuanceRequest]: 'operation-names.issuance',
        [OP_TYPES.createWithdrawalRequest]: 'operation-names.withdrawal',
        [OP_TYPES.paymentV2]: 'operation-names.transfer',
        [OP_TYPES.manageOffer]: 'operation-names.order-match',
        [OP_TYPES.checkSaleState]: 'operation-names.investment',
      }[operation.typeI]
    },
    getOpStateTranslationId (state) {
      return {
        [TX_STATES.success]: 'operation-states.success',
        [TX_STATES.pending]: 'operation-states.pending',
        [TX_STATES.failed]: 'operation-states.failed',
      }[state]
    },
  },

  props: {
    operation: { type: Object, required: true },
  },

  data: () => ({
    isDetailsOpen: false,
  }),

  computed: {
    operationAmount () {
      if (this.operation.isIncoming) {
        return {
          value: this.operation.amount,
          currency: this.operation.asset,
        }
      } else {
        return {
          value: -this.operation.amount,
          currency: this.operation.asset,
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import "@/scss/variables";
@import "@/scss/mixins";
@import "op-list-variables";

$op-list-cell-side-padding: 1.5rem;
$op-list-toggle-btn-col-width: 6.7rem;

.op-list-row__brief {
  background-color: $col-block-bg;
  @include box-shadow;
}

.op-list-row__cell {
  padding: 0.7rem $op-list-cell-side-padding;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &--date {
    font-weight: 600;
  }

  &--status-success,
  &--status-pending,
  &--status-failed {
    position: relative;
    padding-left: $op-list-cell-side-padding + 1.2rem;
    width: $op-list-status-col-width;
    &:before {
      content: "";
      position: absolute;
      width: 0.6rem;
      height: 0.6rem;
      top: 50%;
      transform: translateY(-50%);
      left: $op-list-cell-side-padding;
      border-radius: 100%;
    }
  }

  &--status-success:before {
    background-color: $col-success;
  }

  &--status-pending:before {
    background-color: $col-warning;
  }

  &--status-failed:before {
    background-color: $col-error;
  }

  &--toggle {
    text-align: right;
    width: $op-list-toggle-btn-col-width;
  }
}

.op-list-row__btn {
  width: 3.7rem;
  height: 3.7rem;
  border-radius: 0.4rem;
  background-color: $col-app-content-background;
  outline: none;
  border: 0;
  box-shadow: none;

  &:hover {
    background-color: darken($col-app-content-background, 3%);
  }

  &:active {
    background-color: darken($col-app-content-background, 10%);
  }
}

.op-list-row__details-icon {
  will-change: transform;
  font-size: 1.6rem;

  &:before {
    transition: transform .2s ease-out;
  }

  &--active:before {
    transform: rotate(-180deg)
  }
}

.op-list-row__details-wrp {
  background: $col-block-bg;
  padding: 0.75rem $op-list-toggle-btn-col-width 0.7rem
    $op-list-cell-side-padding;
  margin-top: -0.6rem;
  position: relative;
  background-color: $col-block-bg;
  @include box-shadow;
  &:before {
    // HACK: to cover sticking out shadow at the top
    content: "";
    display: block;
    position: absolute;
    background: $col-block-bg;
    height: 1rem;
    top: 0;
    left: 0;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>
