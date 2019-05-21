<template>
  <div class="trade-history">
    <h2 class="app__table-title">
      {{ 'trade-history.title' | globalize }}
    </h2>
    <div
      class="trade-history__data-wrapper"
      :class="{'trade-history__data-wrapper--loading': isLoading}"
    >
      <template v-if="tradeHistory.length">
        <div class="app__table app__table--with-shadow">
          <table>
            <thead>
              <tr>
                <th>
                  <!-- eslint-disable-next-line -->
                  {{ 'trade-history.table-amount-lbl' | globalize({ asset: assetPair.base }) }}
                </th>
                <th>
                  <!-- eslint-disable-next-line -->
                  {{ 'trade-history.table-price-lbl' | globalize({ asset: assetPair.quote }) }}
                </th>
                <th>
                  <!-- eslint-disable-next-line -->
                  {{ 'trade-history.table-total-lbl' | globalize({ asset: assetPair.quote }) }}
                </th>
                <th>
                  {{ 'trade-history.table-time-lbl' | globalize }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in tradeHistory"
                :key="`trade-history-row-${i}`">
                <td>{{ item.baseAmount | formatMoney }}</td>
                <td>{{ item.price | formatMoney }}</td>
                <td>{{ item.quoteAmount | formatMoney }}</td>
                <td>{{ item.createdAt | formatCalendar }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else>
        <no-data-message
          class="trade-history__no-data-message-wrapper"
          :title="'trade-history.no-data-title' | globalize"
          :message="'trade-history.no-data-message' | globalize({
            base: assetPair.base,
            quote: assetPair.quote
          })"
        />
      </template>
    </div>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'

export default {
  name: 'trade-history-renderer',
  components: {
    NoDataMessage,
  },
  props: {
    assetPair: {
      type: Object,
      required: true,
      default: () => ({ base: '', quote: '' }),
    },
    tradeHistory: { type: Array, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
  },
}
</script>

<style lang="scss">
.trade-history__data-wrapper {
  min-height: 5.3rem;

  &--loading {
    filter: blur(1rem);
    transition: 0.3s -webkit-filter linear; // works on Safari v12.1
  }
}
</style>
