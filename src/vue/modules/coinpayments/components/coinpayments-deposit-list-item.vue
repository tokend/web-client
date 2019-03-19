<template>
  <tbody class="deposit-list-item">
    <tr
      class="deposit-list-item__tr"
      :class="{ 'deposit-list-item__tr--dark': index%2 }">
      <td class="deposit-list-item__timeout-ticker">
        <timeout-ticker :timeout="item.timeLeft" />
      </td>
      <td class="deposit-list-item__amount">
        {{ { value: item.amount, currency: item.asset } | formatMoney }}
      </td>
      <td class="deposit-list-item__btn">
        <button
          class="app__button-icon"
          @click="isAddressViewerShown = !isAddressViewerShown"
        >
          <i class="mdi mdi-view-dashboard" />
        </button>
      </td>
    </tr>
    <tr class="deposit-list-item__key-viewer-wrp" v-if="isAddressViewerShown">
      <td colspan="3">
        <key-viewer
          class="deposit-list-item__key-viewer"
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
  name: 'deposit-list-item',
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

  .deposit-list-item {
      td {
        padding: 0.5rem 1rem;
      }
    }

  .deposit-list-item__tr{
    &:hover{
      background: $col-table-row-selected;
    }
  }

  .deposit-list-item__tr--dark {
    background: $col-table-alt-row-background;
  }

  .deposit-list-item__amount {
    max-width: 24rem;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }

  .deposit-list-item__key-viewer {
    padding: 2rem;
  }

  .deposit-list-item__btn {
    width: 3.5rem;
  }
</style>
