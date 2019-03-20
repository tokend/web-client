<template>
  <tbody class="deposit-table-row">
    <tr
      class="deposit-table-row__tr"
      :class="{ 'deposit-table-row__tr--dark': index%2 }">
      <td class="deposit-table-row__timeout-ticker">
        <timeout-ticker :timeout="item.timeLeft" />
      </td>
      <td class="deposit-table-row__amount">
        {{ { value: item.amount, currency: item.asset } | formatMoney }}
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
          :value="item.address"
        />
      </td>
    </tr>
  </tbody>
</template>

<script>
import TimeoutTicker from './coinpayments-timeout-ticker'
import KeyViewer from '@/vue/common/KeyViewer'
export default {
  name: 'deposit-table-row',
  components: {
    TimeoutTicker,
    KeyViewer,
  },
  props: {
    item: { type: Object, required: true },
    index: { type: Number, required: true },
  },
  data () {
    return {
      isAddressViewerShown: false,
    }
  },
}
</script>

<style lang="scss" scoped>
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

  .deposit-table-row__tr--dark {
    background: $col-table-alt-row-background;
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
