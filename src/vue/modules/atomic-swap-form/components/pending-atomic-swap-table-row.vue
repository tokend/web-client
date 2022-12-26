<template>
  <tbody class="pending-atomic-swap-table-row">
    <tr
      class="pending-atomic-swap-table-row__tr"
    >
      <td>
        <timeout-ticker
          v-if="endTime"
          :end-time="endTime"
        />
      </td>
      <td class="pending-atomic-swap-table-row__amount">
        {{ formatMoney({ value: amount, currency: asset }) }}
      </td>
      <td class="pending-atomic-swap-table-row__btn">
        <button
          class="app__button-icon"
          @click="requestExpand"
        >
          <i class="mdi mdi-view-dashboard" />
        </button>
      </td>
    </tr>
    <tr
      class="pending-atomic-swap-table-row__key-viewer-wrp"
      v-if="expanded"
    >
      <td colspan="3">
        <key-viewer
          class="pending-atomic-swap-table-row__key-viewer"
          :value="address"
          :label="'coinpayments-deposit.address-lbl' | globalize"
        />
      </td>
    </tr>
  </tbody>
</template>

<script>
import TimeoutTicker from '@/vue/common/TimeoutTicker'
import KeyViewer from '@/vue/common/KeyViewer'
import { formatMoney } from '@/js/helpers/money-helper'

const EVENTS = {
  expandRequested: 'expand-requested',
}

export default {
  name: 'pending-atomic-swap-table-row',
  components: {
    TimeoutTicker,
    KeyViewer,
  },
  props: {
    endTime: { type: Number, required: true }, // unix timeStamp
    amount: { type: [String, Number], required: true },
    asset: { type: String, required: true },
    address: { type: String, required: true },
    expanded: { type: Boolean, required: true },
  },
  methods: {
    requestExpand () {
      this.$emit(EVENTS.expandRequested)
    },
  },
  setup () {
    return {
      formatMoney,
    }
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables';

  .pending-atomic-swap-table-row {
    width: 100%;
    max-width: 100%;
    overflow: auto;
  }

  .pending-atomic-swap-table-row td {
    padding: 0.5rem 1rem;
  }

  .pending-atomic-swap-table-row__tr {
    &:hover {
      background: $col-table-row-selected;
    }
  }

  .pending-atomic-swap-table-row__amount {
    max-width: 24rem;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }

  .pending-atomic-swap-table-row__key-viewer {
    padding: 2rem 0;
  }

  .pending-atomic-swap-table-row__btn {
    width: 6.4rem;
  }

  .pending-atomic-swap-table-row__key-viewer-wrp {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .pending-atomic-swap-table-row__key-viewer-wrp td {
    padding: 0.5rem 0;
  }
</style>
