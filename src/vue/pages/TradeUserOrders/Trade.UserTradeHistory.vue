<template>
  <div class="trade-history">
    <h2 class="app__table-title">
      {{ 'user-trade-history.title' | globalize }}
    </h2>
    <template v-if="tradeHistory.length">
      <div class="app__table app__table--with-shadow">
        <table>
          <thead>
            <tr>
              <th>
                <!-- eslint-disable-next-line -->
                {{ 'user-trade-history.table-amount-lbl' | globalize({ asset: assets.base }) }}
              </th>
              <th>
                <!-- eslint-disable-next-line -->
                {{ 'user-trade-history.table-price-lbl' | globalize({ asset: assets.quote }) }}
              </th>
              <th>
                <!-- eslint-disable-next-line -->
                {{ 'user-trade-history.table-total-lbl' | globalize({ asset: assets.quote }) }}
              </th>
              <th>
                {{ 'user-trade-history.table-time-lbl' | globalize }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in tradeHistory"
              :key="`user-trade-history-row-${i}`">
              <td>{{ item.baseAmount | formatMoney }}</td>
              <td>{{ item.price | formatMoney }}</td>
              <td>{{ item.amount | formatMoney }}</td>
              <td>{{ item.date | formatCalendar }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else-if="isLoading">
      <loader :message-id="'user-trade-history.loading-msg'" />
    </template>
    <template v-else>
      <no-data-message
        :title-id="'user-trade-history.no-data-title'"
        :message-id="'user-trade-history.no-data-message'"
        :message-id-args="{ base: assets.base, quote: assets.quote }"
      />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'

export default {
  name: 'user-trade-history',
  components: {
    NoDataMessage,
    Loader,
  },
  props: {
    assets: {
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
</style>
