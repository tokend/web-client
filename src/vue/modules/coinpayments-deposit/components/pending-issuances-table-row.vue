<template>
  <tbody class="deposit-table-row">
    <tr
      class="deposit-table-row__tr"
    >
      <td class="deposit-table-row__timeout-ticker">
        <timeout-ticker :end-time="endTime" />
      </td>
      <td class="deposit-table-row__amount">
        {{ { value: amount, currency: asset } | formatMoney }}
      </td>
      <td class="deposit-table-row__btn">
        <button
          class="app__button-icon"
          @click="isAddressViewerShown = !isAddressViewerShown"
        >
          <i class="mdi mdi-view-dashboard" />
        </button>
      </td>
    </tr>
    <tr class="deposit-table-row__key-viewer-wrp" v-if="isAddressViewerShown">
      <td colspan="3">
        <key-viewer
          class="deposit-table-row__key-viewer"
          :value="address"
        />
      </td>
    </tr>
  </tbody>
</template>

<script>
import TimeoutTicker from './timeout-ticker'
import KeyViewer from '@/vue/common/KeyViewer'
export default {
  name: 'deposit-table-row',
  components: {
    TimeoutTicker,
    KeyViewer,
  },
  props: {
    endTime: { type: Number, required: true }, // unix timeStamp
    amount: { type: [String, Number], required: true },
    asset: { type: String, required: true },
    address: { type: String, required: true },
  },
  data () {
    return {
      isAddressViewerShown: false,
    }
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables';

  .deposit-table-row {
    width: 100%;
    max-width: 100%;
    overflow: auto;
      td {
        padding: 0.5rem 1rem;
      }
    }

  .deposit-table-row__tr{
    &:hover{
      background: $col-table-row-selected;
    }
  }

  .deposit-table-row__amount {
    max-width: 24rem;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }

  .deposit-table-row__key-viewer {
    padding: 2rem 1rem;
  }

  .deposit-table-row__btn {
    width: 6.4rem;
  }

  .deposit-table-row__key-viewer-wrp {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }
</style>
